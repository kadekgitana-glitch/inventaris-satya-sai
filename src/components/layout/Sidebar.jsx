import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Database, Package, ArrowLeftRight,
  FileText, Settings, ChevronRight, Box, Plus, Minus,
  ClipboardList, LogOut, X, Paperclip
} from 'lucide-react';

export default function Sidebar({ collapsed, onToggle, onCloseMobile }) {
  const { user, logout } = useAuth();
  const { config } = useTheme();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState([]);

  const handleMouseEnter = (id) => {
    if (collapsed) return;
    setExpandedMenus(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const handleMouseLeave = (id) => {
    if (collapsed) return;
    setExpandedMenus(prev => prev.filter(m => m !== id));
  };

  const toggleSubmenu = (id) => {
    setExpandedMenus(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (children) => children?.some(c => location.pathname === c.path);

  const menuConfig = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    {
      id: 'master', label: 'Data Master', icon: Database, children: [
        { id: 'kategori', label: 'Kategori', icon: Box, path: '/admin/master/kategori' },
        { id: 'lokasi', label: 'Lokasi', icon: Box, path: '/admin/master/lokasi' },
        { id: 'supplier', label: 'Supplier', icon: Box, path: '/admin/master/supplier' },
      ]
    },
    { id: 'inventaris', label: 'Inventaris', icon: Package, path: '/admin/inventaris' },
    {
      id: 'sirkulasi', label: 'Peminjaman', icon: ArrowLeftRight, children: [
        { id: 'daftar', label: 'Daftar Peminjaman', icon: ClipboardList, path: '/admin/sirkulasi/daftar' },
        { id: 'pengembalian', label: 'Pengembalian', icon: Box, path: '/admin/sirkulasi/pengembalian' },
      ]
    },
    {
      id: 'mutasi', label: 'Mutasi Barang', icon: ArrowLeftRight, children: [
        { id: 'masuk', label: 'Barang Masuk', icon: Plus, path: '/admin/mutasi/masuk' },
        { id: 'keluar', label: 'Barang Keluar', icon: Minus, path: '/admin/mutasi/keluar' },
      ]
    },
    {
      id: 'atk', label: 'Kelola ATK', icon: Paperclip, children: [
        { id: 'atk_restock', label: 'Stok Masuk', icon: Plus, path: '/admin/atk/restock' },
        { id: 'atk_withdraw', label: 'Stok Keluar', icon: Minus, path: '/admin/atk/withdraw' },
      ]
    },
    {
      id: 'kebersihan', label: 'Alat Kebersihan', icon: Box, children: [
        { id: 'keb_restock', label: 'Stok Masuk', icon: Plus, path: '/admin/kebersihan/restock' },
        { id: 'keb_withdraw', label: 'Stok Keluar', icon: Minus, path: '/admin/kebersihan/withdraw' },
      ]
    },
    { id: 'laporan', label: 'Laporan', icon: FileText, path: '/admin/laporan' },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings, path: '/admin/pengaturan' },
  ];

  return (
    <>
      {!collapsed && <div className="sidebar-overlay show-mobile" onClick={onToggle} />}

      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="logo-image" />
            ) : (
              <Package size={22} />
            )}
          </div>
          {!collapsed && (
            <div className="sidebar-brand-text">
              <h1 className="brand-name">{config.schoolName}</h1>
              <span className="brand-subtitle">{config.schoolSubtitle}</span>
            </div>
          )}
          <button className="sidebar-close show-mobile" onClick={onToggle}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuConfig.map(item => (
            <div
              key={item.id}
              className="nav-group"
              onMouseEnter={() => item.children && handleMouseEnter(item.id)}
              onMouseLeave={() => item.children && handleMouseLeave(item.id)}
            >
              {item.children ? (
                <>
                  <button
                    className={`nav-item nav-parent ${isParentActive(item.children) ? 'active-parent' : ''}`}
                    onClick={() => toggleSubmenu(item.id)}
                  >
                    <item.icon size={20} className="nav-icon" />
                    {!collapsed && (
                      <>
                        <span className="nav-label">{item.label}</span>
                        <ChevronRight size={16} className={`nav-chevron ${expandedMenus.includes(item.id) ? 'open' : ''}`} />
                      </>
                    )}
                  </button>
                  {!collapsed && (
                    <div className={`nav-children ${expandedMenus.includes(item.id) ? 'show' : ''}`}>
                      {item.children.map(child => (
                        <Link
                          key={child.id}
                          to={child.path}
                          onClick={onCloseMobile}
                          className={`nav-item nav-child ${isActive(child.path) ? 'active' : ''}`}
                        >
                          <child.icon size={16} className="nav-icon" />
                          <span className="nav-label">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <item.icon size={20} className="nav-icon" />
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-user-card">
              <div className="sidebar-user">
                <div className="user-avatar-sm">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.name || 'Admin'}</span>
                  <span className="user-role">Administrator</span>
                </div>
              </div>
              <button className="btn-logout" onClick={logout} title="Keluar">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
