import MasterPage from '../../../components/common/MasterPage';

const dummyLokasi = [
  { id: 'LOK-01', nama: 'Ruang Guru', gedung: 'Gedung Utama', pic: 'Drs. Supardi' },
  { id: 'LOK-02', nama: 'Lab Komputer 1', gedung: 'Gedung Lab', pic: 'Budi Santoso, S.Kom' },
  { id: 'LOK-03', nama: 'Ruang Kelas XI-A', gedung: 'Gedung B', pic: 'Ni Wayan Sari, S.Pd' },
  { id: 'LOK-04', nama: 'Gudang Utama', gedung: 'Gedung Belakang', pic: 'Made Pasek' },
];

export default function LokasiPage() {
  return (
    <MasterPage 
      type="lokasi"
      title="Data Lokasi"
      subtitle="Kelola ruang dan lokasi penyimpanan aset"
      columns={[
        { key: 'id', label: 'Kode Lokasi' },
        { key: 'nama', label: 'Nama Ruang' },
        { key: 'gedung', label: 'Gedung/Area' },
        { key: 'pic', label: 'Penanggung Jawab' },
      ]}
      data={dummyLokasi}
    />
  );
}
