'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, AlertCircle, CalendarClock, Clock, User, Book, Users } from "lucide-react";
import { format, parseISO, addHours } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface NewSession {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  teacherId: string;
}

interface TeacherSchedule {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface TeacherResponse {
  id: string;
  name: string;
  email: string;
  subjects?: string[];
  bio?: string;
}

// Local Textarea component
const Textarea = ({ 
  className, 
  label, 
  error, 
  ...props 
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { 
  label?: string; 
  error?: string; 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
          htmlFor={props.id}
        >
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default function RequestSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [teachers, setTeachers] = useState<{ id: string; name: string; }[]>([]);
  const [teacherSchedule, setTeacherSchedule] = useState<TeacherSchedule[]>([]);
  
  // Set a default start time (now rounded to the next hour) and end time (1 hour later)
  const defaultStartTime = new Date();
  // Add a full day to make sure it's in the future
  defaultStartTime.setDate(defaultStartTime.getDate() + 1);
  defaultStartTime.setMinutes(0);
  defaultStartTime.setSeconds(0);
  defaultStartTime.setMilliseconds(0);
  defaultStartTime.setHours(defaultStartTime.getHours());
  
  const defaultEndTime = new Date(defaultStartTime);
  defaultEndTime.setHours(defaultEndTime.getHours() + 1);
  
  const [newSession, setNewSession] = useState<NewSession>({
    title: '',
    description: '',
    startTime: defaultStartTime.toISOString().slice(0, 16),
    endTime: defaultEndTime.toISOString().slice(0, 16),
    teacherId: searchParams.get('teacherId') || '',
  });

  const fetchTeachers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users?role=teacher');
      if (!response.ok) throw new Error('Failed to fetch teachers');
      const data = await response.json();
      
      console.log('Received teacher data:', data);
      
      const validTeachers = data.filter((teacher: TeacherResponse) => 
        teacher && 
        teacher.id && 
        teacher.name
      ).map((teacher: TeacherResponse) => ({
        id: teacher.id,
        name: teacher.name
      }));

      if (validTeachers.length === 0) {
        throw new Error('No teachers available');
      }

      setTeachers(validTeachers);

      if (!newSession.teacherId && validTeachers.length > 0) {
        setNewSession(prev => ({ ...prev, teacherId: validTeachers[0].id }));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load teachers';
      console.error('Error fetching teachers:', errorMessage);
      toast.error(errorMessage);
      setFormErrors(prev => ({ ...prev, teacherId: 'Failed to load teachers' }));
    } finally {
      setIsLoading(false);
    }
  }, [newSession.teacherId]);

  useEffect(() => {
    if (session?.user) {
      fetchTeachers();
    }
  }, [session, fetchTeachers]);

  useEffect(() => {
    if (session?.user && newSession.teacherId) {
      fetchTeacherSchedule(newSession.teacherId);
    }
  }, [newSession.teacherId, session]);

  if (session?.user?.role !== 'student') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400">You don&apos;t have permission to access this page.</p>
      </div>
    );
  }

  const fetchTeacherSchedule = async (teacherId: string) => {
    try {
      // Use a custom endpoint to fetch teacher's schedule with multiple status values
      const response = await fetch(`/api/teachers/${teacherId}/schedule`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch teacher schedule');
      }
      
      const data = await response.json();
      console.log('Teacher schedule data:', data);
      
      // Transform the data if needed to match the TeacherSchedule interface
      const scheduledSessions = data.map((session: {
        id: string;
        startTime: string;
        endTime: string;
        status: string;
      }) => ({
        id: session.id,
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.status
      }));
      
      setTeacherSchedule(scheduledSessions);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch teacher schedule';
      console.error('Error fetching teacher schedule:', errorMessage);
      setError(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormErrors({});
    
    // Form validation
    const errors: Record<string, string> = {};
    if (!newSession.title) errors.title = 'Title is required';
    if (!newSession.startTime) errors.startTime = 'Start time is required';
    if (!newSession.endTime) errors.endTime = 'End time is required';
    if (!newSession.teacherId) errors.teacherId = 'Please select a teacher';
    
    // Validate that start time is before end time
    if (new Date(newSession.startTime) >= new Date(newSession.endTime)) {
      errors.startTime = 'Start time must be before end time';
    }
    
    // Validate that the session is not in the past
    if (new Date(newSession.startTime) < new Date()) {
      errors.startTime = 'Cannot schedule sessions in the past';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Ensure dates are in ISO format with timezone info
      const startTimeDate = new Date(newSession.startTime);
      const endTimeDate = new Date(newSession.endTime);
      
      // Create a session object with proper timezone dates
      const sessionToCreate = {
        title: newSession.title,
        description: newSession.description || "",
        startTime: startTimeDate.toISOString(),
        endTime: endTimeDate.toISOString(),
        teacherId: newSession.teacherId
      };

      console.log("Submitting session:", sessionToCreate);
      
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionToCreate),
      });

      // Get the response as text first
      const responseText = await response.text();
      console.log("Server raw response:", responseText);
      
      // Then try to parse it as JSON if possible
      let data = null;
      try {
        if (responseText) {
          data = JSON.parse(responseText);
        }
      } catch (e) {
        console.error("Failed to parse server response as JSON:", e);
      }

      if (!response.ok) {
        // Use the parsed JSON data if available, otherwise use text or a fallback message
        let errorMessage = 'Failed to schedule session';
        
        if (data?.error) {
          errorMessage = data.error;
          
          // Handle specific error cases
          if (data.error === 'Time slot conflicts with an existing session' && data.conflictingSession) {
            const conflictStart = new Date(data.conflictingSession.startTime);
            const conflictEnd = new Date(data.conflictingSession.endTime);
            errorMessage = `This time conflicts with an existing session (${format(conflictStart, 'MMM d, h:mm a')} - ${format(conflictEnd, 'h:mm a')})`;
          }
          else if (data.error === 'Database error creating session' && data.details) {
            errorMessage = `Database error: ${data.details}`;
          }
          else if (data.error === 'Cannot schedule sessions in the past' && data.details) {
            errorMessage = `Cannot schedule in the past. Server time: ${new Date(data.details.serverTime).toLocaleString()}`;
          }
        } else if (responseText) {
          try {
            // Try to make the text more readable
            errorMessage = responseText.substring(0, 200);
          } catch {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        }
        
        console.error('Server error response:', {
          status: response.status,
          statusText: response.statusText,
          data,
          text: responseText
        });
        throw new Error(errorMessage);
      }

      toast.success('Session scheduled successfully');
      router.push('/dashboard/schedule');
    } catch (err) {
      console.error('Error scheduling session:', err instanceof Error ? err.message : 'Unknown error');
      setError(err instanceof Error ? err.message : 'Failed to schedule session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-6"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="h-10 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Schedule a Tutoring Session</h1>
          </div>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-blue-50 dark:from-pink-900/20 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                Session Details
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Fill in the details below to request a tutoring session
              </CardDescription>
            </CardHeader>
            
            {isLoading ? (
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading teacher information...</p>
                </div>
              </CardContent>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Input
                        icon={<Book className="h-4 w-4 text-gray-500" />}
                        label="Session Title"
                        placeholder="E.g., Math Tutoring, English Help, etc."
                        value={newSession.title}
                        onChange={(e) => {
                          setNewSession({ ...newSession, title: e.target.value });
                          setFormErrors({ ...formErrors, title: '' });
                        }}
                        error={formErrors.title}
                      />
                    </div>

                    <div>
                      <Textarea
                        placeholder="Describe what you'd like to focus on during this session (optional)"
                        value={newSession.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewSession({ ...newSession, description: e.target.value })}
                        className="min-h-[100px] resize-none"
                        label="Session Description"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        Select Teacher
                      </label>
                      <Select
                        value={newSession.teacherId}
                        onValueChange={(value) => {
                          setNewSession({ ...newSession, teacherId: value });
                          setFormErrors({ ...formErrors, teacherId: '' });
                        }}
                      >
                        <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 focus:ring-pink-500 focus:border-pink-500">
                          <SelectValue placeholder="Select Teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.teacherId && (
                        <p className="text-sm text-red-500">{formErrors.teacherId}</p>
                      )}
                    </div>

                    {teacherSchedule.length > 0 && (
                      <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border border-yellow-200 dark:border-yellow-900/50 p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-yellow-100 dark:bg-yellow-800 rounded-full p-2 mt-0.5">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-400">Teacher&apos;s Existing Schedule</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1 mb-3">
                              Please avoid scheduling during these times
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {teacherSchedule.map((session, index) => (
                                <div 
                                  key={index} 
                                  className="text-sm flex items-center gap-2 bg-white dark:bg-gray-800 rounded-md p-2 border border-yellow-200 dark:border-yellow-800"
                                >
                                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                                  <span className="text-yellow-700 dark:text-yellow-300">
                                    {format(parseISO(session.startTime), 'MMM d, h:mm a')} - {format(parseISO(session.endTime), 'h:mm a')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="datetime-local"
                          label="Start Time"
                          icon={<Clock className="h-4 w-4 text-gray-500" />}
                          value={newSession.startTime}
                          onChange={(e) => {
                            const startTime = e.target.value;
                            setNewSession({ 
                              ...newSession, 
                              startTime,
                              // Automatically set end time to 1 hour after the start time
                              endTime: startTime ? 
                                format(addHours(new Date(startTime), 1), "yyyy-MM-dd'T'HH:mm") : 
                                newSession.endTime
                            });
                            setFormErrors({ ...formErrors, startTime: '' });
                          }}
                          error={formErrors.startTime}
                          className="bg-white dark:bg-gray-800"
                        />
                      </div>

                      <div>
                        <Input
                          type="datetime-local"
                          label="End Time"
                          icon={<Clock className="h-4 w-4 text-gray-500" />}
                          value={newSession.endTime}
                          onChange={(e) => {
                            setNewSession({ ...newSession, endTime: e.target.value });
                            setFormErrors({ ...formErrors, endTime: '' });
                          }}
                          error={formErrors.endTime}
                          className="bg-white dark:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200" 
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Scheduling Session...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Users className="h-5 w-5" />
                        <span>Request Tutoring Session</span>
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
} 