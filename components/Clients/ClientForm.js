import { useState } from 'react';
import { Plus, X, Building, Globe, Mail, Phone } from 'lucide-react';

export default function ClientForm({ client, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    companyName: client?.companyName || '',
    category: client?.category || '',
    website: client?.website || '',
    boothLocation: client?.boothLocation || '',
    contacts: client?.contacts || [],
    notes: client?.notes || ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/clients' + (client ? `/${client._id}` : ''), {
        method: client ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save client');
      const data = await res.json();
      onSubmit(data);
    } catch (err) {
      setError('Failed to save client. Please try again.');
    }
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', email: '', phone: '' }]
    }));
  };

  const removeContact = (index) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const updateContact = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-300/20">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Company Details Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Company Name
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full bg-dark-slate/50 border border-pink-300/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-pink-300/40 focus:outline-none transition-colors"
                placeholder="Enter company name"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-dark-slate/50 border border-pink-300/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-pink-300/40 focus:outline-none transition-colors"
              placeholder="e.g. Technology, Fashion"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full bg-dark-slate/50 border border-pink-300/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-pink-300/40 focus:outline-none transition-colors"
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Booth Location
            </label>
            <input
              type="text"
              value={formData.boothLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, boothLocation: e.target.value }))}
              className="w-full bg-dark-slate/50 border border-pink-300/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-pink-300/40 focus:outline-none transition-colors"
              placeholder="e.g. A123"
            />
          </div>
        </div>
      </div>

      {/* Contacts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">
            Contacts
          </label>
          <button
            type="button"
            onClick={addContact}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-300/20 text-pink-200 hover:bg-pink-500/20 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Add Contact</span>
          </button>
        </div>

        <div className="space-y-3">
          {formData.contacts.map((contact, index) => (
            <div 
              key={index}
              className="p-4 bg-dark-slate/30 rounded-lg border border-pink-300/10 relative group"
            >
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => updateContact(index, 'name', e.target.value)}
                    className="w-full bg-dark-slate/50 border border-pink-300/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-pink-300/40 focus:outline-none transition-colors"
                    placeholder="Contact name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => updateContact(index, 'email', e.target.value)}
                      className="w-full bg-dark-slate/50 border border-pink-300/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-pink-300/40 focus:outline-none transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => updateContact(index, 'phone', e.target.value)}
                      className="w-full bg-dark-slate/50 border border-pink-300/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-pink-300/40 focus:outline-none transition-colors"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full bg-dark-slate/50 border border-pink-300/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-pink-300/40 focus:outline-none transition-colors h-24 resize-none"
          placeholder="Add any additional notes about the client..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-pink-500/20 border border-pink-300/30 text-pink-100 rounded-lg hover:bg-pink-500/30 transition-all duration-200"
        >
          {client ? 'Update Client' : 'Add Client'}
        </button>
      </div>
    </form>
  );
} 