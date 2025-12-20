import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';

    // Prepare filter object for Prisma
    const whereClause: any = {
      status: 'active' // Only show active courses
    };

    // Add search query if provided
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ];
    }

    // Add category filter if provided
    if (category) {
      whereClause.category = { equals: category, mode: 'insensitive' };
    }

    // Get courses with related data using Prisma
    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        teacher: {
          select: {
            name: true,
            image: true
          }
        },
        enrollments: {
          select: {
            id: true
          }
        },
        lessons: {
          select: {
            id: true
          }
        }
      }
    });

    // Transform data to match expected format
    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      category: course.category,
      price: course.price,
      status: course.status,
      teacher: {
        name: course.teacher?.name || 'Unknown Teacher',
        image: course.teacher?.image || null
      },
      _count: {
        enrollments: course.enrollments.length,
        lessons: course.lessons.length
      }
    }));

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error('Error in available courses API:', error);
    return NextResponse.json(
      { message: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
} 