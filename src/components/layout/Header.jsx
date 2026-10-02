import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, Bell, Menu, Sun, Moon, LogOut } from 'lucide-react';

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const { config, toggleTheme } = useTheme();
  const location = useLocation();

  const pathSegments = location.pathname
    .split('/')
    .filter(Boolean)
    .map(seg => seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '));

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="menu-toggle show-mobile" onClick={onMenuToggle}>
          <Menu size={22} />
        </button>
        <nav className="breadcrumb hide-mobile">
          {pathSegments.map((seg, i) => (
            <span key={i} className="breadcrumb-item">
              {i > 0 && <span className="breadcrumb-sep">/</span>}
              <span className={i === pathSegments.length - 1 ? 'breadcrumb-current' : 'breadcrumb-parent'}>
                {seg}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="header-right">
        <div className="header-search hide-mobile">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Cari inventaris..." className="search-input" />
        </div>

        <button className="header-icon-btn" onClick={toggleTheme} title={config.theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}>
          {config.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="header-icon-btn" title="Notifikasi">
          <Bell size={20} />
        </button>

        <div className="header-user">
          <div className="header-avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="header-user-info hide-mobile">
            <span className="header-user-name">{user?.name || 'Admin'}</span>
            <span className="header-user-role">Administrator</span>
          </div>
        </div>

        <button className="header-icon-btn show-mobile" onClick={logout} title="Keluar" style={{ color: 'var(--danger)' }}>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
