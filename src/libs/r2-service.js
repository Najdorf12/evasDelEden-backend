import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";

dotenv.config();

// Configuración optimizada del cliente S3 para R2
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
  forcePathStyle: true,
  maxAttempts: 5, // Aumentar reintentos
});

// Configuración mejorada para uploads multiparte
const uploadConfig = {
  partSize: 10 * 1024 * 1024, // 10MB por parte (mínimo 5MB para R2)
  queueSize: 4, // Partes concurrentes
  leavePartsOnError: false,
};

// Función mejorada para upload de archivos grandes
export const uploadToR2 = async (file, folder = "uploads") => {
  if (!file?.buffer) throw new Error("No file buffer provided");
  
  const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
  
  // Decidir si usar upload simple o multiparte basado en el tamaño
  const useMultipart = file.size > 20 * 1024 * 1024; // >20MB usa multiparte

  const uploadParams = {
    client: r2Client,
    params: {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        originalName: encodeURIComponent(file.originalname),
        size: file.size.toString(),
        ...(file.duration && { duration: file.duration.toString() })
      }
    },
    ...(useMultipart && uploadConfig)
  };

  const upload = new Upload(uploadParams);

  try {
    await upload.done();
    return {
      public_id: fileName,
      secure_url: `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${fileName}`,
    };
  } catch (error) {
    console.error("Upload error:", error);
    try {
      if (upload instanceof Upload) {
        await upload.abort();
      }
    } catch (abortError) {
      console.error('Error aborting upload:', abortError);
    }
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Funciones específicas manteniendo compatibilidad
export const uploadImageToR2 = async (file) => uploadToR2(file, "evas-images");
export const uploadVideoToR2 = async (file) => uploadToR2(file, "evas-videos");

// Funciones de eliminación (sin cambios)
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

export const deleteImageFromR2 = deleteFileFromR2;
export const deleteVideoFromR2 = deleteFileFromR2;