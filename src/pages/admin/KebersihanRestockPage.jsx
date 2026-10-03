import StockPage from '../../components/common/StockPage';

export default function KebersihanRestockPage() {
  return (
    <StockPage
      collection="kebersihan_restock"
      title="Stok Masuk Kebersihan"
      subtitle="Catat pengadaan alat dan bahan kebersihan"
      direction="masuk"
    />
  );
}
