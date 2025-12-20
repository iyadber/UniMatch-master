import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ courseId: string; videoId: string }>;
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
    const { courseId, videoId } = params;

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: videoId,
        courseId: courseId
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Transform data to match the expected format for the frontend
    let url = '';
    let description = '';
    
    try {
      // Parse content field assuming it contains JSON with url and description
      const parsedContent = JSON.parse(lesson.content);
      url = parsedContent.url || '';
      description = parsedContent.description || '';
    } catch (e) {
      // If parsing fails, assume content is just the URL
      url = lesson.content;
    }
    
    const video = {
      _id: lesson.id,
      title: lesson.title,
      url: url,
      description: description,
      order: lesson.order,
      courseId: lesson.courseId,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt
    };

    return NextResponse.json(video);
  } catch (error) {
    console.error('[VIDEO_GET]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
} 