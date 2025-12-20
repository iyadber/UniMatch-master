import { Suspense } from 'react';
import EditCourseForm from './EditCourseForm';

interface PageProps {
  params: Promise<{ courseId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditCoursePage({ params }: PageProps) {
  const { courseId } = await params;
  
  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading...</h2>
      </div>
    }>
      <EditCourseForm courseId={courseId} />
    </Suspense>
  );
} 