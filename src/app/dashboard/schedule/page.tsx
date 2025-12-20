'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, Users, CheckCircle2, XCircle } from "lucide-react";
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfToday } from 'date-fns';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CustomSession extends Omit<Session, 'user'> {
  user: {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface TutoringSession {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  student: {
    id: string;
    name: string;
    email: string;
  };
  course?: {
    title: string;
    id: string;
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

const SchedulePage = () => {
  const { data: session } = useSession() as { data: CustomSession | null };
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [updatingSessionId, setUpdatingSessionId] = useState<string | null>(null);
  const router = useRouter();
  const [calendarView] = useState<"day" | "week" | "month">("week");
  const [date, setDate] = useState<Date>(startOfToday());

  const isTeacher = session?.user?.role === 'teacher';

  const getDateRange = useCallback(() => {
    switch (calendarView) {
      case 'month':
        return {
          start: startOfMonth(date),
          end: endOfMonth(date)
        };
      case 'week':
        return {
          start: startOfWeek(date),
          end: endOfWeek(date)
        };
      case 'day':
        return {
          start: date,
          end: date
        };
    }
  }, [calendarView, date]);

  const fetchSessions = useCallback(async () => {
    try {
      const { start, end } = getDateRange();
      
      console.log('Fetching sessions for date range:', {
        startDate: start.toISOString(),
        endDate: end.toISOString()
      });

      const response = await fetch(
        `/api/sessions?startDate=${start.toISOString()}&endDate=${end.toISOString()}`,
        { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const responseText = await response.text();
      console.log('Sessions API Response:', response.status, responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse sessions response:', e);
        throw new Error('Invalid response from server');
      }

      console.log('Fetched sessions:', data);
      
      // Validate session data before setting
      const validatedSessions = data.filter((session: TutoringSession) => {
        // For teachers, check student info; for students, check teacher info
        const isValid = session && 
          session.id && 
          session.title && 
          session.startTime && 
          session.endTime && 
          session.status &&
          ((isTeacher && session.student?.name) || (!isTeacher && session.teacher?.name));

        if (!isValid) {
          console.warn('Invalid session data:', session);
        }

        return isValid;
      });

      if (validatedSessions.length < data.length) {
        console.warn(`Filtered out ${data.length - validatedSessions.length} invalid sessions`);
      }

      setSessions(validatedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load sessions');
    }
  }, [getDateRange, isTeacher]);

  useEffect(() => {
    if (session?.user) {
      fetchSessions();
    }
  }, [fetchSessions, session]);

  const todaySessions = sessions.filter(session => 
    isSameDay(parseISO(session.startTime), date)
  );

  const getLocalDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset);
  };

  const renderSessionCard = (session: TutoringSession) => {
    const teacherName = session.teacher?.name || 'Unknown Teacher';
    const studentName = session.student?.name || 'Unknown Student';
    const courseTitle = session.course?.title;
    const startTime = getLocalDateTime(session.startTime);
    const endTime = getLocalDateTime(session.endTime);

    return (
      <div key={session.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900">
              <Users className="h-5 w-5 text-pink-600 dark:text-pink-300" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{session.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                with {isTeacher ? studentName : teacherName}
              </p>
              {courseTitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">Course: {courseTitle}</p>
              )}
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            session.status === 'completed' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
            session.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' :
            session.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' :
            session.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400' :
            'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
          }`}>
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            <span>{format(startTime, 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}</span>
          </div>
        </div>

        {session.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{session.description}</p>
        )}

        {/* Action buttons */}
        {session.status === 'accepted' && isTeacher && (
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSessionStatusChange(session.id, 'completed')}
              className="h-8 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={updatingSessionId === session.id}
            >
              {updatingSessionId === session.id ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-600 border-t-transparent mr-1.5"></div>
                  Updating...
                </div>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  Mark as Completed
                </>
              )}
            </Button>
          </div>
        )}

        {session.status === 'pending' && !isTeacher && (
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSessionStatusChange(session.id, 'cancelled')}
              className="h-8 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={updatingSessionId === session.id}
            >
              {updatingSessionId === session.id ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-600 border-t-transparent mr-1.5"></div>
                  Updating...
                </div>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Cancel Request
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderCalendarContent = () => {
        return (
          <div className="space-y-4">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Calendar
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  View and manage your schedule
                </CardDescription>
            </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Calendar Section */}
              <div className="flex-1">
            <Calendar
              mode="single"
              selected={date}
                  onSelect={(newDate: Date | undefined) => {
                    if (newDate) {
                      setDate(newDate);
                    }
                  }}
                  className="rounded-md border-0 shadow-sm bg-white p-4"
                  modifiers={{
                    hasSession: sessions.map(session => parseISO(session.startTime)),
                  }}
              modifiersStyles={{
                    hasSession: {
                      backgroundColor: 'rgba(236, 72, 153, 0.1)',
                      borderRadius: '50%',
                      color: '#ec4899',
                      fontWeight: 'bold'
                }
              }}
              components={{
                    DayContent: ({ date }) => {
                      const hasSessionsToday = sessions.some(session =>
                        isSameDay(parseISO(session.startTime), date)
                      );
                  return (
                        <div className={cn(
                          "w-full h-full flex items-center justify-center",
                          hasSessionsToday && "relative"
                        )}>
                          <span>{date.getDate()}</span>
                          {hasSessionsToday && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                              <div className="w-1 h-1 rounded-full bg-pink-500"></div>
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />
          </div>

              {/* Sessions List for Selected Date */}
              <div className="flex-1">
          <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Sessions for {format(date || new Date(), 'MMMM d, yyyy')}
                    </h3>
                    {!isTeacher && (
                      <Button 
                        variant="outline" 
                        className="bg-gradient-to-r from-pink-50 to-blue-50 dark:from-pink-900/50 dark:to-blue-900/50 border-0 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 shadow-sm transition-all duration-200 hover:shadow-md gap-2"
                        onClick={() => router.push('/dashboard/schedule/teachers')}
                      >
                        <Users className="h-4 w-4" />
                        Browse Teachers
                      </Button>
                    )}
            </div>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {sessions.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 text-center"
                        >
                          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                            <CalendarDays className="h-10 w-10 text-gray-400 dark:text-gray-600 mb-4" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">No sessions scheduled</h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">You haven&apos;t scheduled any sessions yet. Browse available teachers to get started.</p>
                        </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          variants={container}
                          initial="hidden"
                          animate="show"
                          className="grid gap-4"
                        >
                          {sessions.map((session) => (
                            <motion.div
                          key={session.id}
                              variants={item}
                              className="group relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 backdrop-blur-sm transition-all hover:shadow-md dark:hover:shadow-2xl dark:hover:shadow-pink-900/10"
                            >
                              <div className="absolute right-5 top-4 flex items-center gap-2">
                                <span className={cn(
                                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                  session.status === 'completed' && "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400",
                                  session.status === 'cancelled' && "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
                                  session.status === 'rejected' && "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
                                  session.status === 'pending' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400",
                                  session.status === 'accepted' && "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                                )}>
                                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                </span>
                        </div>
                              <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/10 to-blue-500/10 dark:from-pink-500/20 dark:to-blue-500/20">
                                  <Users className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        </div>
                                <div className="flex-1 space-y-1">
                                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                    {session.title}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                      <CalendarDays className="h-4 w-4" />
                                      <span>{format(parseISO(session.startTime), 'MMMM d, yyyy')}</span>
                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>
                                        {format(parseISO(session.startTime), 'h:mm a')} - {format(parseISO(session.endTime), 'h:mm a')}
                                      </span>
                  </div>
            </div>
                                  {session.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                      {session.description}
                                    </p>
                                  )}
                                  {session.course?.title && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Course: {session.course.title}
                                    </p>
                                  )}
                                  {session.status === 'pending' && !isTeacher && (
                                    <div className="mt-4 flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSessionStatusChange(session.id, 'cancelled')}
                                        className="h-8 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                        disabled={updatingSessionId === session.id}
                                      >
                                        {updatingSessionId === session.id ? (
              <div className="flex items-center gap-1.5">
                                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            <span>Updating...</span>
              </div>
                                        ) : (
                                          <>
                                            <XCircle className="h-4 w-4 mr-1.5" />
                                            Cancel Request
                                          </>
                                        )}
                                      </Button>
              </div>
                                  )}
            </div>
                    </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                          </div>
                          </div>
                        </div>
                    </div>
          </CardContent>
        </Card>
                  </div>
                );
  };

  const handleSessionStatusChange = async (sessionId: string, newStatus: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled') => {
    try {
      setUpdatingSessionId(sessionId);
      
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update session');
      }

      // Update the local sessions state
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionId ? { ...session, status: newStatus } : session
        )
      );

      toast.success(`Session ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update session');
    } finally {
      setUpdatingSessionId(null);
    }
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {isTeacher && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 lg:grid-cols-[2fr_1fr]"
        >
          {/* Main Calendar Section */}
          <motion.div variants={item} className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-0">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <motion.h2 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent"
                    >
                      {format(date, 'MMMM yyyy')}
                    </motion.h2>
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-gray-500 dark:text-gray-400"
                  >
                    {sessions.filter(s => s.status === 'accepted').length} upcoming sessions this month
                  </motion.p>
                </div>
                <div className="p-6">
                  {renderCalendarContent()}
                </div>
              </CardContent>
            </Card>

            {/* Selected Day&apos;s Requests */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                      Requests for {format(date, 'MMMM d, yyyy')}
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Manage session requests for the selected day
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
                      <span className="text-sm text-gray-500">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500"></div>
                      <span className="text-sm text-gray-500">Accepted</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {todaySessions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <CalendarDays className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No requests for this day</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      {todaySessions
                        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                        .map(session => (
                          <motion.div
                            key={session.id}
                            variants={item}
                            className="p-4 rounded-lg bg-gradient-to-r from-pink-50/50 to-blue-50/50 dark:from-pink-900/10 dark:to-blue-900/10 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-200"
                          >
                            {renderSessionCard(session)}
                          </motion.div>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={item} className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Today&apos;s Schedule
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Your sessions for {format(new Date(), 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {todaySessions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No sessions scheduled for today</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      {todaySessions
                        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                        .map(session => (
                          <motion.div
                            key={session.id}
                            variants={item}
                            className="p-4 rounded-lg bg-gradient-to-r from-pink-50/50 to-blue-50/50 dark:from-pink-900/10 dark:to-blue-900/10 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-200"
                          >
                            {renderSessionCard(session)}
                          </motion.div>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {!isTeacher && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
            <Tabs key="schedule-tabs" defaultValue="calendar" className="w-full">
              <div className="flex flex-col items-center justify-center mb-8">
                <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-white p-1 text-muted-foreground shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <TabsTrigger 
                value="calendar" 
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-600 data-[state=active]:bg-gradient-to-r from-pink-50 to-blue-50 data-[state=active]:text-pink-700 dark:text-gray-300 dark:data-[state=active]:from-pink-500/10 dark:data-[state=active]:to-blue-500/10 dark:data-[state=active]:text-pink-400 data-[state=active]:shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Calendar View
              </TabsTrigger>
              <TabsTrigger 
                value="list"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-600 data-[state=active]:bg-gradient-to-r from-pink-50 to-blue-50 data-[state=active]:text-pink-700 dark:text-gray-300 dark:data-[state=active]:from-pink-500/10 dark:data-[state=active]:to-blue-500/10 dark:data-[state=active]:text-pink-400 data-[state=active]:shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                List View
              </TabsTrigger>
            </TabsList>
              </div>

              <TabsContent value="calendar" className="mt-6 space-y-4">
                <Card key="calendar-card" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                    Schedule a Session
                  </CardTitle>
                  <CardDescription>
                    Choose a date and time to schedule your session
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <div key={`calendar-content-${date.toISOString()}`}>
                  {renderCalendarContent()}
                    </div>
                </CardContent>
              </Card>
            </TabsContent>

              <TabsContent value="list" className="mt-6 space-y-4">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                    Your Sessions
                  </CardTitle>
                  <CardDescription>
                    View and manage your upcoming sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence>
                    {sessions.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-8"
                      >
                        <CalendarDays className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No sessions scheduled</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                      >
                          {sessions.map((session) => (
                          <motion.div
                            key={session.id}
                            variants={item}
                            className="p-4 rounded-lg bg-gradient-to-r from-pink-50/50 to-blue-50/50 dark:from-pink-900/10 dark:to-blue-900/10 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-200"
                          >
                              {renderSessionCard(session)}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </motion.div>
    </>
  );
}

export default SchedulePage; 