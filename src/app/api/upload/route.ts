import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    
    // Create unique filename for reference (used as public_id in Cloudinary)
    const filename = `${uuidv4()}.${extension}`;
    
    // Upload to Cloudinary
    const url = await uploadToCloudinary(buffer, {
      public_id: filename.split('.')[0], // Use filename without extension as public_id
      resource_type: 'auto' // Automatically detect resource type
    });
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('[UPLOAD_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 