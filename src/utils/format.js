export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatCurrency(amount) {
  if (amount == null) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function formatNumber(num) {
  if (num == null) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
}

export function generateId(prefix = 'ID') {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

export function getStatusBadge(status) {
  const map = {
    tersedia: { label: 'Tersedia', variant: 'success' },
    menipis: { label: 'Menipis', variant: 'warning' },
    habis: { label: 'Habis', variant: 'danger' },
    baik: { label: 'Baik', variant: 'success' },
    rusak_ringan: { label: 'Rusak Ringan', variant: 'warning' },
    rusak_berat: { label: 'Rusak Berat', variant: 'danger' },
    hilang: { label: 'Hilang', variant: 'danger' },
    dipinjam: { label: 'Dipinjam', variant: 'info' },
    active: { label: 'Dipinjam', variant: 'warning' },
    returned: { label: 'Dikembalikan', variant: 'success' },
    overdue: { label: 'Terlambat', variant: 'danger' },
    selesai: { label: 'Selesai', variant: 'success' },
  };
  return map[status] || { label: status || '-', variant: 'neutral' };
}
