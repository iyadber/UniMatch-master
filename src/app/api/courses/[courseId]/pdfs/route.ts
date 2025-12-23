import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface RouteContext {
  params: Promise<{ courseId: string }>;
}

// Helper function to ensure the directory exists
async function ensurePublicUploadDir() {
  const publicDir = path.join(process.cwd(), 'public');
  const uploadsDir = path.join(publicDir, 'uploads', 'pdfs');

  // This would typically use fs.mkdir with recursive: true
  // but for simplicity in this example, we assume the directory exists
  return uploadsDir;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const { courseId } = params;

    // Check if course exists and user is the teacher OR enrolled student
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        OR: [
          // Admin can access any course
          ...(session.user.role === 'admin' ? [{}] : []),
          // Teacher who owns the course
          { teacherId: session.user.id },
          // Student enrolled in the course
          {
            enrollments: {
              some: {
                studentId: session.user.id
              }
            }
          }
        ]
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Get course PDFs - using Lesson model with PDF content type
    const pdfs = await prisma.lesson.findMany({
      where: {
        courseId,
        // We'll store PDF lessons with a special prefix in the content field
        content: {
          startsWith: 'PDF:'
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    // Transform DB data to match the expected frontend format
    const transformedPdfs = pdfs.map((pdf) => {
      // Extract the URL from the content field
      const url = pdf.content.replace('PDF:', '');

      return {
        _id: pdf.id,
        title: pdf.title,
        url: url,
        description: '', // Lesson model doesn't have description
        order: pdf.order
      };
    });

    return NextResponse.json({ success: true, pdfs: transformedPdfs });
  } catch (error) {
    console.error('[GET_COURSE_PDFS]', error);
    return NextResponse.json({ error: 'Failed to fetch PDFs' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'teacher' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only teachers can add PDFs' }, { status: 403 });
    }

    const params = await context.params;
    const { courseId } = params;

    // Check if course exists and user is the teacher
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: session.user.role === 'admin' ? undefined : session.user.id
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Process the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const order = parseInt(formData.get('order') as string) || 0;

    if (!file || !title) {
      return NextResponse.json({ error: 'File and title are required' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Get file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a unique filename
    const fileName = `${uuidv4()}-${file.name.replace(/\s/g, '_')}`;

    // Upload to Cloudinary instead of local file system
    const fileUrl = await uploadToCloudinary(buffer, {
      public_id: fileName.split('.')[0],
      resource_type: 'raw',
      folder: 'pdfs'
    });

    // Save to database - using Lesson model as a temporary solution
    const pdf = await prisma.lesson.create({
      data: {
        courseId,
        title,
        // Store description along with URL in the content field
        content: `PDF:${fileUrl}`,
        order
      }
    });

    // Return transformed data for frontend consistency
    const transformedPdf = {
      _id: pdf.id,
      title: pdf.title,
      url: fileUrl,
      description: description || '',
      order: pdf.order
    };

    return NextResponse.json({ success: true, pdf: transformedPdf }, { status: 201 });
  } catch (error) {
    console.error('[ADD_COURSE_PDF]', error);
    return NextResponse.json({ error: 'Failed to add PDF' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const { courseId } = params;

    // Get request body
    const { pdfId } = await request.json();

    if (!pdfId) {
      return NextResponse.json({ error: 'PDF ID is required' }, { status: 400 });
    }

    // Check if course exists and user is the teacher
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: session.user.role === 'admin' ? undefined : session.user.id
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Check if PDF exists and belongs to the course
    const pdf = await prisma.lesson.findFirst({
      where: {
        id: pdfId,
        courseId,
        content: {
          startsWith: 'PDF:'
        }
      }
    });

    if (!pdf) {
      return NextResponse.json({ error: 'PDF not found or does not belong to this course' }, { status: 404 });
    }

    // Delete PDF from database
    await prisma.lesson.delete({
      where: {
        id: pdfId
      }
    });

    // Note: In a production environment, you would also delete the physical file
    // But for simplicity we're skipping that step in this example

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE_COURSE_PDF]', error);
    return NextResponse.json({ error: 'Failed to delete PDF' }, { status: 500 });
  }
} 