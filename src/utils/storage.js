const STORAGE_PREFIX = 'inventaris_sai_v2_';

export const storage = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert('Memori penyimpanan lokal browser penuh. Silakan hapus cache browser Anda.');
      }
      console.error('Storage write error:', e);
    }
  },
  remove(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },
  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },
};
