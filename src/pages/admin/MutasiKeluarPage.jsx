import StockPage from '../../components/common/StockPage';

export default function MutasiKeluarPage() {
  return (
    <StockPage
      collection="mutasi_keluar"
      title="Barang Keluar"
      subtitle="Catat barang yang keluar dari inventaris (rusak, afkir, hilang)"
      direction="keluar"
    />
  );
}
