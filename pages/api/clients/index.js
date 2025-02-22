import dbConnect from '@/utils/db';
import Client from '@/models/Client';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const clients = await Client.find({}).sort({ createdAt: -1 });
        res.status(200).json(clients);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clients' });
      }
      break;

    case 'POST':
      try {
        const client = await Client.create(req.body);
        res.status(201).json(client);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create client' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
} 