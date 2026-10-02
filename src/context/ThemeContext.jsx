import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const ThemeContext = createContext(null);

const DEFAULT_CONFIG = {
  theme: 'light',
  schoolName: 'Inventaris Satya Sai',
  schoolSubtitle: 'Sistem Manajemen Aset',
  logoUrl: null,
  primaryColor: '#2563eb', // Royal Blue
};

export function ThemeProvider({ children }) {
  const [config, setConfig] = useState(() => {
    const stored = storage.get('appConfig', null);
    return stored ? { ...DEFAULT_CONFIG, ...stored } : DEFAULT_CONFIG;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', config.theme || 'dark');
    root.style.setProperty('--primary', config.primaryColor);
    const hex = config.primaryColor;
    root.style.setProperty('--primary-hover', adjustBrightness(hex, -15));
    root.style.setProperty('--primary-dark', adjustBrightness(hex, -25));
    root.style.setProperty('--primary-light', hexToLight(hex));
    root.style.setProperty('--primary-glow', hexToGlow(hex));
  }, [config.primaryColor, config.theme]);

  const updateConfig = (updates) => {
    setConfig(prev => {
      const next = { ...prev, ...updates };
      storage.set('appConfig', next);
      return next;
    });
  };

  const toggleTheme = () => {
    updateConfig({ theme: config.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <ThemeContext.Provider value={{ config, updateConfig, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return { r: 99, g: 102, b: 241 };
  return { r: parseInt(hex.slice(1, 3), 16) || 0, g: parseInt(hex.slice(3, 5), 16) || 0, b: parseInt(hex.slice(5, 7), 16) || 0 };
}

function adjustBrightness(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const clamp = v => Math.max(0, Math.min(255, v));
  const adj = v => clamp(Math.round(v + (v * percent) / 100));
  return `rgb(${adj(r)}, ${adj(g)}, ${adj(b)})`;
}

function hexToLight(hex) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, 0.08)`;
}

function hexToGlow(hex) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, 0.35)`;
}
