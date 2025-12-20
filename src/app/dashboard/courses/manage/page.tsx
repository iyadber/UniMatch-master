'use client';

import { useState, useEffect, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Search, Trash2, Edit2, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Course {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  price: number;
  status: 'active' | 'draft' | 'archived';
  _count: {
    enrollments: number;
  };
  createdAt: string;
  updatedAt: string;
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

export default function ManageCoursesPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await fetch(`/api/courses?query=${searchQuery}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Failed to fetch courses (${response.status})`);
        }
        
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('Fetch courses error:', err);
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
  }, [searchQuery]);

  const handleDelete = async (courseId: string) => {
    if (!courseId) {
      toast.error('Invalid course ID');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Course not found or already deleted');
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to delete course (${response.status})`);
      }

      setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
      setShowDeleteConfirm(null);
      toast.success('Course deleted successfully');
    } catch (err) {
      console.error('Delete course error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting the course';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (session?.user?.role !== 'teacher') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400">You don&apos;t have permission to access this page.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              Manage Courses
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Create and manage your courses
            </p>
          </div>
          <Link href="/dashboard/courses/create">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                <span>Create Course</span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
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
                {searchQuery ? "No courses found" : "Create your first course"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "We couldn't find any courses matching your search"
                  : "Get started by creating a new course"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-6"
            >
              {courses.map((course) => (
                <motion.div
                  key={course._id}
                  variants={item}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-start gap-6">
                    {course.imageUrl && (
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-200"
                      >
                        <Image
                          src={course.imageUrl}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200">
                            {course.title}
                          </h3>
                          <p className="mt-2 text-gray-600 dark:text-gray-400">
                            {course.description}
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                              <Users className="w-4 h-4" />
                              {course._count.enrollments} students
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                              <BookOpen className="w-4 h-4" />
                              {course.category}
                            </span>
                            <span className="text-sm font-medium bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                              ${course.price}
                            </span>
                            <span className={cn(
                              "px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200",
                              course.status === 'active'
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : course.status === 'archived'
                                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            )}>
                              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/courses/${course._id}/edit`}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="ghost"
                                className="h-9 w-9 p-0 text-pink-600 hover:text-pink-700 dark:text-pink-500 dark:hover:text-pink-400"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          </Link>
                          <Link href={`/dashboard/courses/${course._id}/content`}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="ghost"
                                className="h-9 w-9 p-0 text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
                              >
                                <BookOpen className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          </Link>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              className="h-9 w-9 p-0 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                              onClick={() => setShowDeleteConfirm(course._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Delete Course
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete this course? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(null)}
                    className="border-gray-200 dark:border-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 