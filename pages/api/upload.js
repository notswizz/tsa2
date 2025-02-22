import formidable from 'formidable';
import fs from 'fs';
import AWS from 'aws-sdk';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to parse file upload' });
      }

      const file = files.file;
      const fileContent = fs.readFileSync(file.filepath);

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `resumes/${Date.now()}-${file.originalFilename}`,
        Body: fileContent,
        ContentType: file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();

      res.status(200).json({
        fileName: file.originalFilename,
        fileUrl: uploadResult.Location
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
} 