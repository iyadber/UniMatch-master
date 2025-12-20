import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const sessionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.string().transform(str => new Date(str)),
  endTime: z.string().transform(str => new Date(str)),
  teacherId: z.string(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    // Define proper type for where clause
    type WhereClause = {
      teacherId?: string;
      studentId?: string;
      status?: string;
      startTime?: {
        gte?: Date;
        lte?: Date;
      };
    };

    // Base query: filter by user's role and ID
    const whereClause: WhereClause = session.user.role === 'teacher' 
      ? { 
          teacherId: session.user.id,
          // Teachers see all sessions by default, unless a specific status is requested
          ...(status && { status })
        }
      : { 
          studentId: session.user.id,
          // Students see all their sessions by default
          ...(status && { status })
        };

    // Add date range filter if provided
    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const sessions = await prisma.tutoringSession.findMany({
      where: whereClause,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    console.log('Found sessions:', sessions.length);
    
    // Transform the data to match the expected format from MongoDB
    const formattedSessions = sessions.map(session => ({
      id: session.id,
      title: session.title,
      description: session.description,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      status: session.status,
      teacher: session.teacher,
      student: session.student,
      course: null
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error('Error fetching sessions:', error instanceof Error ? error.message : 'Unknown error');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    console.log('Creating new session, user:', session.user);

    // Get and log the raw body first
    const rawBody = await req.text();
    console.log('Received raw session data:', rawBody);
    
    // Parse the body manually
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return new NextResponse(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Parsed session data:', body);

    // Validate the data against our schema
    let validatedData;
    try {
      validatedData = sessionSchema.parse(body);
      console.log('Validated session data:', validatedData);
    } catch (error) {
      console.error('Validation error:', error);
      if (error instanceof z.ZodError) {
        return new NextResponse(JSON.stringify({ error: error.errors[0].message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw error; // Re-throw if it's not a Zod error
    }

    // Validate that start time is before end time
    if (validatedData.startTime >= validatedData.endTime) {
      console.warn('Invalid time range:', { start: validatedData.startTime, end: validatedData.endTime });
      return new NextResponse(JSON.stringify({ error: 'Start time must be before end time' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate that the session is not in the past with better logging
    const now = new Date();
    console.log('Current server time:', now.toISOString());
    console.log('Session start time:', validatedData.startTime.toISOString());
    
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // 5-minute buffer
    
    if (validatedData.startTime < fiveMinutesAgo) {
      console.warn('Session appears to be in past:', {
        sessionTime: validatedData.startTime.toISOString(),
        currentTime: now.toISOString(),
        bufferTime: fiveMinutesAgo.toISOString(),
        difference: (validatedData.startTime.getTime() - now.getTime()) / (1000 * 60) + ' minutes'
      });
      return new NextResponse(JSON.stringify({ 
        error: 'Cannot schedule sessions in the past',
        details: {
          sessionTime: validatedData.startTime.toISOString(),
          serverTime: now.toISOString()
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for scheduling conflicts
    const conflict = await prisma.tutoringSession.findFirst({
      where: {
        teacherId: validatedData.teacherId,
        status: {
          in: ['scheduled']
        },
        OR: [
          {
            startTime: {
              lt: validatedData.endTime,
              gte: validatedData.startTime
            }
          },
          {
            endTime: {
              gt: validatedData.startTime,
              lte: validatedData.endTime
            }
          }
        ]
      }
    });

    if (conflict) {
      console.warn('Scheduling conflict found:', conflict);
      return new NextResponse(JSON.stringify({ 
        error: 'Time slot conflicts with an existing session',
        conflictingSession: {
          id: conflict.id,
          title: conflict.title,
          startTime: conflict.startTime.toISOString(),
          endTime: conflict.endTime.toISOString()
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify teacher exists
    const teacher = await prisma.user.findFirst({
      where: {
        id: validatedData.teacherId,
        role: 'teacher'
      }
    });

    if (!teacher) {
      console.warn('Teacher not found:', validatedData.teacherId);
      return new NextResponse(JSON.stringify({ error: 'Selected teacher not found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const newSession = {
      title: validatedData.title,
      description: validatedData.description,
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      teacherId: validatedData.teacherId,
      studentId: session.user.id,
      status: 'scheduled',
    };

    console.log('Creating new session:', newSession);

    let result;
    try {
      result = await prisma.tutoringSession.create({
        data: newSession
      });
    } catch (error) {
      console.error('Prisma error creating session:', error);
      return new NextResponse(JSON.stringify({ 
        error: 'Database error creating session',
        details: error instanceof Error ? error.message : 'Unknown Prisma error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!result) {
      console.error('Session creation not acknowledged');
      return new NextResponse(JSON.stringify({ error: 'Failed to create session' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Session created:', result.id);

    // Fetch the created session with populated data
    let createdSession;
    try {
      createdSession = await prisma.tutoringSession.findUnique({
        where: { id: result.id },
        include: {
          teacher: true,
          student: true
        }
      });
    } catch (error) {
      console.error('Error fetching created session:', error);
      // Return success but mention the fetch error
      return new NextResponse(JSON.stringify({ 
        success: true, 
        message: 'Session created but could not fetch details',
        sessionId: result.id
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!createdSession) {
      console.error('Failed to fetch created session');
      // Return success but mention the fetch error
      return new NextResponse(JSON.stringify({ 
        success: true, 
        message: 'Session created but could not fetch details',
        sessionId: result.id
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Returning created session:', createdSession);
    return NextResponse.json(createdSession);
  } catch (error) {
    console.error('[SESSIONS_POST] Unhandled error:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 