'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Users, GraduationCap, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  price: number;
  status: 'active' | 'draft' | 'archived';
  teacher: {
    name: string;
    image?: string;
  };
  _count: {
    enrollments: number;
    lessons: number;
  };
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const categories = [
  'All',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Engineering',
  'Literature',
  'History',
  'Economics'
];

export default function CoursesPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const url = `/api/courses/available?query=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory !== 'All' ? selectedCategory : '')}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          let errorMessage = `Failed to fetch courses (${response.status})`;
          try {
            const errorData = await response.json();
            if (errorData?.message) {
              errorMessage = errorData.message;
            }
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: expected an array of courses');
        }
        
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching courses');
        toast.error(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory]);

  const handleEnroll = async (courseId: string) => {
    if (!session?.user) {
      toast.error('Please sign in to enroll in courses');
      return;
    }

    setEnrollingCourseId(courseId);

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to enroll in course');
      }

      toast.success('Successfully enrolled in course');
    } catch (err) {
      console.error('Enrollment error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to enroll in course');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Explore Courses
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Discover a wide range of courses taught by expert instructors. 
            Enhance your knowledge and skills with our comprehensive learning materials.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="grid gap-6 md:grid-cols-[240px,1fr]">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Categories
              </h3>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-1">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        selectedCategory === category
                          ? "bg-gradient-to-r from-pink-600 to-blue-600 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                label="Search courses"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 backdrop-blur-lg"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Loading courses...</p>
                </motion.div>
              ) : courses.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <BookOpen className="w-16 h-16 mb-4 text-pink-600 dark:text-pink-400 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery
                      ? "We couldn't find any courses matching your search"
                      : "No courses are available in this category yet"}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {courses.map((course) => (
                    <motion.div
                      key={course.id}
                      variants={item}
                      className="group"
                    >
                      <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200">
                        <div className="relative h-48">
                          {course.imageUrl ? (
                            <Image
                              src={course.imageUrl}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-blue-100 dark:from-pink-900/30 dark:to-blue-900/30 flex items-center justify-center">
                              <GraduationCap className="w-12 h-12 text-pink-600 dark:text-pink-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-lg font-semibold text-white truncate">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {course._count.enrollments} students
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {course._count.lessons} lessons
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {course.teacher.image ? (
                                <Image
                                  src={course.teacher.image}
                                  alt={course.teacher.name}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-100 to-blue-100 dark:from-pink-900/30 dark:to-blue-900/30 flex items-center justify-center">
                                  <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
                                    {(course.teacher.name || 'Unknown').charAt(0)}
                                  </span>
                                </div>
                              )}
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {course.teacher.name}
                              </span>
                            </div>
                            <div className="flex-1 text-right">
                              <span className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                                ${course.price}
                              </span>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                              onClick={() => handleEnroll(course.id)}
                              disabled={enrollingCourseId === course.id}
                              className="w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              {enrollingCourseId === course.id ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Enrolling...
                                </>
                              ) : (
                                <>
                                  Enroll Now
                                  <ChevronRight className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 