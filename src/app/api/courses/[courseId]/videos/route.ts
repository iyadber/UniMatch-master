import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const videoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Valid URL is required'),
  description: z.string().optional(),
  order: z.number().int().min(0, 'Order must be a non-negative number'),
});

async function validateCourseAccess(courseId: string, userId: string, requireTeacher = false) {
  try {
    if (!courseId) {
      return null;
    }

    if (requireTeacher) {
      // If teacher access is required, only check for teacher ownership
      return await prisma.course.findUnique({
        where: {
          id: courseId,
          teacherId: userId
        }
      });
    } else {
      // Check if user is teacher or has enrollment
      const course = await prisma.course.findFirst({
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
      return course;
    }
  } catch (error) {
    console.error('[VALIDATE_COURSE_ACCESS]', error);
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

    const lessons = await prisma.lesson.findMany({
      where: {
        courseId: courseId
      },
      orderBy: {
        order: 'asc'
      }
    });

    // Transform to maintain compatibility with frontend
    // In Prisma's schema, 'content' field stores the URL and possibly description
    const formattedVideos = lessons.map(lesson => {
      // For backward compatibility, we'll assume content contains the URL
      // Parse the content field if it might have JSON
      let url = '';
      let description = '';
      
      try {
        // Check if content is a JSON string that might contain both url and description
        const parsedContent = JSON.parse(lesson.content);
        url = parsedContent.url || '';
        description = parsedContent.description || '';
      } catch (e) {
        // If not JSON, assume content is just the URL
        url = lesson.content;
      }
      
      return {
        _id: lesson.id,
        title: lesson.title,
        url: url,
        description: description,
        order: lesson.order,
        courseId: lesson.courseId,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt
      };
    });

    return NextResponse.json({ success: true, videos: formattedVideos });
  } catch (error) {
    console.error('[VIDEOS_GET]', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
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

    const params = await context.params;
    const { courseId } = params;
    const course = await validateCourseAccess(courseId, session.user.id, true);

    if (!course) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 403 });
    }

    const body = await request.json();

    try {
      const validatedData = videoSchema.parse(body);

      // Store url and description in the content field as JSON
      const contentData = {
        url: validatedData.url,
        description: validatedData.description || ''
      };

      const createdLesson = await prisma.lesson.create({
        data: {
          title: validatedData.title,
          content: JSON.stringify(contentData), // Store URL and description in content field
          order: validatedData.order,
          courseId: courseId,
        }
      });

      // Format response to match what frontend expects
      const formattedVideo = {
        _id: createdLesson.id,
        title: createdLesson.title,
        url: validatedData.url,
        description: validatedData.description || '',
        order: createdLesson.order,
        courseId: createdLesson.courseId,
        createdAt: createdLesson.createdAt,
        updatedAt: createdLesson.updatedAt
      };

      return NextResponse.json({
        success: true,
        video: formattedVideo
      }, { status: 201 });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error('[VIDEOS_POST_VALIDATION]', validationError);
        return NextResponse.json({ 
          error: 'Invalid video data',
          details: validationError.errors
        }, { status: 400 });
      }
      throw validationError;
    }
  } catch (error) {
    console.error('[VIDEOS_POST]', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      error: 'Failed to create video',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json({ error: 'Valid video ID is required' }, { status: 400 });
    }

    // Delete the video using Prisma
    try {
      await prisma.lesson.delete({
        where: {
          id: videoId,
          courseId: courseId
        }
      });
    } catch (deleteError) {
      console.error('[VIDEO_DELETE_ERROR]', deleteError);
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[VIDEOS_DELETE]', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      error: 'Failed to delete video',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 