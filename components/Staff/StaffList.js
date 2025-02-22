import { useState, useMemo, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, ExternalLink, FileText, Ruler, Search, GraduationCap, Footprints, Shirt, Clock10, Plus } from 'lucide-react';
import StaffFilters from './StaffFilters';
import StaffModal from './StaffModal';
import Image from 'next/image';
import StaffCard from './StaffCard';
import StaffSearchBar from './StaffSearchBar';
import { useStaffData } from '@/hooks/useStaffData';

export default function StaffList({ onEdit }) {
  const { staff, loading, error, updateStaff, addStaff } = useStaffData();
  const [shuffledStaff, setShuffledStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Shuffle staff when it changes
  useEffect(() => {
    setShuffledStaff(shuffleArray(staff));
  }, [staff]);

  // Add shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleSaveStaff = (updatedStaff) => {
    if (selectedStaff) {
      // Editing existing staff
      updateStaff(updatedStaff);
    } else {
      // Adding new staff
      addStaff(updatedStaff);
    }
    setIsModalOpen(false);
    setSelectedStaff(null);
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsModalOpen(true);
  };

  // Add a button to open the modal for adding new staff
  const handleAddStaff = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const filteredStaff = useMemo(() => {
    return shuffledStaff.filter(member => {
      const searchString = searchTerm.toLowerCase();
      const locationMatch = member.location.some(loc => 
        loc.toLowerCase().includes(searchString)
      );
      return (
        member.name.toLowerCase().includes(searchString) ||
        member.email.toLowerCase().includes(searchString) ||
        member.role?.toLowerCase().includes(searchString) ||
        member.department?.toLowerCase().includes(searchString) ||
        locationMatch
      );
    });
  }, [shuffledStaff, searchTerm]);

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
      <StaffSearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddStaff={() => onEdit(null)}
      />

      {/* Staff Grid - Scrollable */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto px-0.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 pb-4">
            {filteredStaff.length === 0 ? (
              <div className="col-span-full cyber-box p-6 text-center text-gray-400">
                No staff members found matching your search.
              </div>
            ) : (
              filteredStaff.map((member) => (
                <StaffCard 
                  key={member._id}
                  member={member}
                  onClick={onEdit}
                />
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
        onSave={handleSaveStaff}
      />
    </div>
  );
} 