export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Hapus', variant = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-body" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: `var(--${variant}-bg, rgba(239,68,68,0.1))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-4)',
            color: `var(--${variant})`
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
            {title || 'Konfirmasi Hapus'}
          </h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
            {message || 'Data yang dihapus tidak dapat dikembalikan. Yakin ingin melanjutkan?'}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Batal</button>
            <button className={`btn btn-${variant}`} style={{ flex: 1 }} onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
