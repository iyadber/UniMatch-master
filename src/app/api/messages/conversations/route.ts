import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

// Get all conversations for the current user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = session.user.id;
        const userRole = session.user.role;

        // Get all messages where user is sender or receiver
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true
                    }
                }
            }
        });

        // Build a map of conversations by the other user's ID
        const conversationsMap = new Map<string, {
            contact: {
                id: string;
                name: string;
                email: string;
                image: string | null;
                role: string;
            };
            lastMessage: string;
            lastMessageTime: Date;
            unreadCount: number;
        }>();

        for (const message of messages) {
            // Determine the "other" user in the conversation
            const otherUser = message.senderId === userId ? message.receiver : message.sender;
            const otherId = otherUser.id;

            if (!conversationsMap.has(otherId)) {
                // Count unread messages from this user
                const unreadCount = messages.filter(
                    m => m.senderId === otherId && m.receiverId === userId && !m.read
                ).length;

                conversationsMap.set(otherId, {
                    contact: {
                        id: otherUser.id,
                        name: otherUser.name || 'Unknown User',
                        email: otherUser.email || '',
                        image: otherUser.image,
                        role: otherUser.role
                    },
                    lastMessage: message.content,
                    lastMessageTime: message.createdAt,
                    unreadCount
                });
            }
        }

        // Also get users the current user might want to message but hasn't yet
        // For students: get teachers they have sessions with or courses enrolled in
        // For teachers: get students in their sessions or enrolled in their courses

        let potentialContacts: { id: string; name: string | null; email: string | null; image: string | null; role: string }[] = [];

        if (userRole === 'student') {
            // Get teachers from enrolled courses
            const enrollments = await prisma.enrollment.findMany({
                where: { studentId: userId },
                include: {
                    course: {
                        include: {
                            teacher: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true,
                                    role: true
                                }
                            }
                        }
                    }
                }
            });

            // Get teachers from tutoring sessions
            const sessions = await prisma.tutoringSession.findMany({
                where: { studentId: userId },
                include: {
                    teacher: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            role: true
                        }
                    }
                }
            });

            // Add course teachers
            for (const enrollment of enrollments) {
                if (enrollment.course.teacher && !conversationsMap.has(enrollment.course.teacher.id)) {
                    potentialContacts.push(enrollment.course.teacher);
                }
            }

            // Add session teachers
            for (const s of sessions) {
                if (s.teacher && !conversationsMap.has(s.teacher.id)) {
                    potentialContacts.push(s.teacher);
                }
            }

        } else if (userRole === 'teacher') {
            // Get students from their courses
            const courses = await prisma.course.findMany({
                where: { teacherId: userId },
                include: {
                    enrollments: {
                        include: {
                            student: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true,
                                    role: true
                                }
                            }
                        }
                    }
                }
            });

            // Get students from tutoring sessions
            const sessions = await prisma.tutoringSession.findMany({
                where: { teacherId: userId },
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            role: true
                        }
                    }
                }
            });

            // Add enrolled students
            for (const course of courses) {
                for (const enrollment of course.enrollments) {
                    if (enrollment.student && !conversationsMap.has(enrollment.student.id)) {
                        potentialContacts.push(enrollment.student);
                    }
                }
            }

            // Add session students
            for (const s of sessions) {
                if (s.student && !conversationsMap.has(s.student.id)) {
                    potentialContacts.push(s.student);
                }
            }
        }

        // Remove duplicates from potential contacts
        const uniquePotentialContacts = potentialContacts.filter((contact, index, self) =>
            index === self.findIndex(c => c.id === contact.id) && !conversationsMap.has(contact.id)
        );

        // Convert map to array and sort by last message time
        const conversationsArray = Array.from(conversationsMap.values())
            .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());

        // Format response
        const formattedConversations = conversationsArray.map(conv => ({
            id: conv.contact.id,
            name: conv.contact.name,
            email: conv.contact.email,
            avatar: conv.contact.image,
            role: conv.contact.role === 'teacher' ? 'Teacher' : 'Student',
            lastMessage: conv.lastMessage,
            lastMessageTime: conv.lastMessageTime.toISOString(),
            unreadCount: conv.unreadCount,
            isOnline: false // We don't track online status yet
        }));

        // Add potential contacts (users without messages yet)
        const formattedPotentialContacts = uniquePotentialContacts.map(contact => ({
            id: contact.id,
            name: contact.name || 'Unknown User',
            email: contact.email || '',
            avatar: contact.image,
            role: contact.role === 'teacher' ? 'Teacher' : 'Student',
            lastMessage: null,
            lastMessageTime: null,
            unreadCount: 0,
            isOnline: false
        }));

        return NextResponse.json({
            conversations: formattedConversations,
            potentialContacts: formattedPotentialContacts
        });

    } catch (error) {
        console.error("[CONVERSATIONS_GET]", error instanceof Error ? error.message : 'Unknown error');
        return new NextResponse("Failed to fetch conversations", { status: 500 });
    }
}
