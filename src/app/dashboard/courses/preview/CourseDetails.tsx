'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Users, PlayCircle, Tag, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Lesson {
  id: string;
  title: string;
  url: string;
  description: string;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  teacher: {
    id: string;
    name: string;
    image: string | null;
  };
  _count: {
    enrollments: number;
    lessons: number;
  };
  lessons: Lesson[];
}

interface Props {
  course: Course;
}

export default function CourseDetails({ course }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<Lesson | null>(
    course.lessons.length > 0 ? course.lessons[0] : null
  );
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/courses/${course.id}`));
      return;
    }

    setIsEnrolling(true);
    
    try {
      const response = await fetch(`/api/courses/${course.id}/enroll`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to enroll');
      }
      
      toast.success('Successfully enrolled in course!');
      router.push(`/dashboard/courses/my/${course.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to enroll');
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 pt-4">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/dashboard/courses">
          <Button variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
        <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 bg-gradient-to-r from-blue-600 to-purple-600">
          {course.imageUrl && (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              style={{ objectFit: 'cover' }}
              className="mix-blend-overlay opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                {course.category}
              </span>
              <div className="flex items-center text-sm">
                <BookOpen className="w-4 h-4 mr-1" />
                {course._count.lessons} lessons
              </div>
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-1" />
                {course._count.enrollments} students
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              {course.title}
            </h1>
            <div className="flex items-center">
              {course.teacher.image ? (
                <Image
                  src={course.teacher.image}
                  alt={course.teacher.name}
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                  <span className="text-sm text-white font-medium">
                    {course.teacher.name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <span>Instructor: {course.teacher.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Video Preview Section */}
        <div className="lg:col-span-2 space-y-6">
          {selectedVideo ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="aspect-video bg-gray-900 relative">
                {selectedVideo.url ? (
                  <iframe
                    src={selectedVideo.url}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>Video not available</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {selectedVideo.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {selectedVideo.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <PlayCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No video preview available
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                This course doesn't have any preview videos available yet.
              </p>
            </div>
          )}

          {/* Course Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                About this course
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {course.description}
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  What you'll learn
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {i === 0 ? 'Learn all fundamentals' : 
                         i === 1 ? 'Apply practical skills' : 
                         i === 2 ? 'Complete real projects' : 
                         'Get certified expertise'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details Sidebar */}
        <div className="space-y-6">
          {/* Enrollment Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
                </p>
                <div className="flex items-center space-x-1 text-sm">
                  <Tag className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {course.category}
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full mb-4"
                disabled={isEnrolling}
                onClick={handleEnroll}
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </Button>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Access on mobile and desktop</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Course Content List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Course Content
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {course._count.lessons} lessons • {Math.ceil(course._count.lessons * 0.75)} hours total
              </p>
              
              <ul className="space-y-2">
                {course.lessons.map((lesson) => (
                  <motion.li
                    key={lesson.id}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedVideo?.id === lesson.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/30 border border-transparent'
                    }`}
                    onClick={() => setSelectedVideo(lesson)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedVideo?.id === lesson.id
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}>
                          <PlayCircle className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className={`font-medium truncate ${
                            selectedVideo?.id === lesson.id
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {lesson.title}
                          </h4>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${
                        selectedVideo?.id === lesson.id
                          ? 'text-blue-500 dark:text-blue-400'
                          : 'text-gray-400'
                      }`} />
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 