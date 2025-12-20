import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Check if the course exists and is active
    const course = await prisma.course.findUnique({
      where: { 
        id: courseId,
        status: 'active'
      }
    });

    if (!course) {
      return NextResponse.json(
        { message: 'Course not found or not available' },
        { status: 404 }
      );
    }

    // Check if the user is already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        courseId: courseId,
        studentId: session.user.id
      }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { message: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create the enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        courseId: courseId,
        studentId: session.user.id,
        status: 'active'
      }
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error('Error creating enrollment:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
} 