import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import StaffList from '@/components/Staff/StaffList';
import StaffModal from '@/components/Staff/StaffModal';

export default function Staff() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleSave = (updatedStaff) => {
    setEditingStaff(null);
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <Head>
        <title>Staff - The Smith Agency CRM</title>
      </Head>

      <div className="h-[calc(100vh-6rem)] flex flex-col">
        <div className="flex-1 overflow-auto">
          <StaffList onEdit={handleEdit} />
        </div>

        <StaffModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStaff(null);
          }}
          staff={editingStaff}
          onSave={handleSave}
        />
      </div>
    </Layout>
  );
} 