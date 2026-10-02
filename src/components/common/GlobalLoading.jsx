import { useTheme } from '../../context/ThemeContext';
import { Package } from 'lucide-react';

export default function GlobalLoading() {
  const { config } = useTheme();

  return (
    <div className="global-loading-container">
      <div className="global-loading-content">
        <div className="global-loading-logo-wrapper">
          {config?.logoUrl ? (
            <img src={config.logoUrl} alt="Logo" className="global-loading-logo pulse-animation" />
          ) : (
            <div className="global-loading-icon pulse-animation">
              <Package size={36} />
            </div>
          )}
        </div>
        <h2 className="global-loading-title">{config?.schoolName || 'Inventaris Satya Sai'}</h2>
        <p className="global-loading-subtitle">Memverifikasi sesi...</p>
        <div className="global-spinner"></div>
      </div>
    </div>
  );
}
