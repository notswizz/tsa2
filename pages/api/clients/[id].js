import dbConnect from '../../../utils/db';
import Client from '../../../models/Client';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const client = await Client.findById(id);
        if (!client) {
          return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(client);
      } catch (error) {
        res.status(400).json({ error: 'Error fetching client' });
      }
      break;

    case 'PUT':
      try {
        const updatedClient = await Client.findByIdAndUpdate(
          id,
          { ...req.body },
          { new: true, runValidators: true }
        );
        if (!updatedClient) {
          return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(updatedClient);
      } catch (error) {
        res.status(400).json({ error: 'Error updating client' });
      }
      break;

    case 'DELETE':
      try {
        const deletedClient = await Client.findByIdAndDelete(id);
        if (!deletedClient) {
          return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted successfully' });
      } catch (error) {
        res.status(400).json({ error: 'Error deleting client' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
} 