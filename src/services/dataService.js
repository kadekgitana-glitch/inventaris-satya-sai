import { db } from '../lib/firebase';
import { ref, set, get, remove, push, onValue, off } from 'firebase/database';
import { storage } from '../utils/storage';

// Local-first data service with Firebase Realtime Database sync

const COLLECTIONS = {
  kategori: 'kategori',
  lokasi: 'lokasi',
  supplier: 'supplier',
  inventaris: 'inventaris',
  peminjaman: 'peminjaman',
  mutasi_masuk: 'mutasi_masuk',
  mutasi_keluar: 'mutasi_keluar',
  atk_restock: 'atk_restock',
  atk_withdraw: 'atk_withdraw',
  kebersihan_restock: 'kebersihan_restock',
  kebersihan_withdraw: 'kebersihan_withdraw',
};

// Default seed data
const SEED_DATA = {
  kategori: [
    { id: 'KAT-01', nama: 'Elektronik', deskripsi: 'Perangkat keras, komputer, proyektor' },
    { id: 'KAT-02', nama: 'Furniture', deskripsi: 'Meja, kursi, lemari' },
    { id: 'KAT-03', nama: 'Alat Olahraga', deskripsi: 'Bola, net, matras' },
    { id: 'KAT-04', nama: 'ATK', deskripsi: 'Alat tulis kantor habis pakai' },
    { id: 'KAT-05', nama: 'Alat Kebersihan', deskripsi: 'Sapu, pel, sabun, cairan pembersih' },
  ],
  lokasi: [
    { id: 'LOK-01', nama: 'Ruang Guru', gedung: 'Gedung Utama', pic: 'Drs. Supardi' },
    { id: 'LOK-02', nama: 'Lab Komputer 1', gedung: 'Gedung Lab', pic: 'Budi Santoso, S.Kom' },
    { id: 'LOK-03', nama: 'Ruang Kelas XI-A', gedung: 'Gedung B', pic: 'Ni Wayan Sari, S.Pd' },
    { id: 'LOK-04', nama: 'Gudang Utama', gedung: 'Gedung Belakang', pic: 'Made Pasek' },
  ],
  supplier: [
    { id: 'SUP-01', nama: 'CV Maju Jaya', kontak: '0361-234567', alamat: 'Jl. Teuku Umar No. 45, Denpasar', email: 'majujaya@email.com' },
    { id: 'SUP-02', nama: 'PT Teknologi Nusantara', kontak: '0361-876543', alamat: 'Jl. Bypass Ngurah Rai No. 12, Badung', email: 'tekno@email.com' },
    { id: 'SUP-03', nama: 'UD Bali Makmur', kontak: '0361-345678', alamat: 'Jl. Gatot Subroto No. 78, Denpasar', email: 'balimakmur@email.com' },
  ],
  inventaris: [
    { id: 'INV-001', kode: 'BRG-ELK-001', nama: 'Laptop Asus ROG Strix', kategori: 'Elektronik', lokasi: 'Lab Komputer 1', kondisi: 'baik', status: 'tersedia', jumlah: 2, harga: 15000000, foto: '', tanggalMasuk: '2023-06-15', keterangan: 'Pembelian tahun ajaran 2023/2024' },
    { id: 'INV-002', kode: 'BRG-ELK-002', nama: 'Proyektor Epson EB-X51', kategori: 'Elektronik', lokasi: 'Ruang Kelas XI-A', kondisi: 'baik', status: 'dipinjam', jumlah: 1, harga: 5500000, foto: '', tanggalMasuk: '2023-03-10', keterangan: 'Hibah dari komite sekolah' },
    { id: 'INV-003', kode: 'BRG-FURN-001', nama: 'Meja Guru Jati', kategori: 'Furniture', lokasi: 'Ruang Guru', kondisi: 'rusak_ringan', status: 'tersedia', jumlah: 12, harga: 1200000, foto: '', tanggalMasuk: '2022-01-05', keterangan: '' },
    { id: 'INV-004', kode: 'BRG-ELK-003', nama: 'Printer Canon Pixma', kategori: 'Elektronik', lokasi: 'Ruang TU', kondisi: 'rusak_berat', status: 'tersedia', jumlah: 1, harga: 2300000, foto: '', tanggalMasuk: '2021-08-20', keterangan: 'Perlu diganti' },
    { id: 'INV-005', kode: 'BRG-FURN-002', nama: 'Kursi Siswa Chitose', kategori: 'Furniture', lokasi: 'Gudang Utama', kondisi: 'baik', status: 'tersedia', jumlah: 45, harga: 350000, foto: '', tanggalMasuk: '2023-07-01', keterangan: 'Stok cadangan' },
  ],
  peminjaman: [
    { id: 'PJM-001', barangId: 'INV-002', barang: 'Proyektor Epson EB-X51', peminjam: 'Bpk. Budi Santoso', kelas: 'Guru Umum', tanggalPinjam: '2023-10-15T07:30:00', batasKembali: '2023-10-15T15:00:00', tanggalKembali: '', status: 'active', jumlah: 1, catatan: 'Untuk presentasi rapat' },
    { id: 'PJM-002', barangId: 'INV-001', barang: 'Laptop Asus ROG Strix', peminjam: 'Andi Pratama', kelas: 'XII TKJ 1', tanggalPinjam: '2023-10-14T08:00:00', batasKembali: '2023-10-14T12:00:00', tanggalKembali: '', status: 'overdue', jumlah: 1, catatan: 'Praktikum jaringan' },
    { id: 'PJM-003', barangId: 'INV-005', barang: 'Kursi Siswa Chitose', peminjam: 'Drs. I Wayan', kelas: 'Guru Olahraga', tanggalPinjam: '2023-10-10T09:00:00', batasKembali: '2023-10-10T11:00:00', tanggalKembali: '2023-10-10T10:45:00', status: 'returned', jumlah: 5, catatan: 'Acara olahraga' },
  ],
};

