import { Search } from 'lucide-react';

export default function StaffFilters({ 
  searchTerm, 
  setSearchTerm,
  locationFilter,
  setLocationFilter
}) {
  const locations = ['ATL', 'NYC', 'LA', 'DAL'];
  const locationNames = {
    'ATL': 'Atlanta',
    'NYC': 'New York',
    'LA': 'Los Angeles',
    'DAL': 'Dallas'
  };

  return (
    <div className="cyber-box p-4 mb-6">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or notes..."
              className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded-lg pl-10 pr-4 py-2 text-white focus:border-cyber-pink focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Location Filter */}
        <div className="w-48">
          <select
            className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded p-2 text-white focus:border-cyber-pink focus:outline-none"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="all">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {locationNames[loc]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 