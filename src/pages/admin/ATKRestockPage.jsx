import StockPage from '../../components/common/StockPage';

export default function ATKRestockPage() {
  return (
    <StockPage
      collection="atk_restock"
      title="Stok Masuk ATK"
      subtitle="Catat pengadaan Alat Tulis Kantor baru"
      direction="masuk"
    />
  );
}
