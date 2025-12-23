'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Star,
    Clock,
    DollarSign,
    MessageSquare,
    Calendar,
    Users,
    ChevronDown,
    Heart,
    Sparkles,
    Loader2,
    X,
    Brain,
    Target,
    BookOpen,
    Zap,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

// Types
interface Tutor {
    id: string;
    name: string;
    title: string;
    university: string;
    expertise: string[];
    rating: number;
    reviews: number;
    students: number;
    hourlyRate: number;
    availability: string;
    matchScore: number;
    bio: string;
    languages: string[];
    responseTime: string;
    aiMatchReason?: string;
}

interface AIMatchRequest {
    subject: string;
    topic: string;
    learningGoal: string;
    preferredStyle: string;
    budget: string;
    urgency: string;
}

// Mock tutors data moved to /api/tutors/route.ts

const subjects = [
    'All Subjects',
    'Mathematics',
    'Physics',
    'Computer Science',
    'Chemistry',
    'Biology',
    'Economics',
    'Engineering',
];

const learningGoals = [
    'Exam preparation',
    'Understand concepts deeply',
    'Complete assignments',
    'Research guidance',
    'Skill development',
    'Career advancement',
];

const learningStyles = [
    'Visual (diagrams, videos)',
    'Hands-on (practice problems)',
    'Conceptual (theory-first)',
    'Interactive (discussion-based)',
];

const budgetOptions = [
    'Under $50/hour',
    '$50-75/hour',
    '$75-100/hour',
    'Any budget',
];

const urgencyOptions = [
    'Need help ASAP',
    'Within this week',
    'Flexible timing',
];

