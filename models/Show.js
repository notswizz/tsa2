import mongoose from 'mongoose';

const ShowSchema = new mongoose.Schema({
  location: {
    type: String,
    required: [true, 'Please specify the location'],
    enum: ['ATL', 'NYC', 'LA', 'DAL'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  type: {
    type: String,
    required: [true, 'Please specify the show type'],
    enum: ['Gift', 'Apparel', 'Bridal', 'Other']
  },
  season: {
    type: String,
    required: [true, 'Please specify the season'],
    enum: ['Spring', 'Summer', 'Fall', 'Winter']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Show || mongoose.model('Show', ShowSchema); 