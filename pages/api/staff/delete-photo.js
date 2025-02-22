import { deleteFileFromS3 } from '@/utils/s3';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ error: 'Photo URL is required' });
    }

    const deleted = await deleteFileFromS3(photoUrl);

    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete photo from S3' });
    }

    return res.status(200).json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    return res.status(500).json({ error: 'Error deleting photo' });
  }
} 