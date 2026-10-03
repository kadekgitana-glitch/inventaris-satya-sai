import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Suspense, lazy, useEffect } from 'react';
import { initRealtimeSync } from './services/dataService';

import GlobalLoading from './components/common/GlobalLoading';
import AdminLayout from './layouts/AdminLayout';

// Pages (lazy loaded)
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const InventarisPage = lazy(() => import('./pages/admin/InventarisPage'));
const PeminjamanPage = lazy(() => import('./pages/admin/PeminjamanPage'));
const PengembalianPage = lazy(() => import('./pages/admin/PengembalianPage'));

// Data Master
const KategoriPage = lazy(() => import('./pages/admin/master/KategoriPage'));
const LokasiPage = lazy(() => import('./pages/admin/master/LokasiPage'));
const SupplierPage = lazy(() => import('./pages/admin/master/SupplierPage'));

// Mutasi
const MutasiMasukPage = lazy(() => import('./pages/admin/MutasiMasukPage'));
const MutasiKeluarPage = lazy(() => import('./pages/admin/MutasiKeluarPage'));

// ATK
const ATKRestockPage = lazy(() => import('./pages/admin/ATKRestockPage'));
const ATKWithdrawPage = lazy(() => import('./pages/admin/ATKWithdrawPage'));

// Kebersihan
const KebersihanRestockPage = lazy(() => import('./pages/admin/KebersihanRestockPage'));
const KebersihanWithdrawPage = lazy(() => import('./pages/admin/KebersihanWithdrawPage'));

// Laporan & Pengaturan
const LaporanPage = lazy(() => import('./pages/admin/LaporanPage'));
const PengaturanPage = lazy(() => import('./pages/admin/PengaturanPage'));

function AppContent() {
  useEffect(() => {
    initRealtimeSync();
  }, []);

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
          <Route path="master/supplier" element={<SupplierPage />} />

          {/* Inventaris */}
          <Route path="inventaris" element={<InventarisPage />} />

          {/* Sirkulasi */}
          <Route path="sirkulasi/daftar" element={<PeminjamanPage />} />
          <Route path="sirkulasi/pengembalian" element={<PengembalianPage />} />

          {/* Mutasi */}
          <Route path="mutasi/masuk" element={<MutasiMasukPage />} />
          <Route path="mutasi/keluar" element={<MutasiKeluarPage />} />

          {/* ATK */}
          <Route path="atk/restock" element={<ATKRestockPage />} />
          <Route path="atk/withdraw" element={<ATKWithdrawPage />} />

          {/* Kebersihan */}
          <Route path="kebersihan/restock" element={<KebersihanRestockPage />} />
          <Route path="kebersihan/withdraw" element={<KebersihanWithdrawPage />} />

          {/* Laporan */}
          <Route path="laporan" element={<LaporanPage />} />

          {/* Pengaturan */}
          <Route path="pengaturan" element={<PengaturanPage />} />
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
