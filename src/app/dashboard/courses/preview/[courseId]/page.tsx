import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CourseDetails from '@/app/dashboard/courses/preview/CourseDetails';

interface Props {
  params: Promise<{
    courseId: string;
  }>;
}

async function getCourseData(courseId: string) {
  try {
    // Only fetch active courses for public preview
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        status: 'active' // Only show active courses to the public
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        lessons: {
          orderBy: {
            order: 'asc'
          }
        },
        enrollments: {
          select: {
            id: true
          }
        }
      }
    });
    
    return course;
  } catch (error) {
    console.error('[GET_COURSE_PREVIEW]', error);
    return null;
  }
}

export default async function CoursePreviewPage({ params }: Props) {
  const courseId = (await params).courseId;
  const course = await getCourseData(courseId);

  if (!course) {
    notFound();
  }

  // Transform course data to match what the frontend expects
  const transformedCourse = {
    id: course.id,
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl || '',
    price: course.price,
    category: course.category,
    teacher: {
      id: course.teacher?.id || '',
      name: course.teacher?.name || 'Unknown Teacher',
      image: course.teacher?.image || null
    },
    _count: {
      enrollments: course.enrollments.length,
      lessons: course.lessons.length
    },
    lessons: course.lessons.map(lesson => {
      let videoUrl = '';
      let description = '';
      
      try {
        // Try to parse the content as JSON
        const parsedContent = JSON.parse(lesson.content);
        videoUrl = parsedContent.url || '';
        description = parsedContent.description || '';
      } catch (e) {
        // If parsing fails, assume content is just the URL
        videoUrl = lesson.content;
      }
      
      return {
        id: lesson.id,
        title: lesson.title,
        url: videoUrl,
        description: description,
        order: lesson.order
      };
    })
  };

  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading...</h2>
      </div>
    }>
      <CourseDetails course={transformedCourse} />
    </Suspense>
  );
} 