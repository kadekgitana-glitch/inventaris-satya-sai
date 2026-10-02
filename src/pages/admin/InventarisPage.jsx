import { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Filter, Eye } from 'lucide-react';
import { formatCurrency, getStatusBadge } from '../../utils/format';

const dummyData = [
  { id: 'INV-001', kode: 'BRG-ELK-001', nama: 'Laptop Asus ROG Strix', kategori: 'Elektronik', lokasi: 'Lab Komputer 1', kondisi: 'baik', status: 'tersedia', jumlah: 2, harga: 15000000, foto: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200&h=200&fit=crop' },
  { id: 'INV-002', kode: 'BRG-ELK-002', nama: 'Proyektor Epson EB-X51', kategori: 'Elektronik', lokasi: 'Ruang Kelas XI-A', kondisi: 'baik', status: 'dipinjam', jumlah: 1, harga: 5500000, foto: 'https://images.unsplash.com/photo-1599526749666-88032baee8d6?w=200&h=200&fit=crop' },
  { id: 'INV-003', kode: 'BRG-FURN-001', nama: 'Meja Guru Jati', kategori: 'Furniture', lokasi: 'Ruang Guru', kondisi: 'rusak_ringan', status: 'tersedia', jumlah: 12, harga: 1200000, foto: 'https://images.unsplash.com/photo-1595514535415-84b395d8eb57?w=200&h=200&fit=crop' },
  { id: 'INV-004', kode: 'BRG-ELK-003', nama: 'Printer Canon Pixma', kategori: 'Elektronik', lokasi: 'Ruang TU', kondisi: 'rusak_berat', status: 'habis', jumlah: 0, harga: 2300000, foto: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200&h=200&fit=crop' },
  { id: 'INV-005', kode: 'BRG-FURN-002', nama: 'Kursi Siswa Chitose', kategori: 'Furniture', lokasi: 'Gudang Utama', kondisi: 'baik', status: 'tersedia', jumlah: 45, harga: 350000, foto: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=200&h=200&fit=crop' },
];

export default function InventarisPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Inventaris</h1>
          <p className="page-subtitle">Kelola seluruh barang inventaris sekolah</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          <span>Tambah Barang</span>
        </button>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div className="header-search" style={{ width: '300px', flex: '1 1 auto' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Cari kode atau nama barang..." 
              className="search-input" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary">
            <Filter size={18} />
            <span>Filter Kategori</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-title">Daftar Aset</div>
          <div className="table-actions">
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Total: 5 barang</span>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Kode Barang</th>
                <th>Nama Barang</th>
                <th>Kategori & Lokasi</th>
                <th>Kondisi</th>
                <th>Status</th>
                <th>Stok</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map(item => {
                const badgeKondisi = getStatusBadge(item.kondisi);
                const badgeStatus = getStatusBadge(item.status);
                
                return (
                  <tr key={item.id}>
                    <td>
                      <img src={item.foto} alt={item.nama} className="photo-thumb" />
                    </td>
                    <td><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.kode}</span></td>
                    <td style={{ fontWeight: 600 }}>{item.nama}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="badge badge-neutral">{item.kategori}</span>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{item.lokasi}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${badgeKondisi.variant}`}>{badgeKondisi.label}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${badgeStatus.variant}`}>{badgeStatus.label}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{item.jumlah}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                        <button className="btn-icon" style={{ color: 'var(--info)' }} title="Detail">
                          <Eye size={18} />
                        </button>
                        <button className="btn-icon" style={{ color: 'var(--warning)' }} title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon" style={{ color: 'var(--danger)' }} title="Hapus">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
