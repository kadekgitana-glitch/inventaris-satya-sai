import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Lock, Eye, EyeOff, LogIn, Package } from 'lucide-react';

export default function LoginPage() {
  const { user, login } = useAuth();
  const { config } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUsername('');
    setPassword('');
  }, []);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Username dan password harus diisi');
      return;
    }
    setLoading(true);
    const result = await login(username.trim(), password);
    if (!result.success) {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left — Visual Panel */}
      <div className="login-visual">
        <div className="login-visual-content">
          <div className="login-visual-top">
            <div className="school-badge-large">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} />
              ) : (
                <Package size={28} />
              )}
            </div>
          </div>
          <div className="login-visual-bottom">
            <h2 className="visual-school-name">{config.schoolName}</h2>
            <p className="visual-subtitle">Dashboard Inventaris & Manajemen Aset Sekolah</p>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="login-form-panel">
        <div className="login-form-container">
          <div className="login-brand">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="login-logo-img" />
            ) : (
              <div className="login-logo-fallback">
                <Package size={28} />
              </div>
            )}
          </div>

          <h1 className="login-title">Selamat Datang</h1>
          <p className="login-subtitle">Masuk ke Dashboard Inventaris</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="login-username">Username</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="login-username"
                  type="text"
                  className="input input-with-icon"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoFocus
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input input-with-icon input-with-icon-right"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error animate-fade-in">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary btn-lg w-full login-submit ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
