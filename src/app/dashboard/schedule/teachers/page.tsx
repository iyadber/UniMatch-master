'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { toast } from 'sonner';

interface TeacherResponse {
  id: string;
  name: string;
  email: string;
  subjects?: string[];
  bio?: string;
  image?: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects?: string[];
  bio?: string;
}

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users?role=teacher');
      if (!response.ok) throw new Error('Failed to fetch teachers');
      const data = await response.json();
      
      console.log('Received teacher data:', data);
      
      // Validate teacher data and ensure we're using id
      const validTeachers = data.filter((teacher: TeacherResponse) => 
        teacher && 
        teacher.id && 
        teacher.name
      ).map((teacher: TeacherResponse) => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        subjects: teacher.subjects,
        bio: teacher.bio
      }));

      console.log('Processed teacher data:', validTeachers);
      
      // Don't throw an error when no teachers are available
      // Just set an empty array and let the UI handle this state
      setTeachers(validTeachers);
    } catch (err) {
      console.error('Error fetching teachers:', err instanceof Error ? err.message : 'Unknown error');
      toast.error(err instanceof Error ? err.message : 'Failed to load teachers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTeacher = (teacherId: string) => {
    router.push(`/dashboard/schedule/request?teacherId=${teacherId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-10 px-4 text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Select a Teacher</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-600 border-t-transparent"></div>
          </div>
        ) : teachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Teachers Available</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              There are currently no teachers available in the system. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <Card key={teacher.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900">
                      <Users className="h-5 w-5 text-pink-600 dark:text-pink-300" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 dark:text-white">{teacher.name}</CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        {teacher.email}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {teacher.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{teacher.bio}</p>
                  )}
                  {teacher.subjects && teacher.subjects.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subjects:</h4>
                      <div className="flex flex-wrap gap-2">
                        {teacher.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={() => handleSelectTeacher(teacher.id)}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white dark:bg-pink-500 dark:hover:bg-pink-600"
                  >
                    Schedule Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 