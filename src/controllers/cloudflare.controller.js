import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

// Generar URL firmada para subida directa
export const generatePresignedUrlController = async (req, res) => {
  try {
    const { fileName, fileType, folder = 'evas-uploads' } = req.body;
    
    if (!fileName || !fileType) {
      return res.status(400).json({ 
        success: false,
        message: "Nombre y tipo de archivo son requeridos" 
      });
    }

    const uniqueFileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${fileName.replace(/\s+/g, '-')}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });

    res.status(200).json({
      success: true,
      data: {
        url: signedUrl,
        publicUrl: `https://${process.env.R2_PUBLIC_DOMAIN}/${uniqueFileName}`,
        key: uniqueFileName
      }
    });

  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating upload URL',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Guardar referencia en tu base de datos
export const saveFileReference = async (req, res) => {
  try {
    const { publicUrl, key, size, type } = req.body;
    
    // Aquí deberías guardar la referencia en tu base de datos
    // Esto es un ejemplo - adapta según tu modelo de datos
    
    res.status(200).json({
      public_id: key,
      secure_url: publicUrl,
      // ...otros campos que necesites
    });

  } catch (error) {
    console.error('Error saving file reference:', error);
    res.status(500).json({ 
      message: 'Error saving file reference',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Eliminar imagen (puede mantenerse similar a tu implementación actual)
export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params;
    
    await r2Client.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: public_id,
    }));

    // Aquí también deberías eliminar la referencia de tu base de datos
    
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ 
      message: "Error deleting image",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Eliminar video (similar a deleteImage)
export const deleteVideo = async (req, res) => {
  try {
    const { public_id } = req.params;
    
    await r2Client.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: public_id,
    }));

    // Eliminar referencia de la base de datos
    
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ 
      message: "Error deleting video",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};