import StockPage from '../../components/common/StockPage';

export default function MutasiMasukPage() {
  return (
    <StockPage
      collection="mutasi_masuk"
      title="Barang Masuk"
      subtitle="Catat barang baru yang masuk ke inventaris"
      direction="masuk"
    />
  );
}
