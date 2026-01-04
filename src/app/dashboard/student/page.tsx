'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    BookOpen,
    Brain,
    TrendingUp,
    Users,
    Star,
    Clock,
    CheckCircle,
    Play,
    GraduationCap,
    Loader2,
    ExternalLink
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIChat } from '@/components/ai/AIChat';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { toast } from 'sonner';
import Image from 'next/image';
import clsx from 'clsx';
import { useLanguage } from '@/contexts/LanguageContext';

// Types for enrolled courses
interface EnrolledCourse {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    category: string;
    price: number;
    status: string;
    enrolledAt: string;
    enrollmentId: string;
    teacher: {
        id?: string;
        name: string;
        image?: string | null;
    };
    _count: {
        enrollments: number;
        lessons: number;
    };
    totalLessons: number;
    completedLessons: number;
    progress: number;
}

// Color palette for courses
const courseColors = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

// Mock data for performance chart
const performanceData = [
    { name: 'Week 1', score: 65, hours: 12 },
    { name: 'Week 2', score: 72, hours: 15 },
    { name: 'Week 3', score: 68, hours: 10 },
    { name: 'Week 4', score: 85, hours: 18 },
    { name: 'Week 5', score: 78, hours: 14 },
    { name: 'Week 6', score: 92, hours: 20 },
];

// Mock data for subject distribution (will be replaced with real data)
const subjectData = [
    { name: 'Mathematics', value: 35, color: '#3B82F6' },
    { name: 'Physics', value: 25, color: '#EC4899' },
    { name: 'Computer Science', value: 25, color: '#10B981' },
    { name: 'Others', value: 15, color: '#F59E0B' },
];

// Mock recommended tutors
const recommendedTutors = [
    {
        id: 1,
        name: 'Dr. Sarah Wilson',
        expertise: 'Mathematics & Statistics',
        rating: 4.9,
        students: 234,
        image: null,
        matchScore: 98,
    },
    {
        id: 2,
        name: 'Prof. Michael Chen',
        expertise: 'Machine Learning & AI',
        rating: 4.8,
        students: 189,
        image: null,
        matchScore: 95,
    },
    {
        id: 3,
        name: 'Dr. Emily Brown',
        expertise: 'Quantum Physics',
        rating: 4.7,
        students: 156,
        image: null,
        matchScore: 92,
    },
];

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

