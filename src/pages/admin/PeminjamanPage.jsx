import { useState, useMemo } from 'react';
import { ClipboardList, Plus, Search, CheckCircle, Clock, Eye, Trash2 } from 'lucide-react';
import { formatDateTime, getStatusBadge } from '../../utils/format';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import dataService from '../../services/dataService';

export default function PeminjamanPage() {
  const [data, setData] = useState(() => dataService.getAll('peminjaman'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [returnModal, setReturnModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({});

  const inventarisList = useMemo(() =>
    dataService.getAll('inventaris').filter(i => i.status === 'tersedia' && i.jumlah > 0),
  []);

  const filteredData = useMemo(() => {
    let result = data;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        (item.id && item.id.toLowerCase().includes(term)) ||
        (item.peminjam && item.peminjam.toLowerCase().includes(term)) ||
        (item.barang && item.barang.toLowerCase().includes(term))
      );
    }
    if (filterStatus) {
      result = result.filter(item => item.status === filterStatus);
    }
    return result;
  }, [data, searchTerm, filterStatus]);

  const openAdd = () => {
    setFormData({
      barangId: '', barang: '', peminjam: '', kelas: '',
      tanggalPinjam: new Date().toISOString().slice(0, 16),
      batasKembali: '', jumlah: 1, catatan: ''
    });
    setModalOpen(true);
  };

  const handleBarangChange = (barangId) => {
    const item = dataService.getById('inventaris', barangId);
    setFormData(prev => ({
      ...prev,
      barangId,
      barang: item ? item.nama : '',
    }));
  };

  const handleSave = () => {
    if (!formData.barang?.trim()) { alert('Barang wajib dipilih'); return; }
    if (!formData.peminjam?.trim()) { alert('Nama peminjam wajib diisi'); return; }
    if (!formData.tanggalPinjam) { alert('Tanggal pinjam wajib diisi'); return; }
    if (!formData.batasKembali) { alert('Batas kembali wajib diisi'); return; }

    const newPinjaman = {
      ...formData,
      status: 'active',
      tanggalKembali: '',
    };
    dataService.add('peminjaman', newPinjaman);

    // Update barang status to dipinjam
    if (formData.barangId) {
      const barang = dataService.getById('inventaris', formData.barangId);
      if (barang) {
        const newJumlah = Math.max(0, (barang.jumlah || 0) - (parseInt(formData.jumlah) || 1));
        dataService.update('inventaris', formData.barangId, {
          status: newJumlah === 0 ? 'dipinjam' : 'tersedia',
          jumlah: newJumlah,
        });
      }
    }

    setData(dataService.getAll('peminjaman'));
    setModalOpen(false);
  };

  const handleReturn = () => {
    if (!returnModal) return;
    dataService.update('peminjaman', returnModal.id, {
      status: 'returned',
      tanggalKembali: new Date().toISOString(),
    });

    // Restore inventory
    if (returnModal.barangId) {
      const barang = dataService.getById('inventaris', returnModal.barangId);
      if (barang) {
        dataService.update('inventaris', returnModal.barangId, {
          status: 'tersedia',
          jumlah: (barang.jumlah || 0) + (parseInt(returnModal.jumlah) || 1),
        });
      }
    }

    setData(dataService.getAll('peminjaman'));
    setReturnModal(null);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    dataService.delete('peminjaman', deleteConfirm.id);
    setData(dataService.getAll('peminjaman'));
    setDeleteConfirm(null);
  };

  const stats = useMemo(() => ({
    active: data.filter(d => d.status === 'active').length,
    overdue: data.filter(d => d.status === 'overdue').length,
    returned: data.filter(d => d.status === 'returned').length,
  }), [data]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Daftar Peminjaman</h1>
          <p className="page-subtitle">Monitoring peminjaman dan pengembalian aset</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} />
          <span>Pinjamkan Barang</span>
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', cursor: 'pointer', borderColor: filterStatus === 'active' ? 'var(--warning)' : undefined }} onClick={() => setFilterStatus(f => f === 'active' ? '' : 'active')}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Aktif</div>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--warning)' }}>{stats.active}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', cursor: 'pointer', borderColor: filterStatus === 'overdue' ? 'var(--danger)' : undefined }} onClick={() => setFilterStatus(f => f === 'overdue' ? '' : 'overdue')}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Terlambat</div>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--danger)' }}>{stats.overdue}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', cursor: 'pointer', borderColor: filterStatus === 'returned' ? 'var(--success)' : undefined }} onClick={() => setFilterStatus(f => f === 'returned' ? '' : 'returned')}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Dikembalikan</div>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--success)' }}>{stats.returned}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="header-search" style={{ width: '300px', flex: '1 1 auto' }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Cari nama peminjam atau barang..."
              className="search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {filterStatus && (
            <button className="btn btn-sm btn-ghost" onClick={() => setFilterStatus('')}>
              ✕ Reset Filter
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-title">Transaksi Peminjaman</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>ID Transaksi</th>
                <th>Peminjam</th>
                <th>Barang</th>
                <th>Jumlah</th>
                <th>Tgl Pinjam</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>
                    {searchTerm || filterStatus ? 'Tidak ditemukan data yang sesuai.' : 'Belum ada data peminjaman.'}
                  </td>
                </tr>
              ) : filteredData.map((item, idx) => {
                const badgeStatus = getStatusBadge(item.status);

                return (
                  <tr key={item.id}>
                    <td style={{ color: 'var(--text-tertiary)' }}>{idx + 1}</td>
                    <td><span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>{item.id}</span></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.peminjam}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{item.kelas}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{item.barang}</td>
                    <td>{item.jumlah}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} style={{ color: 'var(--text-tertiary)' }} />
                        <span>{formatDateTime(item.tanggalPinjam)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${badgeStatus.variant}`}>{badgeStatus.label}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                        {item.status !== 'returned' && (
                          <button className="btn btn-sm btn-success" onClick={() => setReturnModal(item)}>
                            <CheckCircle size={14} /> Kembalikan
                          </button>
                        )}
                        <button className="btn-icon" style={{ color: 'var(--info)' }} title="Detail" onClick={() => setDetailModal(item)}>
                          <Eye size={18} />
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

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Pinjamkan Barang" size="lg">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label>Barang yang Dipinjam <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select className="input" value={formData.barangId || ''} onChange={e => handleBarangChange(e.target.value)}>
              <option value="">-- Pilih Barang --</option>
              {inventarisList.map(b => (
                <option key={b.id} value={b.id}>{b.nama} (Stok: {b.jumlah})</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Nama Peminjam <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input className="input" placeholder="Nama lengkap peminjam" value={formData.peminjam || ''} onChange={e => setFormData(prev => ({ ...prev, peminjam: e.target.value }))} />
          </div>
          <div className="input-group">
            <label>Kelas / Jabatan</label>
            <input className="input" placeholder="Contoh: XII TKJ 1 / Guru" value={formData.kelas || ''} onChange={e => setFormData(prev => ({ ...prev, kelas: e.target.value }))} />
          </div>
          <div className="input-group">
            <label>Tanggal & Jam Pinjam <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="datetime-local" className="input" value={formData.tanggalPinjam || ''} onChange={e => setFormData(prev => ({ ...prev, tanggalPinjam: e.target.value }))} />
          </div>
          <div className="input-group">
            <label>Batas Kembali <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="datetime-local" className="input" value={formData.batasKembali || ''} onChange={e => setFormData(prev => ({ ...prev, batasKembali: e.target.value }))} />
          </div>
          <div className="input-group">
            <label>Jumlah</label>
            <input type="number" className="input" min="1" value={formData.jumlah || 1} onChange={e => setFormData(prev => ({ ...prev, jumlah: parseInt(e.target.value) || 1 }))} />
          </div>
          <div className="input-group">
            <label>Catatan</label>
            <input className="input" placeholder="Keperluan peminjaman (opsional)" value={formData.catatan || ''} onChange={e => setFormData(prev => ({ ...prev, catatan: e.target.value }))} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setModalOpen(false)}>Batal</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Simpan Peminjaman</button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title="Detail Peminjaman">
        {detailModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="detail-grid">
              {[
                ['ID Transaksi', detailModal.id],
                ['Barang', detailModal.barang],
                ['Peminjam', detailModal.peminjam],
                ['Kelas/Jabatan', detailModal.kelas || '-'],
                ['Jumlah', detailModal.jumlah],
                ['Tanggal Pinjam', formatDateTime(detailModal.tanggalPinjam)],
                ['Batas Kembali', formatDateTime(detailModal.batasKembali)],
                ['Tanggal Kembali', detailModal.tanggalKembali ? formatDateTime(detailModal.tanggalKembali) : 'Belum dikembalikan'],
                ['Status', getStatusBadge(detailModal.status).label],
                ['Catatan', detailModal.catatan || '-'],
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

      {/* Return Confirmation */}
      <ConfirmDialog
        isOpen={!!returnModal}
        onClose={() => setReturnModal(null)}
        onConfirm={handleReturn}
        title="Proses Pengembalian"
        message={`Konfirmasi pengembalian "${returnModal?.barang}" dari ${returnModal?.peminjam}?`}
        confirmText="Ya, Kembalikan"
        variant="success"
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Hapus Data Peminjaman"
        message={`Apakah Anda yakin ingin menghapus data peminjaman "${deleteConfirm?.id}"?`}
      />
    </div>
  );
}
