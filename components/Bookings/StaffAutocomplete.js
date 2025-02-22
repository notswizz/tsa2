import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';

export default function StaffAutocomplete({ 
  staffList,
  value,
  onChange,
  placeholder = "Search staff...",
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const locationNames = {
    'ATL': 'Atlanta',
    'NYC': 'New York',
    'LA': 'Los Angeles',
    'DAL': 'Dallas'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get selected staff member's name
  const selectedStaff = staffList.find(staff => staff._id === value);
  
  // Filter staff based on search term
  const filteredStaff = staffList.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    staff._id !== value // Don't show already selected staff
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded-lg pl-10 pr-4 py-2 text-white focus:border-cyber-pink focus:outline-none"
          placeholder={placeholder}
          value={selectedStaff ? selectedStaff.name : searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (selectedStaff) {
              onChange(''); // Clear selection when user starts typing
            }
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
        />
      </div>

      {isOpen && filteredStaff.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-dark-slate border border-cyber-pink/20 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredStaff.map((staff) => (
            <button
              key={staff._id}
              className="w-full text-left px-4 py-2 hover:bg-cyber-pink/10 text-white"
              onClick={() => {
                onChange(staff._id);
                setSearchTerm('');
                setIsOpen(false);
              }}
            >
              <div className="text-sm">{staff.name}</div>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                {staff.location.map((loc, index) => (
                  <span key={loc} className="text-xs text-gray-400">
                    {locationNames[loc]}{index < staff.location.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 