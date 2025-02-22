import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Globe, Building, ExternalLink, MapPin, Plus, FileText } from 'lucide-react';
import ClientModal from './ClientModal';
import Image from 'next/image';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      setClients(data);
    } catch (err) {
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const searchString = searchTerm.toLowerCase();
    return (
      client?.companyName?.toLowerCase().includes(searchString) ||
      client?.category?.toLowerCase().includes(searchString) ||
      client?.contacts?.some(contact => 
        contact?.name?.toLowerCase().includes(searchString) ||
        contact?.email?.toLowerCase().includes(searchString)
      ) || false
    );
  });

  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleClientUpdated = (updatedClient) => {
    if (selectedClient) {
      // Editing existing client
      setClients(clients.map(client => 
        client._id === updatedClient._id ? updatedClient : client
      ));
    } else {
      // Adding new client
      setClients(prev => [...prev, updatedClient]);
    }
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="cyber-box p-6">
        <p className="text-cyber-pink">Loading clients data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="h-full flex items-center justify-center">
      <div className="cyber-box p-6">
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );

  const uniqueCategories = [...new Set(clients.map(client => client.category))];

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Search Bar and Add Button */}
      <div className="cyber-box p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company, category, contacts..."
              className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded-lg pl-10 pr-4 py-2 text-white focus:border-cyber-pink focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddClient}
            className="px-4 py-2 bg-pink-500/20 border border-pink-300/30 text-pink-100 rounded-lg hover:bg-pink-500/30 transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.length === 0 ? (
              <div className="col-span-full cyber-box p-6 text-center text-gray-400">
                No clients found matching your search.
              </div>
            ) : (
              filteredClients.map((client) => (
                <div 
                  key={client._id}
                  onClick={() => handleEdit(client)}
                  className="relative bg-black/30 backdrop-blur-xl rounded-xl border border-pink-200/20 hover:border-pink-300/30 transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Main Content */}
                  <div className="relative p-4">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-light text-white tracking-wide group-hover:text-pink-200 transition-colors">
                          {client.companyName}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-400">{client.category}</span>
                        </div>
                      </div>
                      {client.boothLocation && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/30 backdrop-blur-md border border-cyan-300/30 shadow-lg shadow-cyan-500/10">
                          <MapPin className="h-4 w-4 text-cyan-300" />
                          <span className="text-sm font-medium text-cyan-100">Booth {client.boothLocation}</span>
                        </div>
                      )}
                    </div>

                    {/* Website Section */}
                    {client.website && (
                      <a 
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-300/20 hover:bg-violet-500/20 transition-colors duration-200 mb-4 group/link"
                      >
                        <Globe className="h-4 w-4 text-violet-300 group-hover/link:scale-110 transition-transform" />
                        <span className="text-sm text-violet-200 truncate flex-1">
                          {client.website.replace(/^https?:\/\//, '')}
                        </span>
                        <ExternalLink className="h-3 w-3 text-violet-300 group-hover/link:scale-110 transition-transform" />
                      </a>
                    )}

                    {/* Contacts Section */}
                    {client.contacts?.length > 0 && (
                      <div className="h-[140px] mb-4 relative">
                        <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent hover:scrollbar-thumb-pink-500/30 pr-2">
                          <div className="space-y-2">
                            {client.contacts.map((contact, index) => (
                              <div 
                                key={index}
                                className="p-3 bg-dark-slate/30 rounded-lg border border-pink-300/10 hover:border-pink-300/20 transition-all duration-200"
                              >
                                <p className="text-white mb-2">{contact.name}</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {contact.email && (
                                    <a
                                      href={`mailto:${contact.email}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-teal-500/10 border border-teal-300/20 hover:bg-teal-500/20 transition-colors duration-200 group/link"
                                    >
                                      <Mail className="h-3.5 w-3.5 text-teal-300 group-hover/link:scale-110 transition-transform" />
                                      <span className="text-sm text-teal-200 truncate">{contact.email}</span>
                                    </a>
                                  )}
                                  {contact.phone && (
                                    <a
                                      href={`tel:${contact.phone}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-300/20 hover:bg-indigo-500/20 transition-colors duration-200 group/link"
                                    >
                                      <Phone className="h-3.5 w-3.5 text-indigo-300 group-hover/link:scale-110 transition-transform" />
                                      <span className="text-sm text-indigo-200 truncate">{contact.phone}</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Fade effect at the bottom */}
                        <div className="absolute bottom-0 left-0 right-2 h-6 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                      </div>
                    )}

                    {/* Notes Section */}
                    {client.notes && (
                      <div className="p-3 bg-dark-slate/20 rounded-lg border border-pink-300/10">
                        <p className="text-sm text-gray-400 line-clamp-2">{client.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary - Hidden on mobile */}
      <div className="hidden md:block cyber-box p-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">Total Clients</p>
            <p className="text-xl font-bold text-white">
              {filteredClients.length} <span className="text-sm text-gray-400">/ {clients.length}</span>
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Contacts</p>
            <p className="text-xl font-bold text-cyber-pink">
              {filteredClients.reduce((sum, client) => sum + (client.contacts?.length || 0), 0)}
              <span className="text-sm text-gray-400"> / {clients.reduce((sum, client) => sum + (client.contacts?.length || 0), 0)}</span>
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">With Booths</p>
            <p className="text-xl font-bold text-neon-blue">
              {filteredClients.filter(c => c.boothLocation).length}
              <span className="text-sm text-gray-400"> / {clients.filter(c => c.boothLocation).length}</span>
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Categories</p>
            <p className="text-xl font-bold text-emerald-400">
              {[...new Set(filteredClients.map(client => client.category))].length}
              <span className="text-sm text-gray-400"> / {uniqueCategories.length}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onClientUpdated={handleClientUpdated}
      />
    </div>
  );
} 