import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (session.user.role !== 'teacher') {
            return new NextResponse('Forbidden - Teacher access only', { status: 403 });
        }

        const teacherId = session.user.id;

        // Get all sessions for this teacher
        const allSessions = await prisma.tutoringSession.findMany({
            where: { teacherId },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: { startTime: 'asc' }
        });

        // Get upcoming sessions (scheduled, start time in the future)
        const now = new Date();
        const upcomingSessions = allSessions.filter(
            s => s.status === 'scheduled' && new Date(s.startTime) >= now
        );

        // Get completed sessions
        const completedSessions = allSessions.filter(s => s.status === 'completed');

        // Get unique students (from all sessions)
        const uniqueStudentIds = new Set(allSessions.map(s => s.studentId));
        const activeStudentsCount = uniqueStudentIds.size;

        // Get teacher's courses with enrollments
        const courses = await prisma.course.findMany({
            where: { teacherId },
            include: {
                enrollments: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });

        // Count total enrollments across all courses
        const totalEnrollments = courses.reduce((acc, course) => acc + course.enrollments.length, 0);

        // Format upcoming bookings for the dashboard
        const formattedBookings = upcomingSessions.slice(0, 10).map(booking => {
            const startTime = new Date(booking.startTime);
            const endTime = new Date(booking.endTime);
            const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
            const durationHours = durationMinutes / 60;

            return {
                id: booking.id,
                student: booking.student?.name || 'Unknown Student',
                studentImage: booking.student?.image,
                subject: booking.title,
                date: startTime.toISOString().split('T')[0],
                time: startTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),
                duration: durationHours >= 1
                    ? `${durationHours} hour${durationHours !== 1 ? 's' : ''}`
                    : `${durationMinutes} min`,
                status: booking.status,
                type: 'video'
            };
        });

        // Stats summary
        const stats = {
            activeStudents: activeStudentsCount,
            totalEnrollments,
            sessionsCompleted: completedSessions.length,
            upcomingSessions: upcomingSessions.length,
            totalSessions: allSessions.length,
            totalCourses: courses.length
        };

        return NextResponse.json({
            stats,
            upcomingBookings: formattedBookings,
            courses: courses.map(c => ({
                id: c.id,
                title: c.title,
                description: c.description,
                status: c.status,
                enrollmentCount: c.enrollments.length,
                category: c.category,
                price: c.price
            }))
        });

    } catch (error) {
        console.error('[TUTOR_STATS_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
