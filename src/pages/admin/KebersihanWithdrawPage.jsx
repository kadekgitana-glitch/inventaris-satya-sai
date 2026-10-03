import StockPage from '../../components/common/StockPage';

export default function KebersihanWithdrawPage() {
  return (
    <StockPage
      collection="kebersihan_withdraw"
      title="Stok Keluar Kebersihan"
      subtitle="Catat distribusi alat dan bahan kebersihan ke kelas/unit"
      direction="keluar"
    />
  );
}
