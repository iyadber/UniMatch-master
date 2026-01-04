'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    GraduationCap,
    TrendingUp,
    Settings,
    Brain,
    Activity,
    DollarSign,
    UserCheck,
    UserX,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Ban,
    Mail
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
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    BarChart,
    Bar
} from 'recharts';
import clsx from 'clsx';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock platform analytics
const platformData = [
    { month: 'Jul', users: 1200, sessions: 3400, revenue: 45000 },
    { month: 'Aug', users: 1450, sessions: 4200, revenue: 52000 },
    { month: 'Sep', users: 1680, sessions: 4800, revenue: 58000 },
    { month: 'Oct', users: 1920, sessions: 5600, revenue: 67000 },
    { month: 'Nov', users: 2150, sessions: 6200, revenue: 78000 },
    { month: 'Dec', users: 2400, sessions: 7100, revenue: 89000 },
];

// User distribution
const userDistribution = [
    { name: 'Students', value: 2400, color: '#3B82F6' },
    { name: 'Tutors', value: 180, color: '#EC4899' },
    { name: 'Admins', value: 12, color: '#10B981' },
];

// Mock students data
const studentsData = [
    { id: 1, name: 'Ahmed Hassan', email: 'ahmed@example.com', courses: 5, joined: '2024-08-15', status: 'active' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', courses: 3, joined: '2024-09-20', status: 'active' },
    { id: 3, name: 'Mohamed Ali', email: 'mohamed@example.com', courses: 7, joined: '2024-07-10', status: 'active' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', courses: 2, joined: '2024-10-05', status: 'inactive' },
    { id: 5, name: 'John Smith', email: 'john@example.com', courses: 4, joined: '2024-11-01', status: 'active' },
];

// Mock tutors data
const tutorsData = [
    { id: 1, name: 'Dr. Sarah Wilson', email: 'drwilson@example.com', students: 234, rating: 4.9, earnings: '$18,400', status: 'verified' },
    { id: 2, name: 'Prof. Michael Chen', email: 'mchen@example.com', students: 189, rating: 4.8, earnings: '$15,200', status: 'verified' },
    { id: 3, name: 'Dr. Emily Brown', email: 'ebrown@example.com', students: 156, rating: 4.7, earnings: '$12,800', status: 'pending' },
    { id: 4, name: 'Dr. James Lee', email: 'jlee@example.com', students: 98, rating: 4.6, earnings: '$8,400', status: 'verified' },
];

// AI Settings mock
const aiSettings = {
    model: 'gemini-flash-latest',
    temperature: 0.7,
    maxTokens: 2048,
    studyAssistantEnabled: true,
    tutorMatchingEnabled: true,
    contentModerationEnabled: true,
    apiUsage: {
        today: 1243,
        thisMonth: 34567,
        limit: 100000,
    }
};

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

type TabType = 'students' | 'tutors' | 'analytics' | 'ai-settings';

export default function AdminDashboard() {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<TabType>('analytics');
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = [
        { id: 'analytics' as TabType, label: t('admin.tabs.analytics'), icon: TrendingUp },
        { id: 'students' as TabType, label: t('admin.tabs.students'), icon: Users },
        { id: 'tutors' as TabType, label: t('admin.tabs.tutors'), icon: GraduationCap },
        { id: 'ai-settings' as TabType, label: t('admin.tabs.aiSettings'), icon: Brain },
    ];

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
                    {t('admin.dashboard.title')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {t('admin.dashboard.subtitle')}
                </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {[
                    { label: t('admin.stats.totalStudents'), value: '2,400', icon: Users, change: '+124 this month', color: 'blue' },
                    { label: t('admin.stats.activeTutors'), value: '180', icon: GraduationCap, change: '+12 verified', color: 'pink' },
                    { label: t('admin.stats.totalRevenue'), value: '$89,000', icon: DollarSign, change: '+18% growth', color: 'green' },
                    { label: t('admin.stats.aiCalls'), value: '34.5K', icon: Brain, change: 'This month', color: 'purple' },
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
                                        stat.color === 'blue' && 'text-blue-600 dark:text-blue-400',
                                        stat.color === 'pink' && 'text-pink-600 dark:text-pink-400',
                                        stat.color === 'green' && 'text-green-600 dark:text-green-400',
                                        stat.color === 'purple' && 'text-purple-600 dark:text-purple-400',
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

            {/* Tabs Navigation */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap',
                            activeTab === tab.id
                                ? 'bg-gradient-to-r from-blue-600 to-pink-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'analytics' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Chart */}
                        <Card className="lg:col-span-2 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.charts.platformGrowth')}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.charts.platformGrowthDesc')}</p>
                                </div>
                            </div>

                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={platformData}>
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
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
                                        <Area type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                                        <Area type="monotone" dataKey="sessions" stroke="#EC4899" strokeWidth={2} fillOpacity={1} fill="url(#colorSessions)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* User Distribution */}
                        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.charts.userDistribution')}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.charts.byUserType')}</p>
                                </div>
                            </div>

                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={userDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            dataKey="value"
                                            paddingAngle={5}
                                        >
                                            {userDistribution.map((entry, index) => (
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
                                {userDistribution.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </motion.div>
            )}

            {activeTab === 'students' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.students.title')}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.students.desc')}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={t('admin.students.searchPlaceholder')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <Button variant="secondary">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.students.table.student')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.students.table.email')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.students.table.courses')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.students.table.joined')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.students.table.status')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.students.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsData.map((student) => (
                                        <tr key={student.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-white">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{student.email}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{student.courses}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{student.joined}</td>
                                            <td className="py-4 px-4">
                                                <span className={clsx(
                                                    'px-2 py-1 rounded-full text-xs font-medium',
                                                    student.status === 'active'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                )}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                                                        <Mail className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>
            )}

            {activeTab === 'tutors' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.tutors.title')}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.tutors.desc')}</p>
                                </div>
                            </div>
                            <Button>
                                <UserCheck className="w-4 h-4 mr-2" />
                                {t('admin.tutors.pendingApprovals')} (3)
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.tutors.table.tutor')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.students.table.email')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.tutors.table.students')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.tutors.table.rating')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.tutors.table.earnings')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.students.table.status')}</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('admin.students.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tutorsData.map((tutor) => (
                                        <tr key={tutor.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                                                        {tutor.name.split(' ').slice(-2).map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-white">{tutor.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{tutor.email}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">{tutor.students}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-500">★</span>
                                                    <span className="text-sm text-gray-900 dark:text-white">{tutor.rating}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm font-medium text-green-600 dark:text-green-400">{tutor.earnings}</td>
                                            <td className="py-4 px-4">
                                                <span className={clsx(
                                                    'px-2 py-1 rounded-full text-xs font-medium',
                                                    tutor.status === 'verified'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                                )}>
                                                    {tutor.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                                                        <Mail className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500">
                                                        <Ban className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>
            )}

            {activeTab === 'ai-settings' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* AI Configuration */}
                    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.ai.config.title')}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.ai.config.desc')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('admin.ai.model')}</label>
                                <select className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                                    <option value="gemini-flash-latest">gemini-flash-latest</option>
                                    <option value="gemini-pro">gemini-pro</option>
                                    <option value="gemini-pro-vision">gemini-pro-vision</option>
                                </select>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.ai.temperature')}: {aiSettings.temperature}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    defaultValue={aiSettings.temperature}
                                    className="w-full accent-blue-600"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('admin.ai.tempDesc')}</p>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('admin.ai.maxTokens')}</label>
                                <input
                                    type="number"
                                    defaultValue={aiSettings.maxTokens}
                                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Feature Toggles */}
                    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                                <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('admin.ai.features.title')}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.ai.features.desc')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: t('admin.ai.features.studyAssistant'), description: t('admin.ai.features.studyAssistantDesc'), enabled: aiSettings.studyAssistantEnabled },
                                { name: t('admin.ai.features.tutorMatching'), description: t('admin.ai.features.tutorMatchingDesc'), enabled: aiSettings.tutorMatchingEnabled },
                                { name: t('admin.ai.features.contentModeration'), description: t('admin.ai.features.contentModerationDesc'), enabled: aiSettings.contentModerationEnabled },
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{feature.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={feature.enabled} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* API Usage */}
                        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('admin.ai.usage.title')}</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">{t('admin.ai.usage.today')}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{aiSettings.apiUsage.today.toLocaleString()} {t('admin.ai.usage.calls')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">{t('admin.ai.usage.thisMonth')}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{aiSettings.apiUsage.thisMonth.toLocaleString()} {t('admin.ai.usage.calls')}</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 to-pink-600 rounded-full"
                                        style={{ width: `${(aiSettings.apiUsage.thisMonth / aiSettings.apiUsage.limit) * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {((aiSettings.apiUsage.thisMonth / aiSettings.apiUsage.limit) * 100).toFixed(1)}% {t('admin.ai.usage.limitUsed')}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    );
}
