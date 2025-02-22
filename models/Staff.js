import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true
  },
  phone: String,
  location: {
    type: [String],
    required: [true, 'Please provide at least one location'],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.every(loc => ['ATL', 'NYC', 'LA', 'DAL'].includes(loc));
      },
      message: 'At least one valid location must be selected'
    }
  },
  birthday: {
    type: Date,
    required: [true, 'Please provide a birthday']
  },
  college: {
    type: String,
    trim: true
  },
  shoeSize: String,
  dressSize: String,
  photoUrl: String,
  resumeUrl: String,
  daysWorked: {
    type: Number,
    default: 0,
    min: [0, 'Days worked cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  },
  notes: String
}, {
  timestamps: true
});

// Clear the existing model if it exists
mongoose.models = {};

export default mongoose.model('Staff', StaffSchema); 