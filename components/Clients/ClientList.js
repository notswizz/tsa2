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
      <div className="elegant-box p-6">
        <p className="text-tsa-accent">Loading clients data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="h-full flex items-center justify-center">
      <div className="elegant-box p-6">
        <p className="text-rose-400">{error}</p>
      </div>
    </div>
  );

  const uniqueCategories = [...new Set(clients.map(client => client.category))];

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Search Bar and Add Button */}
      <div className="elegant-box p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-tsa-light" />
            <input
              type="text"
              placeholder="Search by company, category, contacts..."
              className="w-full bg-tsa-black/50 border border-tsa-accent/20 rounded-lg pl-10 pr-4 py-2.5 text-tsa-white placeholder-tsa-light/50 focus:border-pink-300/30 focus:outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddClient}
            className="px-4 py-2.5 bg-pink-500/10 border border-pink-300/20 text-pink-50 rounded-lg hover:bg-pink-500/20 hover:border-pink-300/30 transition-all duration-200 flex items-center gap-2"
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
              <div className="col-span-full elegant-box p-6 text-center text-tsa-light">
                No clients found matching your search.
              </div>
            ) : (
              filteredClients.map((client) => (
                <div 
                  key={client._id}
                  onClick={() => handleEdit(client)}
                  className="relative bg-tsa-dark/80 backdrop-blur-xl rounded-lg border border-tsa-accent/10 hover:border-pink-300/20 transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-elegant opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Main Content */}
                  <div className="relative p-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-display text-tsa-white group-hover:text-pink-50 transition-colors">
                          {client.companyName}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Building className="h-4 w-4 text-tsa-accent" />
                          <span className="text-tsa-light font-light">{client.category}</span>
                        </div>
                      </div>
                      {client.boothLocation && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/10 backdrop-blur-sm border border-pink-300/20">
                          <MapPin className="h-4 w-4 text-pink-300" />
                          <span className="text-sm font-light text-pink-50">Booth {client.boothLocation}</span>
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
                        className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-tsa-black/50 border border-tsa-accent/10 hover:border-pink-300/20 transition-all duration-200 group/link"
                      >
                        <Globe className="h-4 w-4 text-tsa-accent group-hover/link:text-pink-300 transition-colors" />
                        <span className="text-sm text-tsa-white font-light truncate flex-1">
                          {client.website.replace(/^https?:\/\//, '')}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-tsa-accent group-hover/link:text-pink-300 transition-colors" />
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
                                className="p-4 bg-tsa-black/50 rounded-lg border border-tsa-accent/10 hover:border-pink-300/20 transition-all duration-200"
                              >
                                <p className="text-tsa-white font-light mb-3">{contact.name}</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {contact.email && (
                                    <a
                                      href={`mailto:${contact.email}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-tsa-black/30 border border-tsa-accent/10 hover:border-pink-300/20 transition-all duration-200 group/link"
                                    >
                                      <Mail className="h-3.5 w-3.5 text-tsa-accent group-hover/link:text-pink-300 transition-colors" />
                                      <span className="text-sm text-tsa-white font-light truncate">{contact.email}</span>
                                    </a>
                                  )}
                                  {contact.phone && (
                                    <a
                                      href={`tel:${contact.phone}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-tsa-black/30 border border-tsa-accent/10 hover:border-pink-300/20 transition-all duration-200 group/link"
                                    >
                                      <Phone className="h-3.5 w-3.5 text-tsa-accent group-hover/link:text-pink-300 transition-colors" />
                                      <span className="text-sm text-tsa-white font-light truncate">{contact.phone}</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Fade effect at the bottom */}
                        <div className="absolute bottom-0 left-0 right-2 h-8 bg-gradient-to-t from-tsa-dark via-tsa-dark/50 to-transparent pointer-events-none"></div>
                      </div>
                    )}

                    {/* Notes Section */}
                    {client.notes && (
                      <div className="p-4 bg-tsa-black/50 rounded-lg border border-tsa-accent/10">
                        <p className="text-sm text-tsa-light font-light line-clamp-2">{client.notes}</p>
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
      <div className="hidden md:block elegant-box p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-tsa-light font-light mb-2">Total Clients</p>
            <p className="text-2xl font-display text-tsa-white">
              {filteredClients.length} <span className="text-sm text-pink-300">/ {clients.length}</span>
            </p>
          </div>
          <div>
            <p className="text-tsa-light font-light mb-2">Total Contacts</p>
            <p className="text-2xl font-display text-tsa-white">
              {filteredClients.reduce((sum, client) => sum + (client.contacts?.length || 0), 0)}
              <span className="text-sm text-pink-300"> / {clients.reduce((sum, client) => sum + (client.contacts?.length || 0), 0)}</span>
            </p>
          </div>
          <div>
            <p className="text-tsa-light font-light mb-2">With Booths</p>
            <p className="text-2xl font-display text-tsa-white">
              {filteredClients.filter(c => c.boothLocation).length}
              <span className="text-sm text-pink-300"> / {clients.filter(c => c.boothLocation).length}</span>
            </p>
          </div>
          <div>
            <p className="text-tsa-light font-light mb-2">Categories</p>
            <p className="text-2xl font-display text-tsa-white">
              {[...new Set(filteredClients.map(client => client.category))].length}
              <span className="text-sm text-pink-300"> / {uniqueCategories.length}</span>
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