function generateId(prefix = 'ID') {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

const ID_PREFIXES = {
  kategori: 'KAT',
  lokasi: 'LOK',
  supplier: 'SUP',
  inventaris: 'INV',
  peminjaman: 'PJM',
  mutasi_masuk: 'MMS',
  mutasi_keluar: 'MKL',
  atk_restock: 'ARS',
  atk_withdraw: 'AWD',
  kebersihan_restock: 'KRS',
  kebersihan_withdraw: 'KWD',
};

// Initialize data from localStorage, seed if empty
function initCollection(collection) {
  const key = `data_${collection}`;
  let data = storage.get(key, null);
  if (data === null) {
    data = SEED_DATA[collection] || [];
    storage.set(key, data);
  }
  return data;
}

// Data Service
const dataService = {
  // Get all items in a collection
  getAll(collection) {
    return initCollection(collection);
  },

  // Get single item by ID
  getById(collection, id) {
    const items = this.getAll(collection);
    return items.find(item => item.id === id) || null;
  },

  // Add new item
  add(collection, item) {
    const items = this.getAll(collection);
    const prefix = ID_PREFIXES[collection] || 'ID';
    const newItem = {
      ...item,
      id: item.id || generateId(prefix),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    storage.set(`data_${collection}`, items);

    // Sync to Firebase (fire & forget)
    syncToFirebase(collection, items);

    return newItem;
  },

  // Update existing item
  update(collection, id, updates) {
    const items = this.getAll(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updates,
      id, // preserve original id
      updatedAt: new Date().toISOString(),
    };
    storage.set(`data_${collection}`, items);

    syncToFirebase(collection, items);

    return items[index];
  },

  // Delete item
  delete(collection, id) {
    let items = this.getAll(collection);
    items = items.filter(item => item.id !== id);
    storage.set(`data_${collection}`, items);

    syncToFirebase(collection, items);

    return true;
  },

  // Search/filter items
  search(collection, searchTerm, fields = ['nama']) {
    const items = this.getAll(collection);
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item =>
      fields.some(field => {
        const val = item[field];
        return val && String(val).toLowerCase().includes(term);
      })
    );
  },

  // Get count
  count(collection) {
    return this.getAll(collection).length;
  },

  // Clear & reseed a collection
  reset(collection) {
    const data = SEED_DATA[collection] || [];
    storage.set(`data_${collection}`, data);
    return data;
  },
};

// Firebase sync helper
async function syncToFirebase(collection, data) {
  try {
    const dbRef = ref(db, `inventaris_app/${collection}`);
    await set(dbRef, data);
  } catch (err) {
    console.warn(`Firebase sync failed for ${collection}:`, err.message);
  }
}

export default dataService;
export { generateId, ID_PREFIXES };
