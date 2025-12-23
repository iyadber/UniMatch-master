import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Types for the tutor response
interface Tutor {
    id: string;
    name: string;
    title: string;
    university: string;
    expertise: string[];
    rating: number;
    reviews: number;
    students: number;
    hourlyRate: number;
    availability: string;
    matchScore: number;
    bio: string;
    languages: string[];
    responseTime: string;
    email?: string;
    role?: string;
}

// Extended User type from database that may have additional fields
interface DatabaseUser {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    image: string | null;
    // Optional extended fields that might be stored in MongoDB
    title?: string;
    university?: string;
    expertise?: string[];
    bio?: string;
    hourlyRate?: number;
    languages?: string[];
    availability?: string;
}

// Default values for tutors without complete profiles
const DEFAULT_TITLES = [
    'PhD Researcher',
    'PhD Candidate',
    'Doctoral Student',
    'Research Fellow',
];

const DEFAULT_UNIVERSITIES = [
    'University',
    'Research Institute',
];

const DEFAULT_EXPERTISE = [
    'General Tutoring',
    'Academic Support',
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('search')?.toLowerCase() || '';
        const subject = searchParams.get('subject') || 'All Subjects';

        console.log('[TUTORS_GET] Fetching teachers from database...');
        console.log('[TUTORS_GET] Query:', query, 'Subject:', subject);

        // Fetch all users with role 'teacher' from the database
        const teachers = await prisma.user.findMany({
            where: {
                role: 'teacher'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
            }
        });

        console.log('[TUTORS_GET] Found', teachers.length, 'teachers in database');

        // Transform database users to Tutor format
        let tutors: Tutor[] = teachers.map((teacher, index) => {
            // Cast to extended type to access potential MongoDB fields
            const extendedTeacher = teacher as unknown as DatabaseUser;

            return {
                id: teacher.id,
                name: teacher.name || 'Anonymous Tutor',
                email: teacher.email || undefined,
                role: teacher.role,
                // Use extended fields if available, otherwise use defaults
                title: extendedTeacher.title || DEFAULT_TITLES[index % DEFAULT_TITLES.length],
                university: extendedTeacher.university || DEFAULT_UNIVERSITIES[index % DEFAULT_UNIVERSITIES.length],
                expertise: extendedTeacher.expertise || DEFAULT_EXPERTISE,
                bio: extendedTeacher.bio || `Experienced educator dedicated to helping students succeed in their academic journey.`,
                hourlyRate: extendedTeacher.hourlyRate || 50 + (index * 5) % 50, // Default range 50-100
                languages: extendedTeacher.languages || ['English'],
                availability: extendedTeacher.availability || 'Available',
                // Default stat values - these could be computed from actual data in the future
                rating: 4.5 + (Math.random() * 0.5), // Random between 4.5-5.0
                reviews: Math.floor(Math.random() * 200) + 50, // Random between 50-250
                students: Math.floor(Math.random() * 500) + 100, // Random between 100-600
                matchScore: 0,
                responseTime: '< 2 hours',
            };
        });

        // Apply subject filter
        if (subject !== 'All Subjects') {
            tutors = tutors.filter(tutor =>
                tutor.expertise.some(e => e.toLowerCase().includes(subject.toLowerCase())) ||
                tutor.title.toLowerCase().includes(subject.toLowerCase())
            );
        }

        // Apply search query filter
        if (query) {
            tutors = tutors.filter(tutor =>
                tutor.name.toLowerCase().includes(query) ||
                tutor.expertise.some(e => e.toLowerCase().includes(query)) ||
                tutor.university.toLowerCase().includes(query) ||
                tutor.bio.toLowerCase().includes(query)
            );
        }

        console.log('[TUTORS_GET] Returning', tutors.length, 'tutors after filtering');

        return NextResponse.json({
            success: true,
            data: tutors
        });
    } catch (error) {
        console.error('[TUTORS_GET] Error fetching tutors:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tutors' },
            { status: 500 }
        );
    }
}
