import dbConnect from '@/utils/db';
import Booking from '@/models/Booking';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const bookings = await Booking.find({})
          .populate('show')
          .populate('client')
          .populate('dailyStaffing.assignedStaff')
          .sort({ createdAt: -1 });
        res.status(200).json(bookings);
      } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
      }
      break;

    case 'POST':
      try {
        const booking = await Booking.create(req.body);
        const populatedBooking = await booking
          .populate(['show', 'client', 'dailyStaffing.assignedStaff']);
        res.status(201).json(populatedBooking);
      } catch (error) {
        console.error('POST Error:', error);
        res.status(500).json({ 
          error: 'Failed to create booking',
          details: error.message 
        });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
} 