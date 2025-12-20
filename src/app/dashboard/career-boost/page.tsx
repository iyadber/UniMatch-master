'use client';

import { motion } from 'framer-motion';
import {
    Rocket,
    FileText,
    Target,
    TrendingUp,
    Briefcase,
    Users,
    Sparkles,
    Zap,
    Award,
    Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

const upcomingFeatures = [
    {
        icon: FileText,
        title: 'AI Resume Builder',
        description: 'Create ATS-optimized resumes tailored to your dream jobs with AI assistance',
        status: 'In Development',
        eta: 'Q1 2025',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Target,
        title: 'Career Path Planner',
        description: 'AI-powered career roadmaps based on your skills, interests, and market trends',
        status: 'Coming Soon',
        eta: 'Q1 2025',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Briefcase,
        title: 'Job Matching Engine',
        description: 'Smart job recommendations matching your profile with opportunities',
        status: 'Planned',
        eta: 'Q2 2025',
        color: 'from-orange-500 to-red-500',
    },
    {
        icon: Users,
        title: 'Interview Prep AI',
        description: 'Practice interviews with AI, get feedback, and improve your responses',
        status: 'Planned',
        eta: 'Q2 2025',
        color: 'from-green-500 to-teal-500',
    },
    {
        icon: TrendingUp,
        title: 'Skills Gap Analysis',
        description: 'Identify missing skills and get personalized learning recommendations',
        status: 'Planned',
        eta: 'Q2 2025',
        color: 'from-indigo-500 to-purple-500',
    },
    {
        icon: Award,
        title: 'Portfolio Showcase',
        description: 'Build and share your professional portfolio with verified credentials',
        status: 'Planned',
        eta: 'Q3 2025',
        color: 'from-pink-500 to-rose-500',
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

export default function CareerBoostPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Hero Section */}
            <Card className="p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Rocket className="w-7 h-7" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
                            Coming Soon
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-3">
                        Career Boost
                    </h1>
                    <p className="text-xl text-white/90 mb-6">
                        AI-powered tools to accelerate your career journey. From resume building to interview prep, we've got you covered.
                    </p>
                    <div className="flex gap-3">
                        <Button className="bg-white text-purple-600 hover:bg-white/90">
                            <Calendar className="w-4 h-4 mr-2" />
                            Get Notified
                        </Button>
                        <Button className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                            Learn More
                        </Button>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl" />
            </Card>

            {/* Stats Preview */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                {[
                    { icon: Sparkles, label: 'AI-Powered', value: '100%', description: 'Personalized recommendations' },
                    { icon: Zap, label: 'Time Saved', value: '10x', description: 'Faster job applications' },
                    { icon: Target, label: 'Success Rate', value: '85%', description: 'Interview success rate' },
                ].map((stat, index) => (
                    <motion.div key={index} variants={item}>
                        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                    <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.description}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Upcoming Features */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Upcoming Features
                </h2>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {upcomingFeatures.map((feature, index) => (
                        <motion.div key={index} variants={item}>
                            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 h-full opacity-80 hover:opacity-100 transition-opacity">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={clsx(
                                        'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
                                        feature.color
                                    )}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className={clsx(
                                        'px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider',
                                        feature.status === 'In Development' && 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                                        feature.status === 'Coming Soon' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                                        feature.status === 'Planned' && 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
                                    )}>
                                        {feature.status}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {feature.description}
                                </p>

                                <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Expected: {feature.eta}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Newsletter Signup */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 border-0">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            Be the first to try Career Boost
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Sign up for early access and exclusive updates on our AI career tools
                        </p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className={clsx(
                                "flex-1 md:w-64 px-4 py-2 rounded-xl",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-200 dark:border-gray-700",
                                "text-gray-900 dark:text-white text-sm",
                                "placeholder-gray-500 dark:placeholder-gray-400",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500"
                            )}
                        />
                        <Button>
                            Notify Me
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
