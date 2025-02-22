import mongoose from 'mongoose';

const StaffAssignmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  staffNeeded: {
    type: Number,
    required: true,
    min: 1
  },
  assignedStaff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }]
});

const BookingSchema = new mongoose.Schema({
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: [true, 'Please specify the show']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Please specify the client']
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  dailyStaffing: [StaffAssignmentSchema],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema); 