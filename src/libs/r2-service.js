import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY
  },
  forcePathStyle: true
});

export const uploadImageToR2 = async (file, folder = 'evas-images') => {
  const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
  
  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  try {
    await r2Client.send(new PutObjectCommand(params));
    
    return {
      public_id: fileName,
      secure_url: `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${fileName}`
    };
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw error;
  }
};

export const deleteImageFromR2 = async (public_id) => {
  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: public_id
  };

  try {
    await r2Client.send(new DeleteObjectCommand(params));
    return true;
  } catch (error) {
    console.error('Error deleting from R2:', error);
    throw error;
  }
};

export const uploadVideoToR2 = async (file, folder = 'evas-videos') => {
  const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
  
  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  try {
    await r2Client.send(new PutObjectCommand(params));
    
    return {
      public_id: fileName,
      secure_url: `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${fileName}`
    };
  } catch (error) {
    console.error('Error uploading video to R2:', error);
    throw error;
  }
};

export const deleteVideoFromR2 = async (public_id) => {
  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: public_id
  };

  try {
    await r2Client.send(new DeleteObjectCommand(params));
    return true;
  } catch (error) {
    console.error('Error deleting video from R2:', error);
    throw error;
  }
};