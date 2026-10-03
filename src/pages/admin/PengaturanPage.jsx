import { useState } from 'react';
import { Settings, Save, Sun, Moon, Palette, Building2, Camera, RotateCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { uploadToCloudinary } from '../../lib/cloudinary';

const COLOR_PRESETS = [
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Cyan', value: '#0891b2' },
  { name: 'Slate', value: '#475569' },
];

export default function PengaturanPage() {
  const { config, updateConfig, toggleTheme } = useTheme();
  const [schoolName, setSchoolName] = useState(config.schoolName || '');
  const [schoolSubtitle, setSchoolSubtitle] = useState(config.schoolSubtitle || '');
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor || '#2563eb');
  const [logoUrl, setLogoUrl] = useState(config.logoUrl || '');
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setLogoUrl(url);
    } catch (err) {
      alert(err.message || 'Gagal upload logo');
    }
    setUploading(false);
  };

  const handleSave = () => {
    updateConfig({
      schoolName: schoolName.trim() || 'Inventaris Satya Sai',
      schoolSubtitle: schoolSubtitle.trim() || 'Sistem Manajemen Aset',
      primaryColor,
      logoUrl: logoUrl || null,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSchoolName('Inventaris Satya Sai');
    setSchoolSubtitle('Sistem Manajemen Aset');
    setPrimaryColor('#2563eb');
    setLogoUrl('');
    updateConfig({
      schoolName: 'Inventaris Satya Sai',
      schoolSubtitle: 'Sistem Manajemen Aset',
      primaryColor: '#2563eb',
      logoUrl: null,
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pengaturan Aplikasi</h1>
          <p className="page-subtitle">Konfigurasi tampilan, identitas sekolah, dan tema</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 'var(--space-5)' }}>
        {/* Identity Section */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <Building2 size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700 }}>Identitas Sekolah</h3>
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label>Nama Sekolah / Instansi</label>
            <input className="input" value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="Nama sekolah" />
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label>Subtitle</label>
            <input className="input" value={schoolSubtitle} onChange={e => setSchoolSubtitle(e.target.value)} placeholder="Subtitle di sidebar" />
          </div>

          <div className="input-group">
            <label>Logo Sekolah</label>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '2px solid var(--border-primary)' }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                  <Camera size={20} />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label className="btn btn-sm btn-secondary" style={{ cursor: 'pointer' }}>
                  <Camera size={14} /> {uploading ? 'Mengupload...' : 'Upload Logo'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} disabled={uploading} />
                </label>
                {logoUrl && (
                  <button className="btn btn-sm btn-ghost" onClick={() => setLogoUrl('')} style={{ fontSize: 'var(--font-size-xs)' }}>
                    Hapus Logo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <Palette size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700 }}>Tema & Warna</h3>
          </div>

          {/* Theme toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)', padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>Mode Tampilan</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Saat ini: {config.theme === 'dark' ? 'Gelap' : 'Terang'}</div>
            </div>
            <button className="btn btn-sm btn-secondary" onClick={toggleTheme} style={{ gap: 6 }}>
              {config.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {config.theme === 'dark' ? 'Terang' : 'Gelap'}
            </button>
          </div>

          {/* Color picker */}
          <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label>Warna Utama (Primary)</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <input
                type="color"
                value={primaryColor}
                onChange={e => setPrimaryColor(e.target.value)}
                style={{ width: 40, height: 40, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', padding: 0 }}
              />
              <input className="input" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ fontFamily: 'monospace', width: 120 }} />
            </div>
          </div>

          {/* Preset colors */}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-secondary)' }}>Pilihan Warna Cepat</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {COLOR_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => setPrimaryColor(preset.value)}
                  title={preset.name}
                  style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                    background: preset.value, border: primaryColor === preset.value ? '3px solid var(--text-primary)' : '2px solid transparent',
                    cursor: 'pointer', transition: 'all 150ms',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost" onClick={handleReset}>
          <RotateCcw size={16} /> Reset ke Default
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} /> {saved ? '✓ Tersimpan!' : 'Simpan Pengaturan'}
        </button>
      </div>
    </div>
  );
}
