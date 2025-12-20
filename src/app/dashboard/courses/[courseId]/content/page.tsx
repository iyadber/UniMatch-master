import { Suspense } from 'react';
import CourseContent from './CourseContent';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{
    courseId: string;
  }>;
}

async function getCourseData(courseId: string) {
  try {
    console.log('Getting course data for ID:', courseId);
    if (!courseId) {
      console.log('No courseId provided');
      return null;
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('No session or user');
      return null;
    }

    console.log('Searching for course with Prisma, sessionUserId:', session.user.id);
    
    // Use Prisma to query the course with proper error handling
    try {
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          OR: [
            { teacherId: session.user.id },
            {
              enrollments: {
                some: {
                  studentId: session.user.id
                }
              }
            }
          ]
        },
        include: {
          teacher: true,
          lessons: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      });
      
      console.log('Course found?', !!course);
      if (course) {
        console.log('Course title:', course.title);
      }

    return course;
    } catch (prismaError) {
      console.error('Prisma error:', prismaError);
      
      // Try with a different approach if there's an issue with the ID format
      // This is a fallback in case there's an issue with the ID format
      try {
        const allCourses = await prisma.course.findMany({
          where: {
            OR: [
              { teacherId: session.user.id },
              {
                enrollments: {
                  some: {
                    studentId: session.user.id
                  }
                }
              }
            ]
          }
        });
        
        console.log('Found', allCourses.length, 'total courses for user');
        const matchingCourse = allCourses.find(c => c.id === courseId);
        
        if (matchingCourse) {
          console.log('Found matching course by alternate means:', matchingCourse.title);
          return matchingCourse;
        }
      } catch (fallbackError) {
        console.error('Fallback query failed:', fallbackError);
      }
      return null;
    }
  } catch (error) {
    console.error('[GET_COURSE_DATA]', error);
    return null;
  }
}

export default async function CourseContentPage({ params }: Props) {
  const courseId = (await params).courseId;
  console.log('Page component received courseId:', courseId);
  
  const course = await getCourseData(courseId);

  if (!course) {
    console.log('Course not found, returning 404');
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading...</h2>
      </div>
    }>
      <CourseContent courseId={courseId} />
    </Suspense>
  );
} 