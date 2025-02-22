import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, ExternalLink, FileText, Ruler, Search, GraduationCap, Footprints, Shirt, Clock10, Plus } from 'lucide-react';
import StaffFilters from './StaffFilters';
import StaffModal from './StaffModal';
import Image from 'next/image';

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const locationNames = {
    'ATL': 'Atlanta',
    'NYC': 'New York',
    'LA': 'Los Angeles',
    'DAL': 'Dallas'
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      if (!res.ok) throw new Error('Failed to fetch staff');
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      setError('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateAge = (birthday) => {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsModalOpen(true);
  };

  const handleStaffUpdated = (updatedStaff) => {
    if (selectedStaff) {
      // Editing existing staff
      setStaff(staff.map(s => 
        s._id === updatedStaff._id ? updatedStaff : s
      ));
    } else {
      // Adding new staff
      setStaff(prev => [...prev, updatedStaff]);
    }
    setIsModalOpen(false);
    setSelectedStaff(null);
  };

  // Add a button to open the modal for adding new staff
  const handleAddStaff = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  // Add shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const filteredStaff = shuffleArray(staff.filter(member => {
    const searchString = searchTerm.toLowerCase();
    const locationMatch = member.location.some(loc => loc.toLowerCase().includes(searchString));
    return (
      member.name.toLowerCase().includes(searchString) ||
      member.email.toLowerCase().includes(searchString) ||
      member.role?.toLowerCase().includes(searchString) ||
      member.department?.toLowerCase().includes(searchString) ||
      locationMatch
    );
  }));

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="cyber-box p-6">
        <p className="text-cyber-pink">Loading staff data...</p>
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

  return (
    <div className="h-full flex flex-col space-y-4 md:space-y-6">
      {/* Search Bar and Add Button */}
      <div className="cyber-box p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, location..."
              className="w-full bg-dark-slate/50 border border-pink-200/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddStaff}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-pink-500/20 border border-pink-300/30 text-pink-100 rounded-lg hover:bg-pink-500/30 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add Staff</span>
          </button>
        </div>
      </div>

      {/* Staff Grid - Scrollable */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto px-0.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-4">
            {filteredStaff.length === 0 ? (
              <div className="col-span-full cyber-box p-6 text-center text-gray-400">
                No staff members found matching your search.
              </div>
            ) : (
              filteredStaff.map((member) => (
                <div 
                  key={member._id}
                  onClick={() => handleEdit(member)}
                  className="relative bg-black/30 backdrop-blur-xl rounded-xl border border-pink-200/20 hover:border-pink-300/30 transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Main Content */}
                  <div className="relative p-3 md:p-4">
                    {/* Profile Photo Section with Overlaid Info */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg ring-1 ring-pink-300/20 group-hover:ring-pink-300/40 transition-all duration-300">
                      {member.photoUrl ? (
                        <div className="relative w-full h-full group-hover:scale-[1.02] transition-transform duration-500">
                          <Image
                            src={member.photoUrl}
                            alt={member.name}
                            fill
                            className="object-cover rounded-lg"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {/* Enhanced gradient overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center rounded-lg">
                          <span className="text-6xl text-pink-300/50 font-light">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Overlaid Stats */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-500/30 backdrop-blur-md border border-purple-300/30 shadow-lg shadow-purple-500/10">
                          <Calendar className="h-3.5 w-3.5 text-purple-300" />
                          <span className="text-xs font-medium text-purple-100">{calculateAge(member.birthday)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-500/30 backdrop-blur-md border border-rose-300/30 shadow-lg shadow-rose-500/10">
                          <div className="flex items-center gap-1">
                            <Footprints className="h-3.5 w-3.5 text-rose-300" />
                            <span className="text-xs font-medium text-rose-100">{member.shoeSize}</span>
                          </div>
                          <div className="w-px h-2.5 bg-rose-300/30"></div>
                          <div className="flex items-center gap-1">
                            <Shirt className="h-3.5 w-3.5 text-rose-300" />
                            <span className="text-xs font-medium text-rose-100">{member.dressSize}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-cyan-500/30 backdrop-blur-md border border-cyan-300/30 shadow-lg shadow-cyan-500/10">
                          <Clock10 className="h-3.5 w-3.5 text-cyan-300" />
                          <span className="text-xs font-medium text-cyan-100">{member.daysWorked} days</span>
                        </div>
                      </div>

                      {/* Name and Location */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <h3 className="text-xl md:text-2xl font-light text-white tracking-wide mb-2 group-hover:text-pink-200 transition-colors line-clamp-2">{member.name}</h3>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {member.location.map((loc, index) => (
                            <div 
                              key={loc}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/30 backdrop-blur-md border border-pink-300/30 shadow-lg shadow-pink-500/10"
                            >
                              {index === 0 && <MapPin className="h-3 w-3 text-pink-300" />}
                              <span className="text-xs text-pink-100">{locationNames[loc]}</span>
                            </div>
                          ))}
                        </div>

                        {/* Notes Overlay - Appears on Hover */}
                        {member.notes && (
                          <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3 md:p-4 bg-gradient-to-t from-black/95 via-black/90 to-transparent backdrop-blur-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-pink-400 mt-1.5"></div>
                              <p className="text-xs md:text-sm text-gray-300 line-clamp-3 font-light">
                                {member.notes}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className="mt-3 space-y-2">
                      {member.college && (
                        <div className="flex items-center gap-2 text-violet-200 px-1">
                          <GraduationCap className="h-3.5 w-3.5 text-violet-300" />
                          <span className="text-xs md:text-sm truncate">{member.college}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <a href={`mailto:${member.email}`} 
                           onClick={(e) => e.stopPropagation()}
                           className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-teal-500/10 border border-teal-300/20 hover:bg-teal-500/20 transition-colors duration-200 group/link"
                        >
                          <Mail className="h-3.5 w-3.5 text-teal-300 group-hover/link:scale-110 transition-transform" />
                          <span className="text-xs md:text-sm text-teal-200 truncate">{member.email}</span>
                        </a>
                        <a href={`tel:${member.phone}`} 
                           onClick={(e) => e.stopPropagation()}
                           className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-300/20 hover:bg-indigo-500/20 transition-colors duration-200 group/link"
                        >
                          <Phone className="h-3.5 w-3.5 text-indigo-300 group-hover/link:scale-110 transition-transform" />
                          <span className="text-xs md:text-sm text-indigo-200">{member.phone}</span>
                        </a>
                      </div>
                      {member.resumeUrl && (
                        <a 
                          href={member.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-rose-500/10 border border-rose-300/20 hover:bg-rose-500/20 transition-colors duration-200 group/link"
                        >
                          <FileText className="h-3.5 w-3.5 text-rose-300 group-hover/link:scale-110 transition-transform" />
                          <span className="text-xs md:text-sm text-rose-200">View Resume</span>
                          <ExternalLink className="h-3 w-3 text-rose-300 ml-auto group-hover/link:scale-110 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary - Hidden on mobile */}
      <div className="hidden md:block cyber-box p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 text-center">
          <div>
            <p className="text-xs md:text-sm text-gray-400">Total</p>
            <p className="text-lg md:text-xl font-bold text-white">
              {filteredStaff.length}
            </p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-400">Atlanta</p>
            <p className="text-lg md:text-xl font-bold text-pink-400">
              {filteredStaff.filter(m => m.location.includes('ATL')).length}
            </p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-400">New York</p>
            <p className="text-lg md:text-xl font-bold text-pink-400">
              {filteredStaff.filter(m => m.location.includes('NYC')).length}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs md:text-sm text-gray-400">Los Angeles</p>
            <p className="text-lg md:text-xl font-bold text-pink-400">
              {filteredStaff.filter(m => m.location.includes('LA')).length}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs md:text-sm text-gray-400">Dallas</p>
            <p className="text-lg md:text-xl font-bold text-pink-400">
              {filteredStaff.filter(m => m.location.includes('DAL')).length}
            </p>
          </div>
        </div>
      </div>

      {/* Add StaffModal */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
        onStaffUpdated={handleStaffUpdated}
      />
    </div>
  );
} 