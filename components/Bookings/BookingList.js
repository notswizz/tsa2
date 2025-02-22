import { useState } from 'react';
import BookingCard from './BookingCard';
import BookingFilters from './BookingFilters';

export default function BookingList({ 
  bookings, 
  formatDate, 
  onEdit,
  onDelete,
  onStatusUpdate,
  columnView = false 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showTypeFilter, setShowTypeFilter] = useState('all');

  // Extract unique locations and show types from bookings
  const locations = [...new Set(bookings.map(booking => booking.show?.location).filter(Boolean))];
  const showTypes = [...new Set(bookings.map(booking => booking.show?.type).filter(Boolean))];

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true;
    
    const matchesSearch = 
      (booking?.client?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking?.dailyStaffing || []).some(day => 
        day.assignedStaff.some(staff => 
          (staff?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) ||
      (booking?.notes || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || (booking?.status || '').toLowerCase() === statusFilter;
    const matchesLocation = locationFilter === 'all' || booking?.show?.location === locationFilter;
    const matchesShowType = showTypeFilter === 'all' || booking?.show?.type === showTypeFilter;

    return matchesSearch && matchesStatus && matchesLocation && matchesShowType;
  });

  // Group bookings by status for better organization
  const groupedBookings = filteredBookings.reduce((acc, booking) => {
    const status = booking.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(booking);
    return acc;
  }, {});

  // Order of status display
  const statusOrder = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

  if (!bookings?.length) {
    return (
      <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-pink-200/20">
        <p className="text-gray-400">No bookings found</p>
      </div>
    );
  }

  return (
    <div className={`${columnView ? 'h-full overflow-y-auto px-4' : 'space-y-4 overflow-y-auto px-2 pb-4'}`}>
      {bookings.map((booking) => (
        <div key={booking._id} className={columnView ? 'mb-4 last:mb-0' : ''}>
          <BookingCard
            booking={booking}
            formatDate={formatDate}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusUpdate={onStatusUpdate}
            columnView={columnView}
          />
        </div>
      ))}
    </div>
  );
} 