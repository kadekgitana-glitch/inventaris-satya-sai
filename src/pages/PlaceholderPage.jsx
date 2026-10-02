import { Package } from 'lucide-react';

export default function PlaceholderPage({ title, subtitle }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{title || 'Halaman'}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Package size={28} />
          </div>
          <h3>Segera Hadir</h3>
          <p>Halaman {title || 'ini'} sedang dalam tahap pengembangan.</p>
        </div>
      </div>
    </div>
  );
}
