import MasterPage from '../../../components/common/MasterPage';

export default function KategoriPage() {
  return (
    <MasterPage
      type="kategori"
      title="Data Kategori"
      subtitle="Kelola kategori klasifikasi inventaris"
      columns={[
        { key: 'nama', label: 'Nama Kategori' },
        { key: 'deskripsi', label: 'Deskripsi' },
      ]}
      formFields={[
        { key: 'nama', label: 'Nama Kategori', required: true },
        { key: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: false },
      ]}
    />
  );
}
