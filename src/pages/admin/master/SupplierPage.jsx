import MasterPage from '../../../components/common/MasterPage';

export default function SupplierPage() {
  return (
    <MasterPage
      type="supplier"
      title="Data Supplier"
      subtitle="Kelola data supplier dan vendor barang"
      columns={[
        { key: 'nama', label: 'Nama Supplier' },
        { key: 'kontak', label: 'No. Telepon' },
        { key: 'alamat', label: 'Alamat' },
        { key: 'email', label: 'Email' },
      ]}
      formFields={[
        { key: 'nama', label: 'Nama Supplier', required: true },
        { key: 'kontak', label: 'No. Telepon', required: true },
        { key: 'alamat', label: 'Alamat', type: 'textarea', required: false },
        { key: 'email', label: 'Email', type: 'email', required: false },
      ]}
    />
  );
}
