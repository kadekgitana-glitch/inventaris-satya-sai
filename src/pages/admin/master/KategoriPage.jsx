import MasterPage from '../../../components/common/MasterPage';

const dummyKategori = [
  { id: 'KAT-01', nama: 'Elektronik', deskripsi: 'Perangkat keras, komputer, proyektor' },
  { id: 'KAT-02', nama: 'Furniture', deskripsi: 'Meja, kursi, lemari' },
  { id: 'KAT-03', nama: 'Alat Olahraga', deskripsi: 'Bola, net, matras' },
  { id: 'KAT-04', nama: 'ATK', deskripsi: 'Alat tulis kantor habis pakai' },
];

export default function KategoriPage() {
  return (
    <MasterPage 
      type="kategori"
      title="Data Kategori"
      subtitle="Kelola kategori klasifikasi inventaris"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'nama', label: 'Nama Kategori' },
        { key: 'deskripsi', label: 'Deskripsi' },
      ]}
      data={dummyKategori}
    />
  );
}
