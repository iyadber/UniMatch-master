'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    DollarSign,
    Users,
    Star,
    Clock,
    TrendingUp,
    MessageSquare,
    CheckCircle,
    XCircle,
    Video
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line
} from 'recharts';
import clsx from 'clsx';

// Mock data for bookings
const upcomingBookings = [
    {
        id: 1,
        student: 'Ahmed Hassan',
        subject: 'Advanced Calculus',
        date: '2024-12-17',
        time: '10:00 AM',
        duration: '1 hour',
        status: 'confirmed',
        type: 'video'
    },
    {
        id: 2,
        student: 'Sarah Johnson',
        subject: 'Linear Algebra',
        date: '2024-12-17',
        time: '2:00 PM',
        duration: '1.5 hours',
        status: 'pending',
        type: 'video'
    },
    {
        id: 3,
        student: 'Mohamed Ali',
        subject: 'Differential Equations',
        date: '2024-12-18',
        time: '11:00 AM',
        duration: '1 hour',
        status: 'confirmed',
        type: 'video'
    },
    {
        id: 4,
        student: 'Emma Wilson',
        subject: 'Statistics',
        date: '2024-12-18',
        time: '4:00 PM',
        duration: '2 hours',
        status: 'confirmed',
        type: 'video'
    },
];

// Mock earnings data
const earningsData = [
    { month: 'Jul', earnings: 2400, sessions: 24 },
    { month: 'Aug', earnings: 3200, sessions: 32 },
    { month: 'Sep', earnings: 2800, sessions: 28 },
    { month: 'Oct', earnings: 3600, sessions: 36 },
    { month: 'Nov', earnings: 4200, sessions: 42 },
    { month: 'Dec', earnings: 3800, sessions: 38 },
];

// Mock student analytics
const studentAnalytics = [
    { week: 'W1', newStudents: 5, returning: 12, satisfaction: 4.8 },
    { week: 'W2', newStudents: 8, returning: 15, satisfaction: 4.9 },
    { week: 'W3', newStudents: 3, returning: 18, satisfaction: 4.7 },
    { week: 'W4', newStudents: 6, returning: 20, satisfaction: 4.8 },
];

// Mock feedback data
const recentFeedback = [
    {
        id: 1,
        student: 'Ahmed H.',
        rating: 5,
        comment: 'Excellent explanation of complex topics. Very patient and thorough!',
        date: '2 days ago',
        subject: 'Calculus'
    },
    {
        id: 2,
        student: 'Sarah J.',
        rating: 5,
        comment: 'Dr. Wilson made linear algebra so much easier to understand.',
        date: '3 days ago',
        subject: 'Linear Algebra'
    },
    {
        id: 3,
        student: 'Mohamed A.',
        rating: 4,
        comment: 'Great session, would appreciate more practice problems.',
        date: '1 week ago',
        subject: 'Differential Equations'
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

export default function TutorDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

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
                    Tutor Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Manage your sessions, track earnings, and monitor student progress
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
                    { label: 'Total Earnings', value: '$18,400', icon: DollarSign, change: '+12% this month', color: 'green' },
                    { label: 'Active Students', value: '48', icon: Users, change: '+8 new this week', color: 'blue' },
                    { label: 'Sessions Completed', value: '186', icon: CheckCircle, change: '12 this week', color: 'purple' },
                    { label: 'Average Rating', value: '4.9', icon: Star, change: 'From 156 reviews', color: 'yellow' },
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
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Bookings</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming sessions</p>
                                </div>
                            </div>
                            <Button variant="secondary" className="text-sm">View Calendar</Button>
                        </div>

                        <div className="space-y-3">
                            {upcomingBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center text-white font-bold">
                                                {booking.student.split(' ').map(n => n[0]).join('')}
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
                                                booking.status === 'confirmed'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                            )}>
                                                {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                <Video className="w-3 h-3" /> Video Call
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
                    </Card>
                </motion.div>

                {/* Earnings Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Earnings</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly breakdown</p>
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                $3,800
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
                        </div>

                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={earningsData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                                    <YAxis stroke="#6B7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Bar dataKey="earnings" fill="url(#earningsGradient)" radius={[4, 4, 0, 0]} />
                                    <defs>
                                        <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10B981" />
                                            <stop offset="100%" stopColor="#059669" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">$640</p>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Withdrawn</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">$14,560</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Student Analytics & Rating */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Student Analytics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Student Analytics</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Weekly engagement trends</p>
                            </div>
                        </div>

                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={studentAnalytics}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                                    <XAxis dataKey="week" stroke="#6B7280" fontSize={12} />
                                    <YAxis stroke="#6B7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Line type="monotone" dataKey="newStudents" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
                                    <Line type="monotone" dataKey="returning" stroke="#EC4899" strokeWidth={2} dot={{ fill: '#EC4899' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">New Students</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-pink-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Returning</span>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* My Rating & Feedback */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Rating & Feedback</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Recent student reviews</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">4.9 / 5.0</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {recentFeedback.map((feedback) => (
                                <div
                                    key={feedback.id}
                                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                                                {feedback.student.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900 dark:text-white text-sm">{feedback.student}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{feedback.subject}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(feedback.rating)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{feedback.comment}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{feedback.date}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
