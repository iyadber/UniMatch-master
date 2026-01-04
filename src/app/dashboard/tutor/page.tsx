'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Users,
    Star,
    Clock,
    MessageSquare,
    CheckCircle,
    Video,
    BookOpen,
    Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { useLanguage } from '@/contexts/LanguageContext';

interface Booking {
    id: string;
    student: string;
    studentImage?: string;
    subject: string;
    date: string;
    time: string;
    duration: string;
    status: string;
    type: string;
}

interface TutorStats {
    activeStudents: number;
    totalEnrollments: number;
    sessionsCompleted: number;
    upcomingSessions: number;
    totalSessions: number;
    totalCourses: number;
}

interface CourseInfo {
    id: string;
    title: string;
    description: string;
    status: string;
    enrollmentCount: number;
    category: string;
    price: number;
}

interface TutorData {
    stats: TutorStats;
    upcomingBookings: Booking[];
    courses: CourseInfo[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function TutorDashboard() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TutorData | null>(null);

    useEffect(() => {
        async function fetchTutorData() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/tutor/stats');

                if (!response.ok) {
                    throw new Error('Failed to load tutor data');
                }

                const tutorData = await response.json();
                setData(tutorData);
            } catch (err) {
                console.error('Error fetching tutor data:', err);
                setError(err instanceof Error ? err.message : t('tutor.error'));
            } finally {
                setLoading(false);
            }
        }

        fetchTutorData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">{t('tutor.loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        {t('tutor.tryAgain')}
                    </Button>
                </div>
            </div>
        );
    }

    const stats = data?.stats;
    const upcomingBookings = data?.upcomingBookings || [];
    const courses = data?.courses || [];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                    {t('tutor.dashboard.title')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {t('tutor.dashboard.subtitle')}
                </p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
            >
                {[
                    { label: t('tutor.stats.activeStudents'), value: stats?.activeStudents || 0, icon: Users, change: `${stats?.totalEnrollments || 0} ${t('tutor.stats.totalEnrollments')}`, color: 'blue' },
                    { label: t('tutor.stats.sessionsCompleted'), value: stats?.sessionsCompleted || 0, icon: CheckCircle, change: `${stats?.totalSessions || 0} ${t('tutor.stats.totalSessions')}`, color: 'purple' },
                    { label: t('tutor.stats.upcomingSessions'), value: stats?.upcomingSessions || 0, icon: Calendar, change: t('tutor.stats.scheduled'), color: 'green' },
                    { label: t('tutor.stats.myCourses'), value: stats?.totalCourses || 0, icon: BookOpen, change: t('tutor.stats.activeCourses'), color: 'yellow' },
                ].map((stat, index) => (
                    <motion.div key={index} variants={item}>
                        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                                        {stat.value}
                                    </p>
                                    <p className={clsx(
                                        'text-xs mt-1',
                                        stat.color === 'green' && 'text-green-600 dark:text-green-400',
                                        stat.color === 'blue' && 'text-blue-600 dark:text-blue-400',
                                        stat.color === 'purple' && 'text-purple-600 dark:text-purple-400',
                                        stat.color === 'yellow' && 'text-yellow-600 dark:text-yellow-400',
                                    )}>{stat.change}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                    <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Bookings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('tutor.bookings.title')}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('tutor.bookings.subtitle')}</p>
                                </div>
                            </div>
                            <Button variant="secondary" className="text-sm">{t('tutor.bookings.viewCalendar')}</Button>
                        </div>

                        {upcomingBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">{t('tutor.bookings.noBookings')}</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                    {t('tutor.bookings.emptyDesc')}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center text-white font-bold">
                                                    {booking.student.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-white">{booking.student}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{booking.subject}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                                                    <Clock className="w-4 h-4" />
                                                    {booking.time} • {booking.duration}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{booking.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <span className={clsx(
                                                    'px-2 py-1 rounded-full text-xs font-medium',
                                                    booking.status === 'scheduled'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                        : booking.status === 'completed'
                                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                                )}>
                                                    {booking.status === 'scheduled' ? t('tutor.bookings.confirmed') : booking.status}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <Video className="w-3 h-3" /> {t('tutor.bookings.videoCall')}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                                                    <Video className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* My Courses Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('tutor.courses.title')}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('tutor.courses.subtitle')}</p>
                            </div>
                        </div>

                        {courses.length === 0 ? (
                            <div className="text-center py-8">
                                <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">{t('tutor.courses.noCourses')}</p>
                                <Button variant="secondary" className="mt-4 text-sm">
                                    {t('tutor.courses.create')}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {courses.slice(0, 5).map((course) => (
                                    <div
                                        key={course.id}
                                        className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50"
                                    >
                                        <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className={clsx(
                                                'px-2 py-0.5 rounded-full text-xs font-medium',
                                                course.status === 'active'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                            )}>
                                                {course.status}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {course.enrollmentCount} {course.enrollmentCount !== 1 ? t('tutor.courses.students') : t('tutor.courses.student')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {courses.length > 5 && (
                                    <Button variant="secondary" className="w-full text-sm">
                                        {t('tutor.courses.viewAll')} ({courses.length})
                                    </Button>
                                )}
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>

            {/* Rating Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('tutor.rating.title')}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('tutor.rating.subtitle')}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('tutor.rating.noRatings')}</p>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
