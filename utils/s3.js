import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer for S3 uploads
export const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        contentType: file.mimetype
      });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `staff-photos/${uniqueSuffix}${ext}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: function(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (allowedTypes.test(ext) && allowedTypes.test(mimetype)) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'));
  }
});

// Helper function to delete file from S3
export async function deleteFileFromS3(fileUrl) {
  try {
    if (!fileUrl) return true;
    
    const key = fileUrl.split('/').pop();
    await s3Client.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `staff-photos/${key}`,
    });
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return false;
  }
} 