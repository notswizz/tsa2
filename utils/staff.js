import mongoose from 'mongoose';
import dbConnect from './db';

// Staff Schema
const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  location: [{ type: String, enum: ['ATL', 'NYC', 'LA', 'DAL'] }],
  role: { type: String },
  department: { type: String },
  shoeSize: { type: String },
  dressSize: { type: String },
  birthday: { type: Date },
  college: { type: String },
  daysWorked: { type: Number, default: 0 },
  notes: { type: String },
  photoUrl: { type: String },
  resumeUrl: { type: String },
}, {
  timestamps: true
});

// Initialize the model (or get it if it's already initialized)
const Staff = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);

export async function searchStaff({ query, location, department }) {
  await dbConnect();

  try {
    let searchQuery = {};

    if (query) {
      searchQuery = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { role: { $regex: query, $options: 'i' } },
          { department: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } }
        ]
      };
    }

    if (location) {
      searchQuery.location = location;
    }

    if (department) {
      searchQuery.department = { $regex: department, $options: 'i' };
    }

    const results = await Staff.find(searchQuery).lean();
    return { success: true, data: results };
  } catch (error) {
    console.error('Search staff error:', error);
    return { success: false, error: error.message };
  }
}

export async function getStaffMember({ name, email }) {
  await dbConnect();

  try {
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (email) query.email = email;

    const staff = await Staff.findOne(query).lean();

    if (!staff) {
      return { success: false, error: 'Staff member not found' };
    }

    return { success: true, data: staff };
  } catch (error) {
    console.error('Get staff member error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateStaffMember(id, updates) {
  await dbConnect();

  try {
    const staff = await Staff.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!staff) {
      return { success: false, error: 'Staff member not found' };
    }

    return { 
      success: true, 
      data: staff,
      message: 'Staff member updated successfully'
    };
  } catch (error) {
    console.error('Update staff member error:', error);
    return { success: false, error: error.message };
  }
} 