import { useState } from 'react';
import { ClipboardList, Plus, Search, CheckCircle, Clock } from 'lucide-react';
import { formatDateTime, getStatusBadge } from '../../utils/format';

const dummyData = [
  { id: 'PJM-202310-001', barang: 'Proyektor Epson EB-X51', peminjam: 'Bpk. Budi Santoso', kelas: 'Guru Umum', tanggalPinjam: '2023-10-15T07:30:00', batasKembali: '2023-10-15T15:00:00', status: 'active', jumlah: 1 },
  { id: 'PJM-202310-002', barang: 'Laptop Asus ROG Strix', peminjam: 'Andi Pratama', kelas: 'XII TKJ 1', tanggalPinjam: '2023-10-14T08:00:00', batasKembali: '2023-10-14T12:00:00', status: 'overdue', jumlah: 1 },
  { id: 'PJM-202310-003', barang: 'Bola Basket Molten', peminjam: 'Drs. I Wayan', kelas: 'Guru Olahraga', tanggalPinjam: '2023-10-10T09:00:00', batasKembali: '2023-10-10T11:00:00', status: 'returned', jumlah: 5 },
];

export default function PeminjamanPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Daftar Peminjaman</h1>
          <p className="page-subtitle">Monitoring peminjaman dan pengembalian aset</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          <span>Pinjamkan Barang</span>
        </button>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div className="header-search" style={{ width: '300px', flex: '1 1 auto' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Cari nama peminjam atau ID..." 
              className="search-input" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-title">Transaksi Berjalan</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
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
              {dummyData.map(item => {
                const badgeStatus = getStatusBadge(item.status);
                
                return (
                  <tr key={item.id}>
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
                          <button className="btn btn-sm btn-success">
                            <CheckCircle size={14} /> Proses Kembali
                          </button>
                        )}
                        <button className="btn btn-sm btn-ghost">Detail</button>
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
