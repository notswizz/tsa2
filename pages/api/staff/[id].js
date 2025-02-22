import dbConnect from '../../../utils/db';
import Staff from '../../../models/Staff';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const staff = await Staff.findById(id);
        if (!staff) {
          return res.status(404).json({ error: 'Staff member not found' });
        }
        res.status(200).json(staff);
      } catch (error) {
        res.status(400).json({ error: 'Error fetching staff member' });
      }
      break;

    case 'PUT':
      try {
        const updatedStaff = await Staff.findByIdAndUpdate(
          id,
          { ...req.body },
          { new: true, runValidators: true }
        );
        if (!updatedStaff) {
          return res.status(404).json({ error: 'Staff member not found' });
        }
        res.status(200).json(updatedStaff);
      } catch (error) {
        res.status(400).json({ error: 'Error updating staff member' });
      }
      break;

    case 'DELETE':
      try {
        const deletedStaff = await Staff.findByIdAndDelete(id);
        if (!deletedStaff) {
          return res.status(404).json({ error: 'Staff member not found' });
        }
        res.status(200).json({ message: 'Staff member deleted successfully' });
      } catch (error) {
        res.status(400).json({ error: 'Error deleting staff member' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
} 