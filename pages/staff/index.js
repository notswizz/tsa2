import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import StaffList from '@/components/Staff/StaffList';
import StaffForm from '@/components/Staff/StaffForm';
import StaffModal from '@/components/Staff/StaffModal';

export default function Staff() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Handle form submission
      setSuccess('Staff added successfully!');
      setFormData({});
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = (staff) => {
    // Handle delete logic
  };

  const handleSaveEdit = (updatedStaff) => {
    setEditingStaff(updatedStaff);
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <Head>
        <title>Staff - The Smith Agency CRM</title>
      </Head>

      <div className="h-[calc(100vh-6rem)] flex flex-col">
      

        {showForm ? (
          <div className="flex-1 overflow-auto">
            <StaffForm
              formData={formData}
              setFormData={setFormData}
              isLoading={isLoading}
              error={error}
              success={success}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <StaffList
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

        <StaffModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          staff={editingStaff}
          onSave={handleSaveEdit}
        />
      </div>
    </Layout>
  );
} 