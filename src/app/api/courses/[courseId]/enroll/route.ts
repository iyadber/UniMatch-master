import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ courseId: string }>;
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

    // Only students can enroll in courses
    if (session.user.role !== 'student') {
      return NextResponse.json({ error: 'Only students can enroll in courses' }, { status: 403 });
    }

    const params = await context.params;
    const { courseId } = params;

    // Check if course exists and is active
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        status: 'active'
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found or not available for enrollment' }, { status: 404 });
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        courseId_studentId: {
          courseId: courseId,
          studentId: session.user.id
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'You are already enrolled in this course' }, { status: 400 });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        courseId: courseId,
        studentId: session.user.id,
        status: 'active'
      }
    });

    return NextResponse.json({ success: true, enrollment }, { status: 201 });
  } catch (error) {
    console.error('[COURSE_ENROLL]', error);
    return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
  }
} 