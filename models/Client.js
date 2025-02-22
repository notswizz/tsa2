import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a contact name'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  }
});

const ClientSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please provide a company name'],
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  website: {
    type: String,
  },
  boothLocation: {
    type: String,
  },
  category: {
    type: String,
    required: [true, 'Please specify the category']
  },
  contacts: [ContactSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Client || mongoose.model('Client', ClientSchema); 