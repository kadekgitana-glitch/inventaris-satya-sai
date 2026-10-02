import { useState } from 'react';
import { FileText, Download, Printer, Filter } from 'lucide-react';

const laporanCards = [
  { id: 'lap-1', title: 'Laporan Seluruh Inventaris', desc: 'Daftar lengkap semua barang beserta kondisinya.', color: 'primary' },
  { id: 'lap-2', title: 'Laporan Peminjaman (Sirkulasi)', desc: 'Riwayat peminjaman barang per bulan/tahun.', color: 'info' },
  { id: 'lap-3', title: 'Laporan Barang Masuk (Mutasi)', desc: 'Daftar barang baru yang dibeli atau didapatkan.', color: 'success' },
  { id: 'lap-4', title: 'Laporan Barang Keluar/Rusak', desc: 'Daftar barang yang di-afkir, rusak berat, atau hilang.', color: 'danger' },
  { id: 'lap-5', title: 'Laporan Stok ATK & Kebersihan', desc: 'Mutasi keluar-masuk barang habis pakai.', color: 'warning' },
];

export default function LaporanPage() {
  const [activeTab, setActiveTab] = useState('lap-1');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pusat Laporan</h1>
          <p className="page-subtitle">Cetak dan unduh laporan inventaris dalam format PDF atau Excel</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Left: Report Types */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {laporanCards.map(card => (
            <div 
              key={card.id}
              className="card"
              style={{
                cursor: 'pointer',
                borderColor: activeTab === card.id ? `var(--${card.color})` : 'var(--border-primary)',
                background: activeTab === card.id ? `var(--${card.color}-bg)` : 'var(--bg-card)',
                boxShadow: activeTab === card.id ? 'var(--shadow-sm)' : 'none'
              }}
              onClick={() => setActiveTab(card.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                  background: `var(--${card.color})`, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: activeTab === card.id ? `var(--${card.color})` : 'var(--text-primary)' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Report Configuration */}
        <div className="card">
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
            Konfigurasi Laporan
          </h3>
          
          <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label>Periode Laporan</label>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <input type="date" className="input" defaultValue="2023-10-01" style={{ flex: 1 }} />
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-2)' }}>s/d</div>
              <input type="date" className="input" defaultValue="2023-10-31" style={{ flex: 1 }} />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label>Filter Tambahan (Opsional)</label>
            <div className="input-wrapper">
              <Filter size={18} className="input-icon" />
              <select className="input input-with-icon">
                <option value="">Semua Kategori</option>
                <option value="elektronik">Elektronik</option>
                <option value="furniture">Furniture</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-8)' }}>
            <button className="btn btn-primary" style={{ flex: 1 }}>
              <Download size={18} /> Unduh PDF
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }}>
              <Download size={18} /> Unduh Excel
            </button>
            <button className="btn btn-ghost" title="Cetak Langsung">
              <Printer size={18} />
            </button>
          </div>

          <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <strong>Preview Laporan:</strong> Anda dapat mencetak laporan yang telah ditandatangani secara digital oleh Kepala Sekolah dan Penanggung Jawab Sarpras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
