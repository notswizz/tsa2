import { upload } from '@/utils/s3';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Promisify the multer middleware
    await new Promise((resolve, reject) => {
      upload.single('photo')(req, res, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the URL and key of the uploaded file
    return res.status(200).json({ 
      url: req.file.location,
      key: req.file.key
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message || 'Error uploading file' });
  }
} 