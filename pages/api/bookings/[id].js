import dbConnect from '@/utils/db';
import Booking from '@/models/Booking';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'PUT':
      try {
        const booking = await Booking.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        ).populate([
          'show',
          'client',
          'dailyStaffing.assignedStaff'
        ]);

        if (!booking) {
          return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json(booking);
      } catch (error) {
        console.error('PUT Error:', error);
        res.status(500).json({ 
          error: 'Failed to update booking',
          details: error.message 
        });
      }
      break;

    case 'DELETE':
      try {
        const booking = await Booking.findByIdAndDelete(id);
        
        if (!booking) {
          return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
      } catch (error) {
        console.error('DELETE Error:', error);
        res.status(500).json({ 
          error: 'Failed to delete booking',
          details: error.message 
        });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
} 