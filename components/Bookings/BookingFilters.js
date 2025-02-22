import { Search, Filter } from 'lucide-react';

export default function BookingFilters({ 
  searchTerm, 
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  locationFilter,
  setLocationFilter,
  showTypeFilter,
  setShowTypeFilter,
  locations,
  showTypes
}) {
  const statusOptions = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  return (
    <div className="cyber-box p-4 mb-6">
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client, staff, or notes..."
              className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded-lg pl-10 pr-4 py-2 text-white focus:border-cyber-pink focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-40">
          <select
            className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded p-2 text-white focus:border-cyber-pink focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status} value={status.toLowerCase()}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="w-40">
          <select
            className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded p-2 text-white focus:border-cyber-pink focus:outline-none"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Show Type Filter */}
        <div className="w-48">
          <select
            className="w-full bg-dark-slate/50 border border-cyber-pink/20 rounded p-2 text-white focus:border-cyber-pink focus:outline-none"
            value={showTypeFilter}
            onChange={(e) => setShowTypeFilter(e.target.value)}
          >
            <option value="all">All Show Types</option>
            {showTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 