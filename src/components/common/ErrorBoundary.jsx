import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Terjadi Kesalahan</h2>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{this.state.error?.message || 'Terjadi error yang tidak terduga.'}</p>
            <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
