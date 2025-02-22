import { useState, useEffect } from 'react';
import { Calendar, Users, Building2, ClipboardList, Plus, Minus, Copy, RefreshCw } from 'lucide-react';
import StaffAutocomplete from './StaffAutocomplete';

export default function BookingForm({ 
  formData, 
  setFormData, 
  shows, 
  clients, 
  staffList, 
  isLoading, 
  error, 
  success, 
  onSubmit,
  formatDate 
}) {
  const [selectedShow, setSelectedShow] = useState(null);
  const [dailyStaffing, setDailyStaffing] = useState([]);

  // When show is selected, generate daily staffing array
  useEffect(() => {
    if (formData.show) {
      const show = shows.find(s => s._id === formData.show);
      if (show) {
        setSelectedShow(show);
        // Reset dates when show changes
        setFormData(prev => ({
          ...prev,
          startDate: '',
          endDate: '',
          dailyStaffing: []
        }));
      }
    }
  }, [formData.show]);

  // When booking dates are set, generate daily staffing entries
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate + 'T00:00:00');
      const end = new Date(formData.endDate + 'T00:00:00');
      const days = [];
      let currentDate = new Date(start);

      while (currentDate <= end) {
        days.push({
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
          staffNeeded: 1,
          assignedStaff: []
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setDailyStaffing(days);
      setFormData(prev => ({ ...prev, dailyStaffing: days }));
    }
  }, [formData.startDate, formData.endDate]);

  const handleStaffCountChange = (index, count) => {
    const updated = dailyStaffing.map((day, i) => {
      if (i === index) {
        // Create new array with 'count' number of empty staff selections
        return {
          ...day,
          staffNeeded: count,
          assignedStaff: Array(count).fill('')
        };
      }
      return day;
    });
    setDailyStaffing(updated);
    setFormData(prev => ({ ...prev, dailyStaffing: updated }));
  };

  const handleIndividualStaffAssignment = (dayIndex, staffPosition, staffId) => {
    const updated = dailyStaffing.map((day, i) => {
      if (i === dayIndex) {
        const newAssignedStaff = [...day.assignedStaff];
        newAssignedStaff[staffPosition] = staffId;
        return {
          ...day,
          assignedStaff: newAssignedStaff
        };
      }
      return day;
    });
    setDailyStaffing(updated);
    setFormData(prev => ({ ...prev, dailyStaffing: updated }));
  };

  // Copy previous day's staff assignments
  const copyPreviousDay = (dayIndex) => {
    if (dayIndex === 0) return;
    
    const updated = dailyStaffing.map((day, i) => {
      if (i === dayIndex) {
        const previousDay = dailyStaffing[dayIndex - 1];
        return {
          ...day,
          staffNeeded: previousDay.staffNeeded,
          assignedStaff: [...previousDay.assignedStaff]
        };
      }
      return day;
    });
    setDailyStaffing(updated);
    setFormData(prev => ({ ...prev, dailyStaffing: updated }));
  };

  // Set same staff count for all days
  const setAllDaysStaffCount = (count) => {
    const updated = dailyStaffing.map(day => ({
      ...day,
      staffNeeded: count,
      assignedStaff: Array(count).fill('')
    }));
    setDailyStaffing(updated);
    setFormData(prev => ({ ...prev, dailyStaffing: updated }));
  };

  // Quick fill with available staff
  const autoFillDay = (dayIndex) => {
    const day = dailyStaffing[dayIndex];
    const availableStaff = staffList
      .filter(staff => !day.assignedStaff.includes(staff._id))
      .slice(0, day.staffNeeded);

    const updated = dailyStaffing.map((d, i) => {
      if (i === dayIndex) {
        return {
          ...d,
          assignedStaff: availableStaff.map(staff => staff._id)
        };
      }
      return d;
    });
    setDailyStaffing(updated);
    setFormData(prev => ({ ...prev, dailyStaffing: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    onSubmit(e);
  };

  return (
    <div className="cyber-box p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-cyber-pink" />
        Create New Booking
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Show</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                className="w-full bg-light-slate border border-tsa-pink/20 rounded p-2 pl-10 text-white focus:border-tsa-pink focus:outline-none"
                value={formData.show}
                onChange={(e) => setFormData({ ...formData, show: e.target.value })}
                required
              >
                <option value="">Select Show</option>
                {shows.map(show => (
                  <option key={show._id} value={show._id}>
                    {show.type} Show - {show.location} ({formatDate(show.startDate)} - {formatDate(show.endDate)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Client</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                className="w-full bg-light-slate border border-tsa-pink/20 rounded p-2 pl-10 text-white focus:border-tsa-pink focus:outline-none"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                required
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedShow && (
            <>
              <div>
                <label className="block text-gray-300 mb-2">Booking Start Date</label>
                <input
                  type="date"
                  className="w-full bg-light-slate border border-tsa-pink/20 rounded p-2 text-white focus:border-tsa-pink focus:outline-none"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  min={selectedShow.startDate.split('T')[0]}
                  max={selectedShow.endDate.split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Booking End Date</label>
                <input
                  type="date"
                  className="w-full bg-light-slate border border-tsa-pink/20 rounded p-2 text-white focus:border-tsa-pink focus:outline-none"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate || selectedShow.startDate.split('T')[0]}
                  max={selectedShow.endDate.split('T')[0]}
                  required
                />
              </div>
            </>
          )}
        </div>

        {dailyStaffing.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-cyber-pink" />
                Daily Staff Requirements
              </h3>
              <div className="flex items-center gap-4">
                <label className="text-gray-400 text-sm">Set All Days:</label>
                <select
                  className="bg-light-slate border border-tsa-pink/20 rounded p-2 text-white focus:border-tsa-pink focus:outline-none"
                  onChange={(e) => setAllDaysStaffCount(parseInt(e.target.value))}
                >
                  <option value="">Select Count</option>
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} Staff</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {dailyStaffing.map((day, dayIndex) => (
                <div key={dayIndex} className="cyber-box p-4 bg-dark-slate/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-white">{formatDate(day.date)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-1 hover:bg-cyber-pink/10 rounded"
                          onClick={() => handleStaffCountChange(dayIndex, Math.max(1, day.staffNeeded - 1))}
                        >
                          <Minus className="h-4 w-4 text-cyber-pink" />
                        </button>
                        <span className="text-gray-400 w-6 text-center">{day.staffNeeded}</span>
                        <button
                          type="button"
                          className="p-1 hover:bg-cyber-pink/10 rounded"
                          onClick={() => handleStaffCountChange(dayIndex, day.staffNeeded + 1)}
                        >
                          <Plus className="h-4 w-4 text-cyber-pink" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {dayIndex > 0 && (
                        <button
                          type="button"
                          className="text-sm px-3 py-1 border border-cyber-pink/20 text-cyber-pink rounded hover:bg-cyber-pink/10 flex items-center gap-1"
                          onClick={() => copyPreviousDay(dayIndex)}
                        >
                          <Copy className="h-4 w-4" /> Copy Previous
                        </button>
                      )}
                      <button
                        type="button"
                        className="text-sm px-3 py-1 border border-cyber-pink/20 text-cyber-pink rounded hover:bg-cyber-pink/10 flex items-center gap-1"
                        onClick={() => autoFillDay(dayIndex)}
                      >
                        <RefreshCw className="h-4 w-4" /> Auto Fill
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(day.staffNeeded).fill(null).map((_, staffIndex) => (
                      <StaffAutocomplete
                        key={staffIndex}
                        staffList={staffList}
                        value={day.assignedStaff[staffIndex] || ''}
                        onChange={(staffId) => handleIndividualStaffAssignment(dayIndex, staffIndex, staffId)}
                        placeholder={`Staff member ${staffIndex + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-gray-300 mb-2">Notes (Optional)</label>
          <textarea
            className="w-full bg-light-slate border border-tsa-pink/20 rounded p-2 text-white focus:border-tsa-pink focus:outline-none"
            rows="3"
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any additional notes here..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="cyber-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  );
} 