import { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Eye, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/format';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import dataService from '../../services/dataService';
import { useData } from '../../hooks/useData';

export default function StockPage({ collection, title, subtitle, direction = 'masuk', fields = [] }) {
  const [data, setData] = useData(collection);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({});

  const isMasuk = direction === 'masuk';
  const DirectionIcon = isMasuk ? ArrowUpCircle : ArrowDownCircle;
  const accentColor = isMasuk ? 'var(--success)' : 'var(--warning)';

  const defaultFields = [
    { key: 'namaBarang', label: 'Nama Barang', required: true },
    { key: 'jumlah', label: 'Jumlah', type: 'number', required: true },
    { key: 'satuan', label: 'Satuan', required: true, placeholder: 'pcs / rim / botol / buah' },
    { key: 'tanggal', label: 'Tanggal', type: 'date', required: true },
    ...(isMasuk
      ? [
          { key: 'sumber', label: 'Sumber / Supplier', required: false },
          { key: 'harga', label: 'Harga Total (Rp)', type: 'number', required: false },
        ]
      : [
          { key: 'penerima', label: isMasuk ? 'Sumber' : 'Penerima / Tujuan', required: false },
        ]
    ),
    { key: 'keterangan', label: 'Keterangan', type: 'textarea', required: false },
  ];

  const activeFields = fields.length > 0 ? fields : defaultFields;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(item =>
      (item.namaBarang && item.namaBarang.toLowerCase().includes(term)) ||
      (item.sumber && item.sumber.toLowerCase().includes(term)) ||
      (item.penerima && item.penerima.toLowerCase().includes(term)) ||
      (item.keterangan && item.keterangan.toLowerCase().includes(term))
    );
  }, [data, searchTerm]);

  const openAdd = () => {
    const empty = {};
    activeFields.forEach(f => {
      if (f.key === 'tanggal') empty[f.key] = new Date().toISOString().split('T')[0];
      else if (f.type === 'number') empty[f.key] = f.key === 'jumlah' ? 1 : 0;
      else empty[f.key] = '';
    });
    setFormData(empty);
    setModalOpen(true);
  };

  const handleSave = () => {
    for (const f of activeFields) {
      if (f.required && !formData[f.key] && formData[f.key] !== 0) {
        alert(`${f.label} wajib diisi`);
        return;
      }
    }
    dataService.add(collection, formData);
    setData(dataService.getAll(collection));
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    dataService.delete(collection, deleteConfirm.id);
    setData(dataService.getAll(collection));
    setDeleteConfirm(null);
  };

  const totalItems = useMemo(() => data.reduce((sum, d) => sum + (parseInt(d.jumlah) || 0), 0), [data]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} />
          <span>Tambah Data</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <div className="card" style={{ padding: 'var(--space-3) var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <DirectionIcon size={24} style={{ color: accentColor }} />
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Total Transaksi</div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>{data.length}</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 'var(--space-3) var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <DirectionIcon size={24} style={{ color: accentColor }} />
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Total Jumlah {isMasuk ? 'Masuk' : 'Keluar'}</div>
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>{totalItems}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="header-search" style={{ width: '300px', flex: '1 1 auto' }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Cari nama barang..."
              className="search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
            {filteredData.length} data
          </span>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-title">Riwayat {title}</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Satuan</th>
                <th>{isMasuk ? 'Sumber' : 'Penerima'}</th>
                <th>Keterangan</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>
                    {searchTerm ? 'Tidak ditemukan data.' : 'Belum ada data. Klik "Tambah Data" untuk memulai.'}
                  </td>
                </tr>
              ) : filteredData.map((item, idx) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-tertiary)' }}>{idx + 1}</td>
                  <td>{formatDate(item.tanggal)}</td>
                  <td style={{ fontWeight: 600 }}>{item.namaBarang}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: accentColor }}>
                      {isMasuk ? '+' : '-'}{item.jumlah}
                    </span>
                  </td>
                  <td>{item.satuan || '-'}</td>
                  <td>{(isMasuk ? item.sumber : item.penerima) || '-'}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.keterangan || '-'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                      <button className="btn-icon" style={{ color: 'var(--info)' }} title="Detail" onClick={() => setDetailModal(item)}>
                        <Eye size={18} />
                      </button>
                      <button className="btn-icon" style={{ color: 'var(--danger)' }} title="Hapus" onClick={() => setDeleteConfirm(item)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Tambah ${title}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {activeFields.map(field => (
            <div className="input-group" key={field.key}>
              <label>{field.label} {field.required && <span style={{ color: 'var(--danger)' }}>*</span>}</label>
              {field.type === 'textarea' ? (
                <textarea
                  className="input" rows={3}
                  placeholder={field.placeholder || `Masukkan ${field.label.toLowerCase()}`}
                  value={formData[field.key] || ''}
                  onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                />
              ) : (
                <input
                  type={field.type || 'text'} className="input"
                  placeholder={field.placeholder || `Masukkan ${field.label.toLowerCase()}`}
                  value={formData[field.key] ?? ''}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    [field.key]: field.type === 'number' ? (parseInt(e.target.value) || 0) : e.target.value
                  }))}
                />
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setModalOpen(false)}>Batal</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Simpan Data</button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title={`Detail ${title}`}>
        {detailModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="detail-grid">
              {[
                ['Tanggal', formatDate(detailModal.tanggal)],
                ['Nama Barang', detailModal.namaBarang],
                ['Jumlah', `${detailModal.jumlah} ${detailModal.satuan || ''}`],
                [isMasuk ? 'Sumber' : 'Penerima', (isMasuk ? detailModal.sumber : detailModal.penerima) || '-'],
                ...(isMasuk && detailModal.harga ? [['Harga Total', formatCurrency(detailModal.harga)]] : []),
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
        title="Hapus Data"
        message={`Hapus data "${deleteConfirm?.namaBarang || ''}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
