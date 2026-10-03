import StockPage from '../../components/common/StockPage';

export default function ATKWithdrawPage() {
  return (
    <StockPage
      collection="atk_withdraw"
      title="Stok Keluar ATK"
      subtitle="Catat distribusi Alat Tulis Kantor ke unit/kelas"
      direction="keluar"
    />
  );
}
