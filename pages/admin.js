import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { Calendar, MapPin } from 'lucide-react';

export default function Admin() {
  const [formData, setFormData] = useState({
    location: '',
    startDate: '',
    endDate: '',
    type: '',
    season: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const locations = ['ATL', 'NYC', 'LA', 'DAL'];
  const showTypes = ['Gift', 'Apparel', 'Bridal', 'Other'];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/shows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to create show');
      }

      setSuccess('Show created successfully!');
      setFormData({
        location: '',
        startDate: '',
        endDate: '',
        type: '',
        season: ''
      });
    } catch (err) {
      console.error('Error creating show:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Admin - The Smith Agency CRM</title>
        <meta name="description" content="Admin dashboard for The Smith Agency CRM" />
      </Head>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage shows and system settings</p>
        </div>

        <div className="cyber-box p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-cyber-pink" />
            Add New Show
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <select
                    className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded p-2 pl-10 text-white focus:border-cyber-pink focus:outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Show Type</label>
                <select
                  className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded p-2 text-white focus:border-cyber-pink focus:outline-none"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="">Select Type</option>
                  {showTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded p-2 text-white focus:border-cyber-pink focus:outline-none"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded p-2 text-white focus:border-cyber-pink focus:outline-none"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Season</label>
                <select
                  className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded p-2 text-white focus:border-cyber-pink focus:outline-none"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  required
                >
                  <option value="">Select Season</option>
                  {seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="cyber-button"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Show'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 