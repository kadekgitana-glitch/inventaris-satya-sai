import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Suspense, lazy } from 'react';

import GlobalLoading from './components/common/GlobalLoading';
import AdminLayout from './layouts/AdminLayout';

// Pages (lazy loaded)
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const InventarisPage = lazy(() => import('./pages/admin/InventarisPage'));
const PeminjamanPage = lazy(() => import('./pages/admin/PeminjamanPage'));

const KategoriPage = lazy(() => import('./pages/admin/master/KategoriPage'));
const LokasiPage = lazy(() => import('./pages/admin/master/LokasiPage'));

const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));
const LaporanPage = lazy(() => import('./pages/admin/LaporanPage'));

function AppContent() {
  return (
    <Suspense fallback={<GlobalLoading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Data Master */}
          <Route path="master/kategori" element={<KategoriPage />} />
          <Route path="master/lokasi" element={<LokasiPage />} />
          <Route path="master/supplier" element={<PlaceholderPage title="Data Supplier" subtitle="Kelola data supplier/vendor" />} />

          {/* Inventaris */}
          <Route path="inventaris" element={<InventarisPage />} />

          {/* Sirkulasi */}
          <Route path="sirkulasi/daftar" element={<PeminjamanPage />} />
          <Route path="sirkulasi/pengembalian" element={<PlaceholderPage title="Pengembalian" subtitle="Proses pengembalian barang" />} />

          {/* Mutasi */}
          <Route path="mutasi/masuk" element={<PlaceholderPage title="Barang Masuk" subtitle="Catat barang baru yang masuk" />} />
          <Route path="mutasi/keluar" element={<PlaceholderPage title="Barang Keluar" subtitle="Catat barang yang keluar" />} />

          {/* ATK */}
          <Route path="atk/restock" element={<PlaceholderPage title="Stok Masuk ATK" subtitle="Catat pengadaan ATK baru" />} />
          <Route path="atk/withdraw" element={<PlaceholderPage title="Stok Keluar ATK" subtitle="Catat distribusi ATK" />} />

          {/* Kebersihan */}
          <Route path="kebersihan/restock" element={<PlaceholderPage title="Stok Masuk Kebersihan" subtitle="Catat pengadaan alat kebersihan" />} />
          <Route path="kebersihan/withdraw" element={<PlaceholderPage title="Stok Keluar Kebersihan" subtitle="Catat distribusi alat kebersihan" />} />

          {/* Laporan */}
          <Route path="laporan" element={<LaporanPage />} />

          {/* Pengaturan */}
          <Route path="pengaturan" element={<PlaceholderPage title="Pengaturan Aplikasi" subtitle="Konfigurasi tema, identitas sekolah, dan keamanan" />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
