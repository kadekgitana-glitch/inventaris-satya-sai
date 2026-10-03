import { useState, useMemo } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Filter, Eye, X, Camera } from 'lucide-react';
import { formatCurrency, getStatusBadge } from '../../utils/format';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import dataService from '../../services/dataService';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { useData } from '../../hooks/useData';

export default function InventarisPage() {
  const [data, setData] = useData('inventaris');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({});

  const kategoriList = useMemo(() => dataService.getAll('kategori'), []);
  const lokasiList = useMemo(() => dataService.getAll('lokasi'), []);

  const filteredData = useMemo(() => {
    let result = data;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        (item.kode && item.kode.toLowerCase().includes(term)) ||
        (item.nama && item.nama.toLowerCase().includes(term)) ||
        (item.kategori && item.kategori.toLowerCase().includes(term)) ||
        (item.lokasi && item.lokasi.toLowerCase().includes(term))
      );
    }
    if (filterKategori) {
      result = result.filter(item => item.kategori === filterKategori);
    }
    return result;
  }, [data, searchTerm, filterKategori]);

  const emptyForm = () => ({
    kode: '', nama: '', kategori: '', lokasi: '', kondisi: 'baik', status: 'tersedia',
    jumlah: 1, harga: 0, foto: '', tanggalMasuk: new Date().toISOString().split('T')[0], 
    tahun: new Date().getFullYear(), sumberDana: '', keterangan: ''
  });

  const openAdd = () => {
    setEditItem(null);
    setFormData(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, foto: url }));
    } catch (err) {
      alert(err.message || 'Gagal upload foto');
    }
    setUploading(false);
  };

  const handleSave = () => {
    if (!formData.nama?.trim()) { alert('Nama barang wajib diisi'); return; }
    if (!formData.kategori) { alert('Kategori wajib dipilih'); return; }
    if (!formData.lokasi) { alert('Lokasi wajib dipilih'); return; }

    if (editItem) {
      dataService.update('inventaris', editItem.id, formData);
    } else {
      if (!formData.kode?.trim()) {
        const prefix = formData.kategori ? formData.kategori.substring(0, 3).toUpperCase() : 'BRG';
        const count = data.filter(d => d.kategori === formData.kategori).length + 1;
        formData.kode = `BRG-${prefix}-${String(count).padStart(3, '0')}`;
      }
      dataService.add('inventaris', formData);
    }
    setData(dataService.getAll('inventaris'));
    setModalOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    dataService.delete('inventaris', deleteConfirm.id);
    setData(dataService.getAll('inventaris'));
    setDeleteConfirm(null);
  };

  const uniqueKategori = useMemo(() => [...new Set(data.map(d => d.kategori).filter(Boolean))], [data]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Inventaris</h1>
          <p className="page-subtitle">Kelola seluruh barang inventaris sekolah</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} />
          <span>Tambah Barang</span>
        </button>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
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
          <select
            className="input"
            style={{ width: 'auto', minWidth: '180px' }}
            value={filterKategori}
            onChange={e => setFilterKategori(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {uniqueKategori.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
            {filteredData.length} dari {data.length} barang
          </span>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-title">Daftar Aset</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Foto</th>
                <th>Kode Barang</th>
                <th>Nama Barang</th>
                <th>Kategori & Lokasi</th>
                <th>Tahun</th>
                <th>Sumber Dana</th>
                <th>Kondisi</th>
                <th>Status</th>
                <th>Stok</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>
                    {searchTerm || filterKategori ? 'Tidak ditemukan data yang sesuai.' : 'Belum ada data inventaris. Klik "Tambah Barang" untuk memulai.'}
                  </td>
                </tr>
              ) : filteredData.map((item, idx) => {
                const badgeKondisi = getStatusBadge(item.kondisi);
                const badgeStatus = getStatusBadge(item.status);

                return (
                  <tr key={item.id}>
                    <td style={{ color: 'var(--text-tertiary)' }}>{idx + 1}</td>
                    <td>
                      {item.foto ? (
                        <img src={item.foto} alt={item.nama} className="photo-thumb" />
                      ) : (
                        <div className="photo-thumb-placeholder"><Package size={18} /></div>
                      )}
                    </td>
                    <td><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.kode}</span></td>
                    <td style={{ fontWeight: 600 }}>{item.nama}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="badge badge-neutral">{item.kategori}</span>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{item.lokasi}</span>
                      </div>
                    </td>
                    <td>{item.tahun || '-'}</td>
                    <td>{item.sumberDana || '-'}</td>
                    <td>
                      <span className={`badge badge-${badgeKondisi.variant}`}>{badgeKondisi.label}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${badgeStatus.variant}`}>{badgeStatus.label}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{item.jumlah}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                        <button className="btn-icon" style={{ color: 'var(--info)' }} title="Detail" onClick={() => setDetailModal(item)}>
                          <Eye size={18} />
                        </button>
                        <button className="btn-icon" style={{ color: 'var(--warning)' }} title="Edit" onClick={() => openEdit(item)}>
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon" style={{ color: 'var(--danger)' }} title="Hapus" onClick={() => setDeleteConfirm(item)}>
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        title={editItem ? 'Edit Barang Inventaris' : 'Tambah Barang Inventaris'}
        size="lg"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label>Kode Barang {editItem && <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>(opsional)</span>}</label>
            <input className="input" placeholder="Otomatis jika kosong" value={formData.kode || ''} onChange={e => setFormData(prev => ({ ...prev, kode: e.target.value }))} />
          </div>
          <div className="input-group">
            <label>Nama Barang <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input className="input" placeholder="Masukkan nama barang" value={formData.nama || ''} onChange={e => setFormData(prev => ({ ...prev, nama: e.target.value }))} />
          </div>
          <div className="input-group">
            <label>Kategori <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select className="input" value={formData.kategori || ''} onChange={e => setFormData(prev => ({ ...prev, kategori: e.target.value }))}>
              <option value="">-- Pilih Kategori --</option>
              {kategoriList.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Lokasi <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select className="input" value={formData.lokasi || ''} onChange={e => setFormData(prev => ({ ...prev, lokasi: e.target.value }))}>
              <option value="">-- Pilih Lokasi --</option>
              {lokasiList.map(l => <option key={l.id} value={l.nama}>{l.nama}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Kondisi</label>
            <select className="input" value={formData.kondisi || 'baik'} onChange={e => setFormData(prev => ({ ...prev, kondisi: e.target.value }))}>
              <option value="baik">Baik</option>
              <option value="rusak_ringan">Rusak Ringan</option>
              <option value="rusak_berat">Rusak Berat</option>
            </select>
          </div>
          <div className="input-group">
            <label>Status</label>
            <select className="input" value={formData.status || 'tersedia'} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}>
              <option value="tersedia">Tersedia</option>
              <option value="dipinjam">Dipinjam</option>
              <option value="habis">Habis</option>
            </select>
          </div>
          <div className="input-group">
            <label>Jumlah</label>
            <input type="number" className="input" min="0" value={formData.jumlah || 0} onChange={e => setFormData(prev => ({ ...prev, jumlah: parseInt(e.target.value) || 0 }))} />
          </div>
          <div className="input-group">
            <label>Harga Satuan (Rp)</label>
            <input type="number" className="input" min="0" value={formData.harga || 0} onChange={e => setFormData(prev => ({ ...prev, harga: parseInt(e.target.value) || 0 }))} />
          </div>
          <div className="input-group">
            <label>Tanggal Masuk</label>
            <input type="date" className="input" value={formData.tanggalMasuk || ''} onChange={e => setFormData(prev => ({ ...prev, tanggalMasuk: e.target.value }))} />
          </div>
          <div className="input-group">
            <label>Tahun Pengadaan</label>
            <input type="number" className="input" placeholder="Contoh: 2024" value={formData.tahun || ''} onChange={e => setFormData(prev => ({ ...prev, tahun: parseInt(e.target.value) || '' }))} />
          </div>
          <div className="input-group">
            <label>Sumber Dana</label>
            <input className="input" placeholder="Contoh: BOS, Komite" value={formData.sumberDana || ''} onChange={e => setFormData(prev => ({ ...prev, sumberDana: e.target.value }))} />
          </div>
          <div className="input-group">
            <label>Foto</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                <Camera size={16} /> {uploading ? 'Mengupload...' : 'Upload Foto'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} disabled={uploading} />
              </label>
              {formData.foto && <img src={formData.foto} alt="preview" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />}
            </div>
          </div>
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label>Keterangan</label>
            <textarea className="input" rows={2} placeholder="Catatan tambahan (opsional)" value={formData.keterangan || ''} onChange={e => setFormData(prev => ({ ...prev, keterangan: e.target.value }))} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setModalOpen(false); setEditItem(null); }}>Batal</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>{editItem ? 'Simpan Perubahan' : 'Tambah Barang'}</button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={!!detailModal}
        onClose={() => setDetailModal(null)}
        title="Detail Barang Inventaris"
      >
        {detailModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {detailModal.foto && (
              <div style={{ textAlign: 'center' }}>
                <img src={detailModal.foto} alt={detailModal.nama} style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
              </div>
            )}
            <div className="detail-grid">
              {[
                ['Kode Barang', detailModal.kode],
                ['Nama Barang', detailModal.nama],
                ['Kategori', detailModal.kategori],
                ['Lokasi', detailModal.lokasi],
                ['Tahun Pengadaan', detailModal.tahun || '-'],
                ['Sumber Dana', detailModal.sumberDana || '-'],
                ['Kondisi', getStatusBadge(detailModal.kondisi).label],
                ['Status', getStatusBadge(detailModal.status).label],
                ['Jumlah', detailModal.jumlah],
                ['Harga Satuan', formatCurrency(detailModal.harga)],
                ['Total Nilai', formatCurrency(detailModal.harga * detailModal.jumlah)],
                ['Tanggal Masuk', detailModal.tanggalMasuk || '-'],
                ['Keterangan', detailModal.keterangan || '-'],
              ].map(([label, value], i) => (
                <div key={i} className="detail-item">
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary" onClick={() => setDetailModal(null)}>Tutup</button>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Hapus Barang"
        message={`Apakah Anda yakin ingin menghapus "${deleteConfirm?.nama || ''}"? Data barang ini akan dihapus permanen.`}
      />
    </div>
  );
}
