import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { createReadStream } from 'fs';
import dotenv from "dotenv";

dotenv.config();

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
  forcePathStyle: true,
});

export const uploadImageToR2 = async (file, folder = "evas-images") => {
  try {
    if (!file?.path && !file?.buffer) {
      throw new Error("No file provided");
    }

    const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    
    // Usar streaming si está disponible el path, sino usar buffer
    const body = file.path ? createReadStream(file.path) : file.buffer;

    const upload = new Upload({
      client: r2Client,
      params: {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: body,
        ContentType: file.mimetype,
        Metadata: {
          originalName: encodeURIComponent(file.originalname),
          size: file.size.toString()
        }
      },
      partSize: 20 * 1024 * 1024, // 20MB por parte
      queueSize: 4, // Partes concurrentes
    });

    await upload.done();

    return {
      public_id: fileName,
      secure_url: `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${fileName}`,
    };
  } catch (error) {
    console.error('R2 Upload Error:', error);
    throw new Error(`Failed to upload: ${error.message}`);
  }
};

export const uploadVideoToR2 = async (file, folder = "evas-videos") => {
  if (!file?.buffer) throw new Error("No file buffer provided");
  
  const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
  const upload = new Upload({
    client: r2Client,
    params: {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        originalName: encodeURIComponent(file.originalname),
        size: file.size.toString(),
        duration: file.duration?.toString() || '0'
      }
    },
    ...uploadConfig,
  });

  try {
    await upload.done();
    return {
      public_id: fileName,
      secure_url: `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${fileName}`,
    };
  } catch (error) {
    return handleUploadError(upload, error);
  }
};

// Funciones de eliminación mejoradas
export const deleteFileFromR2 = async (public_id) => {
  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: public_id,
  };

  try {
    await r2Client.send(new DeleteObjectCommand(params));
    return true;
  } catch (error) {
    console.error("Error deleting from R2:", error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

// Alias para mantener compatibilidad
export const deleteImageFromR2 = deleteFileFromR2;
export const deleteVideoFromR2 = deleteFileFromR2;