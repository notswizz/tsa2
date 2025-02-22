import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import BookingForm from '@/components/Bookings/BookingForm';
import BookingList from '@/components/Bookings/BookingList';
import BookingModal from '@/components/Bookings/BookingModal';
import { ChevronDown } from 'lucide-react';

export default function Bookings() {
  const [formData, setFormData] = useState({
    show: '',
    client: '',
    startDate: '',
    endDate: '',
    dailyStaffing: [],
    notes: '',
    status: 'Pending'
  });

  const [shows, setShows] = useState([]);
  const [clients, setClients] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingBooking, setEditingBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState('all');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Status options for mobile filter
  const statusOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Completed', label: 'Completed' }
  ];

  useEffect(() => {
    fetchData();
    fetchBookings();
  }, []);

  // Add formatDate function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Add fetch functions
  const fetchData = async () => {
    try {
      const [showsRes, clientsRes, staffRes] = await Promise.all([
        fetch('/api/shows'),
        fetch('/api/clients'),
        fetch('/api/staff')
      ]);

      const [showsData, clientsData, staffData] = await Promise.all([
        showsRes.json(),
        clientsRes.json(),
        staffRes.json()
      ]);

      setShows(showsData);
      setClients(clientsData);
      setStaffList(staffData);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings?populate=true');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      
      // Transform the dates from ISOString to Date objects
      const transformedBookings = data.map(booking => ({
        ...booking,
        _id: booking._id.$oid || booking._id,
        startDate: new Date(booking.startDate.$date || booking.startDate),
        endDate: new Date(booking.endDate.$date || booking.endDate),
        show: {
          ...(booking.show || {}),
          _id: booking.show?.$oid || booking.show?._id || booking.show
        },
        client: {
          ...(booking.client || {}),
          _id: booking.client?.$oid || booking.client?._id || booking.client
        },
        dailyStaffing: (booking.dailyStaffing || []).map(day => ({
          ...day,
          _id: day._id.$oid || day._id,
          date: new Date(day.date.$date || day.date),
          staffNeeded: parseInt(day.staffNeeded.$numberInt || day.staffNeeded),
          assignedStaff: (day.assignedStaff || []).map(staff => ({
            ...(typeof staff === 'object' ? staff : {}),
            _id: staff._id?.$oid || staff?._id || staff,
            name: staff.name || 'Unnamed Staff'
          }))
        }))
      }));

      setBookings(transformedBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create booking');
      
      const newBooking = await res.json();
      setBookings(prevBookings => [newBooking, ...prevBookings]);
      setSuccess('Booking created successfully!');
      setFormData({
        show: '',
        client: '',
        startDate: '',
        endDate: '',
        dailyStaffing: [],
        notes: '',
        status: 'Pending'
      });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const booking = bookings.find(b => b._id === bookingId);
      if (!booking) return;

      const updatedBooking = { ...booking, status: newStatus };
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBooking),
      });

      if (!res.ok) throw new Error('Failed to update booking status');
      
      const data = await res.json();
      setBookings(prevBookings => 
        prevBookings.map(b => b._id === bookingId ? data : b)
      );
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  const handleEdit = async (booking) => {
    try {
      // Set the initial booking data and open modal immediately
      setEditingBooking({
        ...booking,
        dailyStaffing: booking.dailyStaffing.map(day => ({
          ...day,
          assignedStaff: day.assignedStaff.map(staff => ({
            ...(typeof staff === 'object' ? staff : {}),
            _id: staff._id || staff,
            name: staff.name || 'Unnamed Staff'
          }))
        }))
      });
      setIsModalOpen(true);
      
      // Then fetch the complete booking data
      const res = await fetch(`/api/bookings/${booking._id}?populate=true`);
      if (!res.ok) throw new Error('Failed to fetch booking details');
      const data = await res.json();

      // Transform the dates and IDs while preserving existing data
      const completeBooking = {
        ...data,
        _id: data._id.$oid || data._id,
        startDate: new Date(data.startDate.$date || data.startDate),
        endDate: new Date(data.endDate.$date || data.endDate),
        show: {
          ...(data.show || {}),
          _id: data.show?.$oid || data.show?._id || data.show
        },
        client: {
          ...(data.client || {}),
          _id: data.client?.$oid || data.client?._id || data.client
        },
        status: data.status,
        notes: data.notes || '',
        dailyStaffing: (data.dailyStaffing || []).map(day => ({
          ...day,
          _id: day._id.$oid || day._id,
          date: new Date(day.date.$date || day.date),
          staffNeeded: parseInt(day.staffNeeded.$numberInt || day.staffNeeded),
          assignedStaff: (day.assignedStaff || []).map(staff => ({
            ...(typeof staff === 'object' ? staff : {}),
            _id: staff._id?.$oid || staff?._id || staff,
            name: staff.name || 'Unnamed Staff'
          }))
        }))
      };

      // Only update if modal is still open
      if (isModalOpen) {
        setEditingBooking(completeBooking);
      }
    } catch (err) {
      console.error('Error fetching booking details:', err);
      // Don't close modal on error, just keep showing initial data
    }
  };

  const handleDelete = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete booking');
      
      setBookings(prevBookings => 
        prevBookings.filter(booking => booking._id !== bookingId)
      );
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  const handleSaveEdit = async (editedData) => {
    try {
      const res = await fetch(`/api/bookings/${editedData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      if (!res.ok) throw new Error('Failed to update booking');
      
      const updatedBooking = await res.json();
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === updatedBooking._id ? updatedBooking : booking
        )
      );
      return true;
    } catch (err) {
      throw err;
    }
  };

  // Filter bookings based on show properties and status
  const filteredBookings = bookings.filter(booking => {
    const matchesShowType = showTypeFilter === 'all' || booking?.show?.type === showTypeFilter;
    const matchesSeason = seasonFilter === 'all' || booking?.show?.season === seasonFilter;
    const matchesLocation = locationFilter === 'all' || booking?.show?.location === locationFilter;
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    return matchesShowType && matchesSeason && matchesLocation && matchesStatus;
  });

  // Get bookings for a specific status
  const getBookingsByStatus = (status) => {
    return filteredBookings.filter(b => b.status === status);
  };

  return (
    <Layout>
      <Head>
        <title>Bookings - The Smith Agency CRM</title>
      </Head>

      <div className="h-[calc(100vh-6rem)] flex flex-col">
        {/* Fixed Header Section */}
        <div className="flex-none py-6 space-y-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Bookings</h1>
              
              {/* Mobile Status Filter */}
              <div className="relative md:hidden">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-dark-slate/50 border border-pink-200/20 rounded-lg px-4 py-2 pr-8 text-white focus:border-pink-400 focus:outline-none"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            {/* Desktop Status Badges */}
            <div className="hidden md:flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-300/20">
                <span className="text-sm text-yellow-200">
                  {getBookingsByStatus('Pending').length} Pending
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-300/20">
                <span className="text-sm text-emerald-200">
                  {getBookingsByStatus('Confirmed').length} Confirmed
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-300/20">
                <span className="text-sm text-purple-200">
                  {getBookingsByStatus('Completed').length} Completed
                </span>
              </div>
            </div>
          </div>

          {/* Filters and Actions Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Show Type Filter */}
            <div className="relative flex-1">
              <select
                value={showTypeFilter}
                onChange={(e) => setShowTypeFilter(e.target.value)}
                className="w-full appearance-none bg-dark-slate/50 border border-pink-200/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none"
              >
                <option value="all">All Show Types</option>
                <option value="Gift">Gift Show</option>
                <option value="Apparel">Apparel Show</option>
                <option value="Bridal">Bridal Show</option>
                <option value="Other">Other Shows</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Season Filter */}
            <div className="relative flex-1">
              <select
                value={seasonFilter}
                onChange={(e) => setSeasonFilter(e.target.value)}
                className="w-full appearance-none bg-dark-slate/50 border border-pink-200/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none"
              >
                <option value="all">All Seasons</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
                <option value="Winter">Winter</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Location Filter */}
            <div className="relative flex-1">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full appearance-none bg-dark-slate/50 border border-pink-200/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none"
              >
                <option value="all">All Locations</option>
                <option value="ATL">Atlanta</option>
                <option value="NYC">New York</option>
                <option value="LA">Los Angeles</option>
                <option value="DAL">Dallas</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Add Booking Button */}
            <button
              onClick={() => setShowForm(true)}
              className="flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-pink-500/20 border border-pink-300/30 text-pink-100 rounded-lg hover:bg-pink-500/30 transition-all duration-200"
            >
              <span className="text-base">Add Booking</span>
            </button>
          </div>
        </div>

        {showForm ? (
          <div className="flex-1 overflow-auto">
            <BookingForm
              formData={formData}
              setFormData={setFormData}
              shows={shows}
              clients={clients}
              staffList={staffList}
              isLoading={isLoading}
              error={error}
              success={success}
              onSubmit={handleSubmit}
              formatDate={formatDate}
            />
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 overflow-hidden">
            {/* Desktop Layout - Three Columns */}
            <div className="hidden md:flex flex-col bg-white/5 backdrop-blur-sm rounded-xl border border-pink-200/20">
              <div className="flex-none p-4 border-b border-pink-200/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-yellow-200">Pending</h2>
                  <span className="text-sm text-gray-400">
                    {getBookingsByStatus('Pending').length} bookings
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <BookingList
                  bookings={getBookingsByStatus('Pending')}
                  formatDate={formatDate}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusUpdate={handleStatusUpdate}
                  columnView
                />
              </div>
            </div>

            <div className="hidden md:flex flex-col bg-white/5 backdrop-blur-sm rounded-xl border border-pink-200/20">
              <div className="flex-none p-4 border-b border-pink-200/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-emerald-200">Confirmed</h2>
                  <span className="text-sm text-gray-400">
                    {getBookingsByStatus('Confirmed').length} bookings
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <BookingList
                  bookings={getBookingsByStatus('Confirmed')}
                  formatDate={formatDate}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusUpdate={handleStatusUpdate}
                  columnView
                />
              </div>
            </div>

            <div className="hidden md:flex flex-col bg-white/5 backdrop-blur-sm rounded-xl border border-pink-200/20">
              <div className="flex-none p-4 border-b border-pink-200/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-purple-200">Completed</h2>
                  <span className="text-sm text-gray-400">
                    {getBookingsByStatus('Completed').length} bookings
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <BookingList
                  bookings={getBookingsByStatus('Completed')}
                  formatDate={formatDate}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusUpdate={handleStatusUpdate}
                  columnView
                />
              </div>
            </div>

            {/* Mobile Layout - Single Column */}
            <div className="md:hidden flex-1 overflow-hidden">
              <BookingList
                bookings={selectedStatus === 'all' ? filteredBookings : getBookingsByStatus(selectedStatus)}
                formatDate={formatDate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          </div>
        )}

        <BookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBooking(null);
          }}
          booking={editingBooking}
          onSave={handleSaveEdit}
          shows={shows}
          clients={clients}
          staffList={staffList}
        />
      </div>
    </Layout>
  );
} 