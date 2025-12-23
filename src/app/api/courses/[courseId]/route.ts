import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { courseSchema } from '@/models/Course';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function validateCourseAccess(courseId: string, userId: string, requireTeacher = false) {
  if (!courseId) {
    return null;
  }

  try {
    if (requireTeacher) {
      // Only allow course teacher
      return await prisma.course.findUnique({
        where: {
          id: courseId,
          teacherId: userId
        }
      });
    } else {
      // Allow teacher OR enrolled student
      return await prisma.course.findFirst({
        where: {
          id: courseId,
          OR: [
            { teacherId: userId },
            {
              enrollments: {
                some: {
                  studentId: userId
                }
              }
            }
          ]
        }
      });
    }
  } catch (error) {
    console.error("Error validating course access:", error);
    return null;
  }
}

interface RouteContext {
  params: Promise<{ courseId: string }>;
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
    const course = await validateCourseAccess(courseId, session.user.id);

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSE_GET]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function PATCH(
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
    const course = await validateCourseAccess(courseId, session.user.id, true);

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = courseSchema.parse({
      ...body,
      teacherId: session.user.id,
    });

    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: validatedData,
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('[COURSE_PATCH]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
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
    const course = await validateCourseAccess(courseId, session.user.id, true);

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Delete in a transaction to ensure all related data is properly removed
    await prisma.$transaction([
      // Delete any videos associated with the course
      prisma.lesson.deleteMany({
        where: {
          courseId: courseId
        }
      }),

      // Delete the course itself
      prisma.course.delete({
        where: {
          id: courseId
        }
      })
    ]);

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error('[COURSE_DELETE]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
} 