// AI Matching Modal Component
const AIMatchingModal = ({
    isOpen,
    onClose,
    onMatch
}: {
    isOpen: boolean;
    onClose: () => void;
    onMatch: (request: AIMatchRequest) => void;
}) => {
    const [step, setStep] = useState(1);
    const [request, setRequest] = useState<AIMatchRequest>({
        subject: '',
        topic: '',
        learningGoal: '',
        preferredStyle: '',
        budget: 'Any budget',
        urgency: 'Flexible timing',
    });

    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            onMatch(request);
        }
    };

    const canContinue = () => {
        switch (step) {
            case 1: return request.subject.length > 0 && request.topic.length > 0;
            case 2: return request.learningGoal.length > 0;
            case 3: return request.preferredStyle.length > 0;
            case 4: return true;
            default: return false;
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl"
            >
                {/* Progress Bar */}
                <div className="h-1 bg-gray-200 dark:bg-gray-800">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 to-pink-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>

                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    AI Tutor Matching
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Step {step} of {totalSteps}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="min-h-[250px]"
                        >
                            {/* Step 1: Subject & Topic */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
                                        <BookOpen className="w-5 h-5" />
                                        <span className="font-medium">What do you need help with?</span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Subject Area
                                        </label>
                                        <select
                                            value={request.subject}
                                            onChange={(e) => setRequest({ ...request, subject: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                                        >
                                            <option value="">Select a subject...</option>
                                            {subjects.filter(s => s !== 'All Subjects').map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Specific Topic or Question
                                        </label>
                                        <textarea
                                            value={request.topic}
                                            onChange={(e) => setRequest({ ...request, topic: e.target.value })}
                                            placeholder="Describe what you need help with... (e.g., 'I need help understanding neural networks for my deep learning course')"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white resize-none h-24"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Learning Goal */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 mb-4">
                                        <Target className="w-5 h-5" />
                                        <span className="font-medium">What's your main goal?</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {learningGoals.map((goal) => (
                                            <button
                                                key={goal}
                                                onClick={() => setRequest({ ...request, learningGoal: goal })}
                                                className={clsx(
                                                    'p-4 rounded-xl text-left transition-all duration-200 border-2',
                                                    request.learningGoal === goal
                                                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
                                                )}
                                            >
                                                <span className={clsx(
                                                    'font-medium',
                                                    request.learningGoal === goal
                                                        ? 'text-pink-600 dark:text-pink-400'
                                                        : 'text-gray-700 dark:text-gray-300'
                                                )}>
                                                    {goal}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Learning Style */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-4">
                                        <Brain className="w-5 h-5" />
                                        <span className="font-medium">How do you prefer to learn?</span>
                                    </div>
                                    <div className="space-y-3">
                                        {learningStyles.map((style) => (
                                            <button
                                                key={style}
                                                onClick={() => setRequest({ ...request, preferredStyle: style })}
                                                className={clsx(
                                                    'w-full p-4 rounded-xl text-left transition-all duration-200 border-2',
                                                    request.preferredStyle === style
                                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                                )}
                                            >
                                                <span className={clsx(
                                                    'font-medium',
                                                    request.preferredStyle === style
                                                        ? 'text-purple-600 dark:text-purple-400'
                                                        : 'text-gray-700 dark:text-gray-300'
                                                )}>
                                                    {style}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Budget & Urgency */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                                            <DollarSign className="w-5 h-5" />
                                            <span className="font-medium">Budget preference</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {budgetOptions.map((budget) => (
                                                <button
                                                    key={budget}
                                                    onClick={() => setRequest({ ...request, budget })}
                                                    className={clsx(
                                                        'p-3 rounded-xl text-sm font-medium transition-all border-2',
                                                        request.budget === budget
                                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-300'
                                                    )}
                                                >
                                                    {budget}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-4">
                                            <Clock className="w-5 h-5" />
                                            <span className="font-medium">How urgent?</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {urgencyOptions.map((urgency) => (
                                                <button
                                                    key={urgency}
                                                    onClick={() => setRequest({ ...request, urgency })}
                                                    className={clsx(
                                                        'p-3 rounded-xl text-sm font-medium transition-all border-2',
                                                        request.urgency === urgency
                                                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                                                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-300'
                                                    )}
                                                >
                                                    {urgency}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>
                        <div className="flex gap-2">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className={clsx(
                                        'w-2 h-2 rounded-full',
                                        i + 1 === step ? 'bg-blue-600' : i + 1 < step ? 'bg-blue-300' : 'bg-gray-300 dark:bg-gray-600'
                                    )}
                                />
                            ))}
                        </div>
                        <Button onClick={handleNext} disabled={!canContinue()}>
                            {step === totalSteps ? (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Find Matches
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// AI Matching Results Component
const AIMatchingResults = ({
    isOpen,
    onClose,
    tutors,
    isLoading,
    matchRequest
}: {
    isOpen: boolean;
    onClose: () => void;
    tutors: Tutor[];
    isLoading: boolean;
    matchRequest: AIMatchRequest | null;
}) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    AI-Recommended Tutors
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {matchRequest?.subject} • {matchRequest?.learningGoal}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[65vh]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-pink-600 animated-spin flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-4 text-center">
                                AI is analyzing tutors to find your perfect match...
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                Considering expertise, teaching style, and availability
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tutors.map((tutor, index) => (
                                <motion.div
                                    key={tutor.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={clsx(
                                        'p-5 rounded-2xl border-2 transition-all',
                                        index === 0
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                    )}
                                >
                                    {index === 0 && (
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium mb-3">
                                            <Zap className="w-4 h-4" />
                                            Best Match for You
                                        </div>
                                    )}
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            {tutor.name.split(' ').slice(-2).map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {tutor.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {tutor.title} • {tutor.university}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={clsx(
                                                        'px-3 py-1 rounded-full text-sm font-bold',
                                                        tutor.matchScore >= 90
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                            : tutor.matchScore >= 80
                                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                    )}>
                                                        {tutor.matchScore}% Match
                                                    </div>
                                                </div>
                                            </div>

                                            {tutor.aiMatchReason && (
                                                <div className="mt-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300">
                                                    <span className="font-medium">AI Insight:</span> {tutor.aiMatchReason}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {tutor.expertise.slice(0, 4).map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-4 mt-3 text-sm">
                                                <span className="flex items-center gap-1 text-yellow-600">
                                                    <Star className="w-4 h-4 fill-yellow-500" />
                                                    {tutor.rating} ({tutor.reviews})
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    ${tutor.hourlyRate}/hr
                                                </span>
                                                <span className={clsx(
                                                    tutor.availability === 'Available Now'
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                )}>
                                                    {tutor.availability}
                                                </span>
                                            </div>

                                            <div className="flex gap-2 mt-4">
                                                <Button variant="secondary" className="flex-1">
                                                    <MessageSquare className="w-4 h-4 mr-2" />
                                                    Message
                                                </Button>
                                                <Button className="flex-1">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    Book Session
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// Animation variants
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

// Main Component
export default function FindTutorPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Data states
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // AI Matching states
    const [showAIModal, setShowAIModal] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isMatching, setIsMatching] = useState(false);
    const [matchedTutors, setMatchedTutors] = useState<Tutor[]>([]);
    const [matchRequest, setMatchRequest] = useState<AIMatchRequest | null>(null);

    // Fetch tutors logic
    const fetchTutors = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedSubject !== 'All Subjects') params.append('subject', selectedSubject);

            const response = await fetch(`/api/tutors?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setTutors(data.data);
                setError(null);
            } else {
                setError('Failed to load tutors');
            }
        } catch (err) {
            setError('An error occurred while fetching tutors');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedSubject]);

    // Initial load and updates when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchTutors();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [fetchTutors]);

    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    // AI Matching function
    const handleAIMatch = useCallback(async (request: AIMatchRequest) => {
        setMatchRequest(request);
        setShowAIModal(false);
        setShowResults(true);
        setIsMatching(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `You are a tutor matching AI. Based on these requirements:
- Subject: ${request.subject}
- Topic: ${request.topic}
- Goal: ${request.learningGoal}
- Learning Style: ${request.preferredStyle}
- Budget: ${request.budget}
- Urgency: ${request.urgency}

Analyze these tutors and rank them by match score (0-100). For each tutor provide a brief reason why they match.

Tutors:
${tutors.slice(0, 10).map(t => `ID:${t.id}, Name:${t.name}, Title:${t.title}, University:${t.university}, Expertise:[${t.expertise.join(',')}], Rate:$${t.hourlyRate}/hr, Availability:${t.availability}, Rating:${t.rating}`).join('\n')}

Return ONLY a valid JSON array with format: [{"id": number, "matchScore": number, "reason": "brief explanation"}]. Order by matchScore descending. No other text.`,
                    systemPrompt: 'You are a tutor matching AI. Return ONLY valid JSON array, no markdown, no explanation.',
                }),
            });

            const data = await response.json();
            if (data.success) {
                try {
                    const jsonMatch = data.response.match(/\[[\s\S]*\]/);
                    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : data.response);

                    // Map AI results to tutors
                    const rankedTutors: Tutor[] = parsed.map((match: { id: string; matchScore: number; reason: string }) => {
                        const tutor = tutors.find(t => t.id === match.id);
                        if (tutor) {
                            return {
                                ...tutor,
                                matchScore: match.matchScore,
                                aiMatchReason: match.reason,
                            };
                        }
                        return null;
                    }).filter(Boolean).slice(0, 4);

                    setMatchedTutors(rankedTutors);
                } catch (e) {
                    console.error('Parse error:', e);
                    // Fallback: simple matching
                    const fallbackTutors = tutors
                        .slice(0, 4)
                        .map(t => ({ ...t, matchScore: Math.floor(Math.random() * 20) + 75 }))
                        .sort((a, b) => b.matchScore - a.matchScore);
                    setMatchedTutors(fallbackTutors);
                }
            }
        } catch (error) {
            console.error('AI Match error:', error);
            const fallbackTutors = tutors
                .slice(0, 4)
                .map(t => ({ ...t, matchScore: Math.floor(Math.random() * 30) + 70 }))
                .sort((a, b) => b.matchScore - a.matchScore);
            setMatchedTutors(fallbackTutors);
        } finally {
            setIsMatching(false);
        }
    }, [tutors]);

    // Derived state for the view is now just 'tutors' since filtering happens on backend
    const filteredTutors = tutors;

    return (
        <>
            {/* AI Matching Modal */}
            <AnimatePresence>
                {showAIModal && (
                    <AIMatchingModal
                        isOpen={showAIModal}
                        onClose={() => setShowAIModal(false)}
                        onMatch={handleAIMatch}
                    />
                )}
            </AnimatePresence>

            {/* AI Results Modal */}
            <AnimatePresence>
                {showResults && (
                    <AIMatchingResults
                        isOpen={showResults}
                        onClose={() => setShowResults(false)}
                        tutors={matchedTutors}
                        isLoading={isMatching}
                        matchRequest={matchRequest}
                    />
                )}
            </AnimatePresence>

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
                        Find a PhD Tutor
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Connect with expert PhD researchers for personalized tutoring
                    </p>
                </motion.div>

                {/* Search and Filters */}
                <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, subject, or expertise..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={clsx(
                                    "w-full pl-12 pr-4 py-3 rounded-xl",
                                    "bg-gray-50 dark:bg-gray-900",
                                    "border border-gray-200 dark:border-gray-700",
                                    "text-gray-900 dark:text-white",
                                    "placeholder-gray-500 dark:placeholder-gray-400",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500"
                                )}
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className={clsx(
                                        "px-4 py-3 pr-10 rounded-xl appearance-none cursor-pointer",
                                        "bg-gray-50 dark:bg-gray-900",
                                        "border border-gray-200 dark:border-gray-700",
                                        "text-gray-900 dark:text-white",
                                        "focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    )}
                                >
                                    {subjects.map((subject) => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price Range ($/hour)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Rating
                                </label>
                                <select className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm">
                                    <option>Any Rating</option>
                                    <option>4.5+</option>
                                    <option>4.0+</option>
                                    <option>3.5+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Availability
                                </label>
                                <select className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm">
                                    <option>Anytime</option>
                                    <option>Available Now</option>
                                    <option>Today</option>
                                    <option>This Week</option>
                                </select>
                            </div>
                        </motion.div>
                    )}
                </Card>

                {/* AI Matching Banner */}
                <Card className="p-6 bg-gradient-to-r from-blue-600 to-pink-600 text-white border-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Sparkles className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">AI-Powered Matching</h3>
                                <p className="text-white/80 text-sm">
                                    Our AI analyzes your learning style and goals to find the perfect tutor match
                                </p>
                            </div>
                        </div>
                        <Button
                            className="bg-white text-blue-600 hover:bg-white/90"
                            onClick={() => setShowAIModal(true)}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Get AI Recommendations
                        </Button>
                    </div>
                </Card>

                {/* Tutors Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {filteredTutors.map((tutor) => (
                        <motion.div key={tutor.id} variants={item}>
                            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                                            {tutor.name.split(' ').slice(-2).map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                                {tutor.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{tutor.title}</p>
                                            <p className="text-sm text-blue-600 dark:text-blue-400">{tutor.university}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleFavorite(tutor.id)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Heart className={clsx(
                                            "w-5 h-5",
                                            favorites.includes(tutor.id)
                                                ? "text-red-500 fill-red-500"
                                                : "text-gray-400"
                                        )} />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {tutor.bio}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tutor.expertise.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-4 gap-4 mb-4 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-yellow-500">
                                            <Star className="w-4 h-4 fill-yellow-500" />
                                            <span className="font-semibold text-gray-900 dark:text-white">{tutor.rating}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{tutor.reviews} reviews</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Users className="w-4 h-4 text-blue-500" />
                                            <span className="font-semibold text-gray-900 dark:text-white">{tutor.students}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">students</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Clock className="w-4 h-4 text-green-500" />
                                            <span className="font-semibold text-gray-900 dark:text-white">{tutor.responseTime}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">response</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <DollarSign className="w-4 h-4 text-purple-500" />
                                            <span className="font-semibold text-gray-900 dark:text-white">${tutor.hourlyRate}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">per hour</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className={clsx(
                                        'text-sm font-medium',
                                        tutor.availability === 'Available Now'
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                    )}>
                                        {tutor.availability}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button variant="secondary">
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Message
                                        </Button>
                                        <Button>
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Book Session
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {filteredTutors.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            No tutors found matching your criteria. Try adjusting your search.
                        </p>
                    </div>
                )}
            </motion.div>
        </>
    );
}
