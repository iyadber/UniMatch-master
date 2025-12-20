import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{
    teacherId: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { teacherId } = await params;
    
    console.log(`[TEACHER_SCHEDULE_GET] Fetching schedule for teacher: ${teacherId}`);
    
    // Fetch the teacher's sessions with status 'scheduled' (not completed or cancelled)
    const teacherSessions = await prisma.tutoringSession.findMany({
      where: {
        teacherId: teacherId,
        status: {
          in: ['scheduled']
        }
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        status: true
      },
      orderBy: {
        startTime: 'asc'
      }
    });
    
    console.log(`[TEACHER_SCHEDULE_GET] Found ${teacherSessions.length} sessions`);
    
    // Transform dates to ISO strings for easier frontend handling
    const formattedSessions = teacherSessions.map(session => ({
      id: session.id,
      title: session.title,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      status: session.status
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error('[TEACHER_SCHEDULE_GET] Error:', error instanceof Error ? error.message : 'Unknown error');
    return new NextResponse('Internal Error', { status: 500 });
  }
} 