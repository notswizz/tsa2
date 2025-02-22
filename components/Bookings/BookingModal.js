import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Calendar, Users, Building2, ClipboardList } from 'lucide-react';
import Modal from '../common/Modal';
import BookingForm from './BookingForm';

export default function BookingModal({
  isOpen,
  onClose,
  booking,
  onSave,
  onDelete,
  shows,
  clients,
  staffList
}) {
  const [formData, setFormData] = useState({
    show: '',
    client: '',
    startDate: '',
    endDate: '',
    dailyStaffing: [],
    notes: '',
    status: 'Pending'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (booking) {
        // Initialize form with existing booking data
        setFormData({
          show: booking.show?._id || '',
          client: booking.client?._id || '',
          startDate: booking.startDate ? new Date(booking.startDate).toISOString().split('T')[0] : '',
          endDate: booking.endDate ? new Date(booking.endDate).toISOString().split('T')[0] : '',
          dailyStaffing: (booking.dailyStaffing || []).map(day => ({
            date: new Date(day.date),
            staffNeeded: day.staffNeeded || 1,
            assignedStaff: (day.assignedStaff || []).map(staff => 
              typeof staff === 'string' ? staff : staff._id
            )
          })),
          notes: booking.notes || '',
          status: booking.status || 'Pending'
        });
      } else {
        // Reset form for new booking
        setFormData({
          show: '',
          client: '',
          startDate: '',
          endDate: '',
          dailyStaffing: [],
          notes: '',
          status: 'Pending'
        });
      }
    }
  }, [isOpen, booking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await onSave(formData);
      setSuccess('Booking saved successfully');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to save booking');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="cyber-box p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {booking ? 'Edit Booking' : 'Add New Booking'}
          </h2>
          {booking && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
                  onDelete(booking._id);
                  onClose();
                }
              }}
              className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-300/20 text-red-200 hover:bg-red-500/20 transition-colors duration-200"
            >
              Delete Booking
            </button>
          )}
        </div>

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
    </Modal>
  );
} 