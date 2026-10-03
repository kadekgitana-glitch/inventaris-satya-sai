import LZString from 'lz-string';

const STORAGE_PREFIX = 'inventaris_sai_v3_';

export const storage = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (!raw) {
        // Try fallback to v2 (uncompressed) for migration
        const v2 = localStorage.getItem('inventaris_sai_v2_' + key);
        if (v2) {
          const parsed = JSON.parse(v2);
          this.set(key, parsed); // Save as v3
          return parsed;
        }
        return defaultValue;
      }
      
      // Decompress using lz-string
      const decompressed = LZString.decompressFromUTF16(raw);
      if (!decompressed) return defaultValue;
      
      return JSON.parse(decompressed);
    } catch {
      return defaultValue;
    }
  },
  
  set(key, value) {
    try {
      const jsonString = JSON.stringify(value);
      // Compress using lz-string
      const compressed = LZString.compressToUTF16(jsonString);
      localStorage.setItem(STORAGE_PREFIX + key, compressed);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert('Memori penyimpanan lokal browser penuh. Silakan hapus cache browser Anda.');
      }
      console.error('Storage write error:', e);
    }
  },
  
  remove(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
    localStorage.removeItem('inventaris_sai_v2_' + key); // remove old v2 if exists
  },
  
  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX) || k.startsWith('inventaris_sai_v2_'))
      .forEach(k => localStorage.removeItem(k));
  },
};
