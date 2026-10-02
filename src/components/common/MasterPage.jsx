import { useState } from 'react';
import { Database, Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function MasterPage({ type, title, subtitle, columns, data }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        <button className="btn btn-primary">
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
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-title">Daftar {title.split(' ')[1] || title}</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx}>{col.label}</th>
                ))}
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  {columns.map((col, idx) => (
                    <td key={idx}>{item[col.key]}</td>
                  ))}
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                      <button className="btn-icon" style={{ color: 'var(--warning)' }} title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button className="btn-icon" style={{ color: 'var(--danger)' }} title="Hapus">
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
    </div>
  );
}
