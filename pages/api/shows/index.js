import dbConnect from '@/utils/db';
import Show from '@/models/Show';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const shows = await Show.find({}).sort({ startDate: 1 });
        res.status(200).json(shows);
      } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ error: 'Failed to fetch shows', details: error.message });
      }
      break;

    case 'POST':
      try {
        const data = req.body;
        
        // Validate dates
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        if (endDate < startDate) {
          return res.status(400).json({
            error: 'Invalid dates',
            details: 'End date must be after start date'
          });
        }

        const show = await Show.create(data);
        res.status(201).json(show);
      } catch (error) {
        console.error('POST Error:', error);
        res.status(500).json({ 
          error: 'Failed to create show',
          details: error.message 
        });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
} 