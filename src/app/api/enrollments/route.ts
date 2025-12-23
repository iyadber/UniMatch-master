import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Fetch all enrolled courses for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all enrollments for the current user with course details
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: session.user.id,
        status: 'active'
      },
      include: {
        course: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            lessons: {
              select: {
                id: true
              }
            },
            _count: {
              select: {
                enrollments: true,
                lessons: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform to return course data with enrollment info
    const enrolledCourses = enrollments.map(enrollment => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      imageUrl: enrollment.course.imageUrl,
      category: enrollment.course.category,
      price: enrollment.course.price,
      status: enrollment.course.status,
      enrolledAt: enrollment.createdAt,
      enrollmentId: enrollment.id,
      teacher: {
        id: enrollment.course.teacher?.id,
        name: enrollment.course.teacher?.name || 'Unknown Teacher',
        image: enrollment.course.teacher?.image || null
      },
      _count: {
        enrollments: enrollment.course._count.enrollments,
        lessons: enrollment.course._count.lessons
      },
      // Calculate basic progress (can be enhanced with lesson completion tracking)
      totalLessons: enrollment.course._count.lessons,
      completedLessons: 0, // Placeholder - can be implemented with lesson progress tracking
      progress: 0 // Placeholder - can be calculated based on lesson completion
    }));

    return NextResponse.json(enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Failed to fetch enrolled courses' },
      { status: 500 }
    );
  }
}

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