export default function StudentDashboard() {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const router = useRouter();
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch enrolled courses
    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                setIsLoading(true);
                setError('');

                const response = await fetch('/api/enrollments');

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || 'Failed to fetch enrolled courses');
                }

                const data = await response.json();
                setEnrolledCourses(data);
            } catch (err) {
                console.error('Error fetching enrolled courses:', err);
                setError(err instanceof Error ? err.message : t('student.courses.error'));
                toast.error(t('student.courses.error'));
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user) {
            fetchEnrolledCourses();
        }
    }, [session]);

    // Calculate stats from enrolled courses
    const stats = {
        coursesEnrolled: enrolledCourses.length,
        totalLessons: enrolledCourses.reduce((acc, course) => acc + course._count.lessons, 0),
        completedLessons: enrolledCourses.reduce((acc, course) => acc + course.completedLessons, 0),
        avgProgress: enrolledCourses.length > 0
            ? Math.round(enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCourses.length)
            : 0
    };

    const handleWatchCourse = (courseId: string) => {
        router.push(`/dashboard/courses/${courseId}/content`);
    };

    const handleExploreCourses = () => {
        router.push('/dashboard/courses');
    };

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
                    {t('student.dashboard.title')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {t('student.dashboard.subtitle')}
                </p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {[
                    { label: t('student.stats.enrolled'), value: stats.coursesEnrolled.toString(), icon: BookOpen, change: t('student.stats.activeCourses') },
                    { label: t('student.stats.totalLessons'), value: stats.totalLessons.toString(), icon: GraduationCap, change: t('student.stats.availableToWatch') },
                    { label: t('student.stats.completed'), value: stats.completedLessons.toString(), icon: CheckCircle, change: `${stats.totalLessons - stats.completedLessons} ${t('student.stats.remaining')}` },
                    { label: t('student.stats.avgProgress'), value: `${stats.avgProgress}%`, icon: TrendingUp, change: t('student.stats.overallCompletion') },
                ].map((stat, index) => (
                    <motion.div key={index} variants={item}>
                        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change}</p>
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
                {/* My Enrolled Courses Section */}
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
                                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('student.courses.title')}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('student.courses.subtitle')}</p>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={handleExploreCourses}
                                className="text-sm"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                {t('student.courses.exploreMore')}
                            </Button>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">{t('student.courses.loading')}</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="text-center py-12">
                                <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                                <Button onClick={() => window.location.reload()}>{t('student.courses.tryAgain')}</Button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && !error && enrolledCourses.length === 0 && (
                            <div className="text-center py-12">
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
                                    {t('student.courses.noCourses')}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    {t('student.courses.startLearning')}
                                </p>
                                <Button onClick={handleExploreCourses}>
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    {t('student.courses.browse')}
                                </Button>
                            </div>
                        )}

                        {/* Courses List */}
                        {!isLoading && !error && enrolledCourses.length > 0 && (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {enrolledCourses.map((course, index) => (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all cursor-pointer group"
                                            onClick={() => handleWatchCourse(course.id)}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Course Image/Icon */}
                                                <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                    {course.imageUrl ? (
                                                        <Image
                                                            src={course.imageUrl}
                                                            alt={course.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-full h-full flex items-center justify-center"
                                                            style={{ backgroundColor: `${courseColors[index % courseColors.length]}20` }}
                                                        >
                                                            <GraduationCap
                                                                className="w-8 h-8"
                                                                style={{ color: courseColors[index % courseColors.length] }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Course Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                            {course.title}
                                                        </h3>
                                                        <Button
                                                            size="sm"
                                                            className="ml-2 flex-shrink-0 bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleWatchCourse(course.id);
                                                            }}
                                                        >
                                                            <Play className="w-4 h-4 mr-1" />
                                                            {t('student.courses.watch')}
                                                        </Button>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {course.teacher.name}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <BookOpen className="w-3 h-3" />
                                                            {course._count.lessons} {t('student.courses.lessons')}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs">
                                                            {course.category}
                                                        </span>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${course.progress}%` }}
                                                            transition={{ duration: 1, delay: 0.5 }}
                                                            className="absolute h-full rounded-full bg-gradient-to-r"
                                                            style={{
                                                                background: `linear-gradient(to right, ${courseColors[index % courseColors.length]}, ${courseColors[index % courseColors.length]}88)`
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {course.completedLessons}/{course._count.lessons} {t('student.courses.lessons')} • {course.progress}% {t('student.courses.complete')}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* AI Study Assistant */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-0 h-[500px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                        <AIChat
                            embedded
                            title={t('student.aiStudyAssistant')}
                            placeholder={t('student.ai.placeholder')}
                        />
                    </Card>
                </motion.div>
            </div>

            {/* Performance Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Performance Chart */}
                <Card className="lg:col-span-2 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('student.performance.title')}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('student.performance.subtitle')}</p>
                        </div>
                    </div>

                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                                <YAxis stroke="#6B7280" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#fff'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="hours"
                                    stroke="#EC4899"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorHours)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Subject Distribution */}
                <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('student.focus.title')}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('student.focus.subtitle')}</p>
                        </div>
                    </div>

                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={subjectData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    dataKey="value"
                                    paddingAngle={5}
                                >
                                    {subjectData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#fff'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-2 mt-4">
                        {subjectData.map((subject) => (
                            <div key={subject.name} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: subject.color }}
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">{subject.name}</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{subject.value}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* Recommended Tutors */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('student.tutors.title')}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('student.tutors.subtitle')}</p>
                            </div>
                        </div>
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            {t('student.tutors.viewAll')}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recommendedTutors.map((tutor) => (
                            <div
                                key={tutor.id}
                                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center text-white font-bold">
                                        {tutor.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium">
                                        {tutor.matchScore}% {t('student.tutors.match')}
                                    </div>
                                </div>

                                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {tutor.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{tutor.expertise}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{tutor.rating}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{tutor.students} {t('student.tutors.students')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
