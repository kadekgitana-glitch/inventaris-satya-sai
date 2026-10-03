import { useState, useMemo } from 'react';
import { RotateCcw, Search, CheckCircle, Clock, Eye } from 'lucide-react';
import { formatDateTime, getStatusBadge } from '../../utils/format';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import dataService from '../../services/dataService';
import { useData } from '../../hooks/useData';

export default function PengembalianPage() {
  const [data, setData] = useData('peminjaman');
  const [searchTerm, setSearchTerm] = useState('');
  const [detailModal, setDetailModal] = useState(null);
  const [returnModal, setReturnModal] = useState(null);
  const [kondisiKembali, setKondisiKembali] = useState('baik');

  // Only show active or overdue items
  const activeLoans = useMemo(() => {
    let result = data.filter(d => d.status === 'active' || d.status === 'overdue');
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        (item.peminjam && item.peminjam.toLowerCase().includes(term)) ||
        (item.barang && item.barang.toLowerCase().includes(term))
      );
    }
    return result;
  }, [data, searchTerm]);

  const recentReturns = useMemo(() => {
    return data
      .filter(d => d.status === 'returned')
      .sort((a, b) => new Date(b.tanggalKembali || 0) - new Date(a.tanggalKembali || 0))
      .slice(0, 10);
  }, [data]);

  const handleReturn = () => {
    if (!returnModal) return;
    dataService.update('peminjaman', returnModal.id, {
      status: 'returned',
      tanggalKembali: new Date().toISOString(),
      kondisiKembali,
    });

    // Restore inventory
    if (returnModal.barangId) {
      const barang = dataService.getById('inventaris', returnModal.barangId);
      if (barang) {
        dataService.update('inventaris', returnModal.barangId, {
          status: 'tersedia',
          jumlah: (barang.jumlah || 0) + (parseInt(returnModal.jumlah) || 1),
          kondisi: kondisiKembali,
        });
      }
    }

    setData(dataService.getAll('peminjaman'));
    setReturnModal(null);
    setKondisiKembali('baik');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pengembalian Barang</h1>
          <p className="page-subtitle">Proses pengembalian barang yang sedang dipinjam</p>
        </div>
      </div>

      {/* Active Loans */}
      <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="header-search" style={{ width: '300px', flex: '1 1 auto' }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Cari peminjam atau barang..."
              className="search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
            {activeLoans.length} barang belum dikembalikan
          </span>
        </div>
      </div>

      <div className="table-container" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="table-header">
          <div className="table-title">Barang yang Belum Dikembalikan</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Peminjam</th>
                <th>Barang</th>
                <th>Jumlah</th>
                <th>Tgl Pinjam</th>
                <th>Batas Kembali</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {activeLoans.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>
                    Semua barang sudah dikembalikan! 🎉
                  </td>
                </tr>
              ) : activeLoans.map((item, idx) => {
                const badge = getStatusBadge(item.status);
                return (
                  <tr key={item.id}>
                    <td style={{ color: 'var(--text-tertiary)' }}>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.peminjam}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{item.kelas}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{item.barang}</td>
                    <td>{item.jumlah}</td>
                    <td>{formatDateTime(item.tanggalPinjam)}</td>
                    <td>{formatDateTime(item.batasKembali)}</td>
                    <td><span className={`badge badge-${badge.variant}`}>{badge.label}</span></td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                        <button className="btn btn-sm btn-success" onClick={() => { setReturnModal(item); setKondisiKembali('baik'); }}>
                          <CheckCircle size={14} /> Kembalikan
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

      {/* Recent Returns */}
      {recentReturns.length > 0 && (
        <div className="table-container">
          <div className="table-header">
            <div className="table-title">Riwayat Pengembalian Terakhir</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Peminjam</th>
                  <th>Barang</th>
                  <th>Tgl Kembali</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReturns.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.peminjam}</td>
                    <td>{item.barang}</td>
                    <td>{formatDateTime(item.tanggalKembali)}</td>
                    <td><span className="badge badge-success">Dikembalikan</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Return Modal */}
      <Modal isOpen={!!returnModal} onClose={() => setReturnModal(null)} title="Proses Pengembalian" size="sm">
        {returnModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Barang</span>
                <span className="detail-value">{returnModal.barang}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Peminjam</span>
                <span className="detail-value">{returnModal.peminjam}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Jumlah</span>
                <span className="detail-value">{returnModal.jumlah}</span>
              </div>
            </div>
            <div className="input-group">
              <label>Kondisi Barang saat Dikembalikan</label>
              <select className="input" value={kondisiKembali} onChange={e => setKondisiKembali(e.target.value)}>
                <option value="baik">Baik</option>
                <option value="rusak_ringan">Rusak Ringan</option>
                <option value="rusak_berat">Rusak Berat</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setReturnModal(null)}>Batal</button>
              <button className="btn btn-success" style={{ flex: 1 }} onClick={handleReturn}>
                <CheckCircle size={16} /> Konfirmasi Kembali
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
