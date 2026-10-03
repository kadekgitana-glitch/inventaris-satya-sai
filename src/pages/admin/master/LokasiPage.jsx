import MasterPage from '../../../components/common/MasterPage';

export default function LokasiPage() {
  return (
    <MasterPage
      type="lokasi"
      title="Data Lokasi"
      subtitle="Kelola ruang dan lokasi penyimpanan aset"
      columns={[
        { key: 'nama', label: 'Nama Ruang' },
        { key: 'gedung', label: 'Gedung/Area' },
        { key: 'pic', label: 'Penanggung Jawab' },
      ]}
      formFields={[
        { key: 'nama', label: 'Nama Ruang', required: true },
        { key: 'gedung', label: 'Gedung/Area', required: true },
        { key: 'pic', label: 'Penanggung Jawab', required: false },
      ]}
    />
  );
}
