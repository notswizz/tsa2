import dbConnect from '@/utils/db';
import Staff from '@/models/Staff';

export default async function handler(req, res) {
  await dbConnect();

  try {
    switch (req.method) {
      case 'GET':
        const staff = await Staff.find({}).sort({ name: 1 });
        res.status(200).json(staff);
        break;

      case 'POST':
        const newStaff = await Staff.create(req.body);
        res.status(201).json(newStaff);
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
} 