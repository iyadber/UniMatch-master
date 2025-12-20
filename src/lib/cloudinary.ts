import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: any;
}

export async function uploadToCloudinary(file: Buffer, options = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    // Convert buffer to base64
    const base64String = `data:image/png;base64,${file.toString('base64')}`;
    
    cloudinary.uploader.upload(
      base64String,
      { folder: 'nextjs-uploads', ...options },
      (error: Error | undefined, result: CloudinaryUploadResult | undefined) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result?.secure_url || '');
      }
    );
  });
}

export default cloudinary; 