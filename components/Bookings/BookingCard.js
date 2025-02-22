import { Calendar, Users, Building2, CheckCircle, XCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function BookingCard({ 
  booking, 
  formatDate, 
  onEdit,
  columnView = false
}) {
  const [showStaffDetails, setShowStaffDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'text-emerald-400';
      case 'Pending': return 'text-yellow-400';
      case 'Completed': return 'text-purple-400';
      case 'Cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-500/10 border-emerald-300/20';
      case 'Pending': return 'bg-yellow-500/10 border-yellow-300/20';
      case 'Completed': return 'bg-purple-500/10 border-purple-300/20';
      case 'Cancelled': return 'bg-red-500/10 border-red-300/20';
      default: return 'bg-gray-500/10 border-gray-300/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'Pending': return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'Completed': return <CheckCircle className="h-5 w-5 text-purple-400" />;
      case 'Cancelled': return <XCircle className="h-5 w-5 text-red-400" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  // Calculate total staff needed across all days
  const totalStaffNeeded = booking.dailyStaffing.reduce((sum, day) => sum + day.staffNeeded, 0);
  const totalStaffAssigned = booking.dailyStaffing.reduce((sum, day) => sum + day.assignedStaff.length, 0);

  return (
    <div className={`relative bg-white/5 backdrop-blur-sm rounded-xl border border-pink-200/20 hover:border-pink-300/30 transition-all duration-300 overflow-hidden group ${columnView ? 'mx-1' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-3 md:p-4 space-y-3 md:space-y-4">
        {/* Header with Status */}
        <div className="flex items-center justify-between">
          <div className={`px-2 md:px-3 py-1 rounded-full ${getStatusBg(booking.status)} flex items-center gap-1.5 md:gap-2`}>
            {getStatusIcon(booking.status)}
            <span className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>
          <button 
            onClick={() => onEdit(booking)}
            className="p-2 rounded-lg bg-pink-500/10 border border-pink-300/20 text-pink-200 hover:bg-pink-500/20 transition-colors duration-200"
          >
            Edit
          </button>
        </div>

        {/* Show Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-pink-300 flex-shrink-0" />
            <span className="text-sm md:text-base text-white">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-pink-300 flex-shrink-0" />
            <span className="text-sm md:text-base text-white truncate">{booking.client?.companyName || 'No Client'}</span>
          </div>
        </div>

        {/* Staff Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-pink-300 flex-shrink-0" />
            <span className="text-sm text-gray-300">
              {totalStaffAssigned}/{totalStaffNeeded} Staff
            </span>
          </div>
          <button
            onClick={() => setShowStaffDetails(!showStaffDetails)}
            className="text-pink-200 hover:text-pink-300 text-sm flex items-center gap-1 py-1"
          >
            {showStaffDetails ? (
              <>Hide Details <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Show Details <ChevronDown className="h-4 w-4" /></>
            )}
          </button>
        </div>

        {/* Expandable Staff Details */}
        {showStaffDetails && (
          <div className="border-t border-pink-200/10 pt-3 space-y-2">
            {booking.dailyStaffing.map((day, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-2 text-sm">
                <div className="flex justify-between text-gray-300 mb-1">
                  <span className="text-xs md:text-sm">{formatDate(day.date)}</span>
                  <span className="text-xs md:text-sm">{day.assignedStaff.length}/{day.staffNeeded}</span>
                </div>
                <div className="space-y-1">
                  {day.assignedStaff.map((staff, staffIndex) => (
                    <div key={staffIndex} className="text-gray-400 text-xs md:text-sm">
                      {staff?.name || 'Unnamed Staff'}
                    </div>
                  ))}
                  {day.assignedStaff.length < day.staffNeeded && (
                    <div className="text-yellow-400 text-xs md:text-sm">
                      {day.staffNeeded - day.assignedStaff.length} positions unfilled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="border-t border-pink-200/10 pt-3">
            <p className="text-xs md:text-sm text-gray-400 line-clamp-2 italic">{booking.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
} 