import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{
    sessionId: string;
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

    const { sessionId } = await params;

    const client = await clientPromise;
    const db = client.db('unimatch_db');

    const tutoringSession = await db.collection('TutoringSession').aggregate([
      {
        $match: {
          _id: new ObjectId(sessionId),
          $or: [
            { teacherId: new ObjectId(session.user.id) },
            { studentId: new ObjectId(session.user.id) }
          ]
        }
      },
      {
        $lookup: {
          from: 'User',
          localField: 'teacherId',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      {
        $lookup: {
          from: 'User',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      {
        $lookup: {
          from: 'Course',
          localField: 'courseId',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: {
          path: '$teacher',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$student',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          'teacher.password': 0,
          'student.password': 0
        }
      }
    ]).toArray();

    if (!tutoringSession[0]) {
      return new NextResponse('Session not found', { status: 404 });
    }

    return NextResponse.json(tutoringSession[0]);
  } catch (error) {
    console.error('[SESSION_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { sessionId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['pending', 'accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    // Get the current session to check permissions
    const currentSession = await prisma.tutoringSession.findUnique({
      where: {
        id: sessionId
      }
    });

    if (!currentSession) {
      return new NextResponse('Session not found', { status: 404 });
    }

    // Check permissions based on role and status change
    const isTeacher = session.user.role === 'teacher';
    const isStudent = session.user.role === 'student';
    const isTeacherOfSession = currentSession.teacherId === session.user.id;
    const isStudentOfSession = currentSession.studentId === session.user.id;

    // Teachers can accept/reject pending sessions and mark sessions as completed
    // Students can only cancel their pending sessions
    if (
      (isTeacher && !isTeacherOfSession) || 
      (isStudent && !isStudentOfSession) ||
      (isStudent && !['cancelled'].includes(status)) ||
      (isTeacher && !['accepted', 'rejected', 'completed'].includes(status))
    ) {
      return new NextResponse('Unauthorized to perform this action', { status: 403 });
    }

    // Additional validation for status transitions
    if (
      (currentSession.status === 'completed' && status !== 'completed') ||
      (currentSession.status === 'cancelled' && status !== 'cancelled') ||
      (currentSession.status === 'rejected' && status !== 'rejected') ||
      (status === 'completed' && currentSession.status !== 'accepted')
    ) {
      return new NextResponse('Invalid status transition', { status: 400 });
    }

    // Update the session
    const updatedSession = await prisma.tutoringSession.update({
      where: {
        id: sessionId
      },
      data: {
        status: status,
        updatedAt: new Date()
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('[SESSION_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { sessionId } = await params;

    const client = await clientPromise;
    const db = client.db('unimatch_db');

    const result = await db.collection('TutoringSession').findOneAndDelete({
      _id: new ObjectId(sessionId),
      $or: [
        { teacherId: new ObjectId(session.user.id) },
        { studentId: new ObjectId(session.user.id) }
      ]
    });

    if (!result?.value) {
      return new NextResponse('Session not found', { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[SESSION_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 