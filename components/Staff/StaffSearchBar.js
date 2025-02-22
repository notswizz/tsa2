import { Search, Plus } from 'lucide-react';

export default function StaffSearchBar({ searchTerm, onSearchChange, onAddStaff }) {
  return (
    <div className="cyber-box p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, location..."
            className="w-full bg-dark-slate/50 border border-pink-200/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none transition-colors"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button
          onClick={onAddStaff}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-pink-500/20 border border-pink-300/30 text-pink-100 rounded-lg hover:bg-pink-500/30 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Staff</span>
        </button>
      </div>
    </div>
  );
} 