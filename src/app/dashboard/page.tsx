'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
    Clock,
    Users,
    GraduationCap,
    Star,
    Plus,
    Activity,
    MessageSquare,
    BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

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

export default function Dashboard() {
    const { data: session } = useSession();
    const { t, dir } = useLanguage();
    const isTeacher = session?.user?.role === 'teacher';

    const stats = [
        {
            name: t('dashboard.stats.totalSessions'),
            value: '24',
            icon: Clock,
            change: '+12%',
            changeType: 'positive',
        },
        {
            name: t('dashboard.stats.activeStudents'),
            value: '48',
            icon: Users,
            change: '+18%',
            changeType: 'positive',
        },
        {
            name: t('dashboard.stats.courses'),
            value: '12',
            icon: GraduationCap,
            change: '+3',
            changeType: 'positive',
        },
        {
            name: t('dashboard.stats.avgRating'),
            value: '4.8',
            icon: Star,
            change: '+0.2',
            changeType: 'positive',
        },
    ];

    const recentActivity = [
        {
            id: 1,
            type: 'session',
            title: 'Mathematics Session',
            time: '2 hours ago',
            description: 'Completed a session with Dr. Sarah Wilson',
            icon: Clock,
        },
        {
            id: 2,
            type: 'message',
            title: 'New Message',
            time: '4 hours ago',
            description: 'Prof. Michael Brown replied to your inquiry',
            icon: MessageSquare,
        },
        {
            id: 3,
            type: 'course',
            title: 'Course Enrollment',
            time: '1 day ago',
            description: 'Enrolled in Advanced Physics Course',
            icon: BookOpen,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                        {t('dashboard.title')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {t('home.subtitle')}
                    </p>
                </motion.div>
                {isTeacher && (
                    <motion.div
                        initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/dashboard/courses/create">
                            <Button className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                                <Plus className={dir === 'rtl' ? "w-4 h-4 ml-2" : "w-4 h-4 mr-2"} />
                                <span>{t('dashboard.createCourse')}</span>
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </div>

            {/* Quick Actions for Teachers */}
            {isTeacher && (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    <motion.div variants={item}>
                        <Link href="/dashboard/courses/manage">
                            <Card className="group hover:shadow-lg transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                                <div className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-100 to-blue-100 dark:from-pink-900/30 dark:to-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                            <GraduationCap className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200">
                                                {t('dashboard.manageCourses')}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {t('dashboard.manageCoursesDesc')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                    {/* Add more quick actions for teachers here */}
                </motion.div>
            )}

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
                {stats.map((stat) => (
                    <motion.div key={stat.name} variants={item}>
                        <Card className="group hover:shadow-lg transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                                        <p className="text-2xl font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-100 to-blue-100 dark:from-pink-900/30 dark:to-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                        <stat.icon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span
                                        className={`text-sm font-medium ${stat.changeType === 'positive'
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                            }`}
                                    >
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400"> {t('dashboard.stats.vsLastMonth')}</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                            <h2 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                                {t('dashboard.recentActivity')}
                            </h2>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        <AnimatePresence>
                            {recentActivity.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-blue-50/50 dark:hover:from-pink-900/10 dark:hover:to-blue-900/10 transition-colors duration-200"
                                >
                                    <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-100 to-blue-100 dark:from-pink-900/30 dark:to-blue-900/30 flex items-center justify-center">
                                            <activity.icon className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                                <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>

            {/* No courses message */}
            {isTeacher && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                        <div className="p-6">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {t('dashboard.noCoursesTitle')}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {t('dashboard.noCreatedCourses')}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    );
} 