'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Brain,
    TrendingUp,
    Users,
    Star,
    Clock,
    CheckCircle,
    Play,
    GraduationCap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AIChat } from '@/components/ai/AIChat';
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
    PieChart,
    Pie,
    Cell
} from 'recharts';
import clsx from 'clsx';

// Mock data for modules
const modules = [
    { id: 1, name: 'Advanced Mathematics', progress: 75, lessons: 24, completed: 18, color: '#3B82F6' },
    { id: 2, name: 'Quantum Physics', progress: 45, lessons: 20, completed: 9, color: '#EC4899' },
    { id: 3, name: 'Machine Learning', progress: 90, lessons: 30, completed: 27, color: '#10B981' },
    { id: 4, name: 'Data Structures', progress: 60, lessons: 16, completed: 10, color: '#F59E0B' },
];

// Mock data for performance chart
const performanceData = [
    { name: 'Week 1', score: 65, hours: 12 },
    { name: 'Week 2', score: 72, hours: 15 },
    { name: 'Week 3', score: 68, hours: 10 },
    { name: 'Week 4', score: 85, hours: 18 },
    { name: 'Week 5', score: 78, hours: 14 },
    { name: 'Week 6', score: 92, hours: 20 },
];

// Mock data for subject distribution
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
    const [showChat, setShowChat] = useState(false);

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
                    Student Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    An AI Ecosystem Connecting Students with PhD Researchers — Where Intelligence Finds Its Match.
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
                    { label: 'Courses Enrolled', value: '8', icon: BookOpen, change: '+2 this month' },
                    { label: 'Study Hours', value: '142', icon: Clock, change: '+23 this week' },
                    { label: 'Avg. Score', value: '87%', icon: TrendingUp, change: '+5% improvement' },
                    { label: 'Completed', value: '24', icon: CheckCircle, change: '6 pending' },
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
                {/* My Modules Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Modules</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Track your course progress</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {modules.map((module) => (
                                <div
                                    key={module.id}
                                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: `${module.color}20` }}
                                            >
                                                <GraduationCap className="w-5 h-5" style={{ color: module.color }} />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{module.name}</h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {module.completed}/{module.lessons} lessons completed
                                                </p>
                                            </div>
                                        </div>
                                        <button className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-pink-600 text-white hover:shadow-lg transition-shadow">
                                            <Play className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${module.progress}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="absolute h-full rounded-full"
                                            style={{
                                                background: `linear-gradient(to right, ${module.color}, ${module.color}88)`
                                            }}
                                        />
                                    </div>
                                    <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {module.progress}% complete
                                    </p>
                                </div>
                            ))}
                        </div>
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
                            title="AI Study Assistant"
                            placeholder="Ask about your courses..."
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
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Performance</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Weekly progress overview</p>
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
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Focus Areas</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Time distribution</p>
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
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Tutors</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered suggestions based on your interests</p>
                            </div>
                        </div>
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            View All
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
                                        {tutor.matchScore}% Match
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
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{tutor.students} students</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
