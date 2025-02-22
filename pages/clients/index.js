import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import ClientList from '@/components/Clients/ClientList';
import ClientForm from '@/components/Clients/ClientForm';
import ClientModal from '@/components/Clients/ClientModal';

export default function Clients() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Handle form submission
      setSuccess('Client added successfully!');
      setFormData({});
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (client) => {
    // Handle delete logic
  };

  const handleSaveEdit = (updatedClient) => {
    setEditingClient(updatedClient);
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <Head>
        <title>Clients - The Smith Agency CRM</title>
      </Head>

      <div className="h-[calc(100vh-6rem)] flex flex-col">
      

        {showForm ? (
          <div className="flex-1 overflow-auto">
            <ClientForm
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
            <ClientList
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

        <ClientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          client={editingClient}
          onSave={handleSaveEdit}
        />
      </div>
    </Layout>
  );
} 