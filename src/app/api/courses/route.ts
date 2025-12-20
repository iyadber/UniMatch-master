import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { courseSchema } from '@/models/Course';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ZodError } from 'zod';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = searchParams.get('query');

    // Build where clause for Prisma
    const where: any = {};
    
    // If teacher, only show their courses
    if (session.user.role === 'teacher') {
      where.teacherId = session.user.id;
    }

    if (status) {
      where.status = status;
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        enrollments: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to include counts
    const formattedCourses = courses.map(course => ({
      _id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      category: course.category,
      status: course.status,
      price: course.price,
      teacherId: course.teacherId,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
            _count: {
        enrollments: course.enrollments.length
            }
    }));

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error('[COURSES_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can create courses' }, { status: 403 });
    }

    const body = await req.json();
    
    try {
      // Validate the data
      const validatedData = courseSchema.parse({
        ...body,
        teacherId: session.user.id,
      });

      // Create course using Prisma
      const createdCourse = await prisma.course.create({
        data: {
        ...validatedData,
          teacherId: session.user.id,
        },
      });

      return NextResponse.json({ 
        success: true,
        course: createdCourse
      }, { status: 201 });
    } catch (validationError) {
      console.error('[COURSES_POST_VALIDATION]', validationError);
      if (validationError instanceof ZodError) {
        return NextResponse.json({ 
          success: false,
          error: 'Invalid course data',
          details: validationError.errors
        }, { status: 400 });
      }
      throw validationError;
    }
  } catch (error) {
    console.error('[COURSES_POST]', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create course',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 