import { useState, useMemo } from 'react';
import { Database, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import dataService from '../../services/dataService';

export default function MasterPage({ type, title, subtitle, columns, formFields }) {
  const [data, setData] = useState(() => dataService.getAll(type));
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({});

  const searchFields = useMemo(() => columns.map(c => c.key), [columns]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(item =>
      searchFields.some(field => {
        const val = item[field];
        return val && String(val).toLowerCase().includes(term);
      })
    );
  }, [data, searchTerm, searchFields]);

  const openAdd = () => {
    setEditItem(null);
    const empty = {};
    (formFields || columns).forEach(f => { empty[f.key] = ''; });
    setFormData(empty);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    const filled = {};
    (formFields || columns).forEach(f => { filled[f.key] = item[f.key] || ''; });
    setFormData(filled);
    setModalOpen(true);
  };

  const handleSave = () => {
    const fields = formFields || columns;
    const requiredFields = fields.filter(f => f.required !== false);
    for (const f of requiredFields) {
      if (!formData[f.key] || !String(formData[f.key]).trim()) {
        alert(`${f.label} wajib diisi.`);
        return;
      }
    }

    if (editItem) {
      dataService.update(type, editItem.id, formData);
    } else {
      dataService.add(type, formData);
    }
    setData(dataService.getAll(type));
    setModalOpen(false);
    setEditItem(null);
    setFormData({});
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    dataService.delete(type, deleteConfirm.id);
    setData(dataService.getAll(type));
    setDeleteConfirm(null);
  };

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

      <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div className="header-search" style={{ width: '300px', flex: '1 1 auto' }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={`Cari ${title.toLowerCase()}...`}
              className="search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}>
            {filteredData.length} dari {data.length} data
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-title">Daftar {title.split(' ').slice(1).join(' ') || title}</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 50 }}>No</th>
                {columns.map((col, idx) => (
                  <th key={idx}>{col.label}</th>
                ))}
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>
                    {searchTerm ? 'Tidak ditemukan data yang sesuai pencarian.' : 'Belum ada data. Klik "Tambah Data" untuk memulai.'}
                  </td>
                </tr>
              ) : filteredData.map((item, idx) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-tertiary)' }}>{idx + 1}</td>
                  {columns.map((col, cidx) => (
                    <td key={cidx} style={cidx === 0 ? { fontFamily: 'monospace', fontWeight: 600 } : {}}>{item[col.key] || '-'}</td>
                  ))}
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                      <button className="btn-icon" style={{ color: 'var(--warning)' }} title="Edit" onClick={() => openEdit(item)}>
                        <Edit2 size={18} />
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        title={editItem ? `Edit ${title.split(' ').slice(1).join(' ') || title}` : `Tambah ${title.split(' ').slice(1).join(' ') || title}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {(formFields || columns).filter(f => f.key !== 'id').map(field => (
            <div className="input-group" key={field.key}>
              <label>{field.label} {field.required !== false && <span style={{ color: 'var(--danger)' }}>*</span>}</label>
              {field.type === 'textarea' ? (
                <textarea
                  className="input"
                  rows={3}
                  placeholder={`Masukkan ${field.label.toLowerCase()}`}
                  value={formData[field.key] || ''}
                  onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                />
              ) : field.type === 'select' ? (
                <select
                  className="input"
                  value={formData[field.key] || ''}
                  onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                >
                  <option value="">-- Pilih {field.label} --</option>
                  {(field.options || []).map(opt => (
                    <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  className="input"
                  placeholder={`Masukkan ${field.label.toLowerCase()}`}
                  value={formData[field.key] || ''}
                  onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                />
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setModalOpen(false); setEditItem(null); }}>
              Batal
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>
              {editItem ? 'Simpan Perubahan' : 'Tambah Data'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Hapus Data"
        message={`Apakah Anda yakin ingin menghapus "${deleteConfirm?.nama || deleteConfirm?.id || 'data ini'}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
