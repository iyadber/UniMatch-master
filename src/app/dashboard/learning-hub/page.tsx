'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    BookOpen,
    Video,
    FileText,
    Clock,
    Star,
    TrendingUp,
    Sparkles,
    ChevronRight,
    Zap,
    Plus,
    RefreshCw,
    Check,
    X,
    ArrowLeft,
    ArrowRight,
    Loader2,
    GraduationCap,
    Target,
    Lightbulb,
    Code,
    Calculator,
    Globe,
    Palette,
    Music,
    Microscope,
    Heart,
    Rocket
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIChat } from '@/components/ai/AIChat';
import clsx from 'clsx';
import { useLanguage } from '@/contexts/LanguageContext';

// Storage key for user preferences
const PREFERENCES_KEY = 'unimatch-learning-preferences';

// Types
interface UserPreferences {
    name: string;
    subjects: string[];
    learningGoals: string[];
    learningStyle: string;
    experienceLevel: string;
    weeklyHours: string;
    hasCompletedOnboarding: boolean;
}

interface LearningPath {
    id: number;
    title: string;
    description: string;
    lessons: Lesson[];
    duration: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    progress: number;
    color: string;
    icon: typeof Brain;
}

interface Lesson {
    id: number;
    title: string;
    duration: string;
    completed: boolean;
    content: string;
}

interface Flashcard {
    id: number;
    question: string;
    answer: string;
    topic: string;
}

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

// Subject options with icons
const subjectOptions = [
    { id: 'machine-learning', label: 'Machine Learning', icon: Brain },
    { id: 'data-science', label: 'Data Science', icon: TrendingUp },
    { id: 'programming', label: 'Programming', icon: Code },
    { id: 'mathematics', label: 'Mathematics', icon: Calculator },
    { id: 'languages', label: 'Languages', icon: Globe },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'science', label: 'Natural Sciences', icon: Microscope },
    { id: 'health', label: 'Health & Medicine', icon: Heart },
    { id: 'business', label: 'Business & Finance', icon: Rocket },
];

const goalOptions = [
    'Master a new skill',
    'Advance my career',
    'Academic excellence',
    'Personal interest',
    'Prepare for exams',
    'Build projects',
];

const learningStyleOptions = [
    { id: 'visual', label: 'pref.visual', desc: 'pref.visualDesc' },
    { id: 'reading', label: 'pref.reading', desc: 'pref.readingDesc' },
    { id: 'hands-on', label: 'pref.handson', desc: 'pref.handsonDesc' },
    { id: 'mixed', label: 'pref.mixed', desc: 'pref.mixedDesc' },
];

const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const weeklyHoursOptions = ['1-3 hours', '4-7 hours', '8-15 hours', '15+ hours'];

// Default preferences
const defaultPreferences: UserPreferences = {
    name: '',
    subjects: [],
    learningGoals: [],
    learningStyle: 'mixed',
    experienceLevel: 'Beginner',
    weeklyHours: '4-7 hours',
    hasCompletedOnboarding: false,
};
// Onboarding Modal Component
const OnboardingModal = ({
    onComplete,
    initialPreferences
}: {
    onComplete: (prefs: UserPreferences) => void;
    initialPreferences: UserPreferences;
}) => {
    const { t, dir } = useLanguage();
    const [step, setStep] = useState(1);
    const [prefs, setPrefs] = useState<UserPreferences>(initialPreferences);
    const totalSteps = 5;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            onComplete({ ...prefs, hasCompletedOnboarding: true });
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const canContinue = () => {
        switch (step) {
            case 1: return prefs.name.trim().length > 0;
            case 2: return prefs.subjects.length > 0;
            case 3: return prefs.learningGoals.length > 0;
            case 4: return prefs.learningStyle.length > 0;
            case 5: return true;
            default: return false;
        }
    };

    const toggleSubject = (subjectId: string) => {
        setPrefs(p => ({
            ...p,
            subjects: p.subjects.includes(subjectId)
                ? p.subjects.filter(s => s !== subjectId)
                : [...p.subjects, subjectId]
        }));
    };

    const toggleGoal = (goal: string) => {
        setPrefs(p => ({
            ...p,
            learningGoals: p.learningGoals.includes(goal)
                ? p.learningGoals.filter(g => g !== goal)
                : [...p.learningGoals, goal]
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl"
            >
                {/* Progress Bar */}
                <div className="h-1 bg-gray-200 dark:bg-gray-800">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 to-pink-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 mb-4"
                        >
                            {step === 1 && <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
                            {step === 2 && <BookOpen className="w-8 h-8 text-pink-600 dark:text-pink-400" />}
                            {step === 3 && <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
                            {step === 4 && <Lightbulb className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />}
                            {step === 5 && <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />}
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {step === 1 && t('onboarding.welcome')}
                            {step === 2 && t('onboarding.subjects')}
                            {step === 3 && t('onboarding.goals')}
                            {step === 4 && t('onboarding.style')}
                            {step === 5 && t('onboarding.almostThere')}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            {step === 1 && t('onboarding.welcomeDesc')}
                            {step === 2 && t('onboarding.subjectsDesc')}
                            {step === 3 && t('onboarding.goalsDesc')}
                            {step === 4 && t('onboarding.styleDesc')}
                            {step === 5 && t('onboarding.almostThereDesc')}
                        </p>
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="min-h-[280px]"
                        >
                            {step === 1 && (
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('onboarding.nameQuestion')}
                                    </label>
                                    <input
                                        type="text"
                                        value={prefs.name}
                                        onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
                                        placeholder={t('onboarding.namePlaceholder')}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-lg"
                                        autoFocus
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('onboarding.nameHint')}
                                    </p>
                                </div>
                            )}

                            {/* Step 2: Subjects */}
                            {step === 2 && (
                                <div className="grid grid-cols-2 gap-3">
                                    {subjectOptions.map((subject) => (
                                        <button
                                            key={subject.id}
                                            onClick={() => toggleSubject(subject.id)}
                                            className={clsx(
                                                'p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3',
                                                'border-2',
                                                prefs.subjects.includes(subject.id)
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                            )}
                                        >
                                            <subject.icon className={clsx(
                                                'w-5 h-5',
                                                prefs.subjects.includes(subject.id)
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-400'
                                            )} />
                                            <span className={clsx(
                                                'font-medium',
                                                prefs.subjects.includes(subject.id)
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-700 dark:text-gray-300'
                                            )}>
                                                {subject.label}
                                            </span>
                                            {prefs.subjects.includes(subject.id) && (
                                                <Check className="w-4 h-4 text-blue-600 ml-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 3: Goals */}
                            {step === 3 && (
                                <div className="grid grid-cols-2 gap-3">
                                    {goalOptions.map((goal) => (
                                        <button
                                            key={goal}
                                            onClick={() => toggleGoal(goal)}
                                            className={clsx(
                                                'p-4 rounded-xl text-left transition-all duration-200',
                                                'border-2',
                                                prefs.learningGoals.includes(goal)
                                                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
                                            )}
                                        >
                                            <span className={clsx(
                                                'font-medium',
                                                prefs.learningGoals.includes(goal)
                                                    ? 'text-pink-600 dark:text-pink-400'
                                                    : 'text-gray-700 dark:text-gray-300'
                                            )}>
                                                {goal}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 4: Learning Style */}
                            {step === 4 && (
                                <div className="space-y-3">
                                    {learningStyleOptions.map((style) => (
                                        <button
                                            key={style.id}
                                            onClick={() => setPrefs({ ...prefs, learningStyle: style.id })}
                                            className={clsx(
                                                'w-full p-4 rounded-xl text-left transition-all duration-200',
                                                'border-2',
                                                prefs.learningStyle === style.id
                                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                            )}
                                        >
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {t(style.label)}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {t(style.desc)}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 5: Experience & Time */}
                            {step === 5 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            {t('onboarding.experienceLevel')}
                                        </label>
                                        <div className="flex gap-2">
                                            {experienceLevels.map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setPrefs({ ...prefs, experienceLevel: level })}
                                                    className={clsx(
                                                        'flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all',
                                                        prefs.experienceLevel === level
                                                            ? 'bg-gradient-to-r from-blue-600 to-pink-600 text-white'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                    )}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            {t('onboarding.weeklyStudyTime')}
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {weeklyHoursOptions.map((hours) => (
                                                <button
                                                    key={hours}
                                                    onClick={() => setPrefs({ ...prefs, weeklyHours: hours })}
                                                    className={clsx(
                                                        'py-3 px-4 rounded-xl text-sm font-medium transition-all',
                                                        prefs.weeklyHours === hours
                                                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                    )}
                                                >
                                                    {hours}
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
                            onClick={handleBack}
                            disabled={step === 1}
                            className={clsx(
                                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                                step === 1
                                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        >
                            <ArrowLeft className={clsx("w-4 h-4", dir === 'rtl' ? 'ml-2' : 'mr-2')} />
                            {t('onboarding.back')}
                        </button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className={clsx(
                                        'w-2 h-2 rounded-full transition-colors',
                                        i + 1 === step
                                            ? 'bg-blue-600'
                                            : i + 1 < step
                                                ? 'bg-blue-300'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                    )}
                                />
                            ))}
                        </div>
                        <Button
                            onClick={handleNext}
                            disabled={!canContinue()}
                        >
                            {step === totalSteps ? t('onboarding.getStarted') : t('onboarding.continue')}
                            {step < totalSteps && <ArrowRight className={clsx("w-4 h-4", dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2')} />}
                            {step === totalSteps && <Sparkles className={clsx("w-4 h-4", dir === 'rtl' ? 'mr-2' : 'ml-2')} />}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// AI Tool Card Component
const AIToolCard = ({
    icon: Icon,
    name,
    description,
    color,
    onClick,
    isActive
}: {
    icon: typeof Sparkles;
    name: string;
    description: string;
    color: string;
    onClick: () => void;
    isActive: boolean;
}) => {
    const { t } = useLanguage();
    return (
        <button
            onClick={onClick}
            className={clsx(
                'w-full p-6 rounded-2xl text-left transition-all duration-300',
                'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg',
                'border-2',
                isActive
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-700',
                'hover:shadow-xl cursor-pointer group'
            )}
        >
            <div className={clsx(
                'w-14 h-14 rounded-2xl flex items-center justify-center mb-4',
                'bg-gradient-to-br',
                color,
                'group-hover:scale-110 transition-transform duration-300'
            )}>
                <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t(name)}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(description)}
            </p>
        </button>
    );
};

// Flashcard Viewer Component
const FlashcardViewer = ({ preferences }: { preferences: UserPreferences }) => {
    const { t, dir } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [cards, setCards] = useState<Flashcard[]>([]);

    const generateFlashcards = useCallback(async (isInitial: boolean = false) => {
        setIsGenerating(true);
        try {
            const subjects = preferences.subjects.map(s =>
                subjectOptions.find(opt => opt.id === s)?.label || s
            ).join(', ');

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `Generate ${isInitial ? 5 : 3} flashcards for a ${preferences.experienceLevel} student studying ${subjects}. Focus on ${preferences.learningGoals.join(', ')}. Return ONLY a valid JSON array with format: [{"question": "...", "answer": "...", "topic": "..."}]. No other text.`,
                    systemPrompt: 'You are an educational AI. OUTPUT ONLY RAW JSON. NO MARKDOWN. NO BACKTICKS.',
                }),
            });
            const data = await response.json();
            if (data.success) {
                try {
                    const jsonMatch = data.response.match(/\[[\s\S]*\]/);
                    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : data.response);
                    const newCards = parsed.map((c: Flashcard, i: number) => ({
                        ...c,
                        id: cards.length + i + 1,
                    }));
                    if (isInitial) {
                        setCards(newCards);
                    } else {
                        setCards([...cards, ...newCards]);
                    }
                } catch {
                    console.log('Could not parse AI response');
                }
            }
        } catch (error) {
            console.error('Error generating cards:', error);
        } finally {
            setIsGenerating(false);
            setIsInitialLoad(false);
        }
    }, [preferences, cards]);

    useEffect(() => {
        if (isInitialLoad && preferences.hasCompletedOnboarding) {
            generateFlashcards(true);
        }
    }, [isInitialLoad, preferences.hasCompletedOnboarding, generateFlashcards]);

    const currentCard = cards[currentIndex];

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 150);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 150);
    };

    if (isInitialLoad && isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">{t('flashcards.generating')}</p>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 dark:text-gray-400 mb-4">{t('flashcards.empty')}</p>
                <Button onClick={() => generateFlashcards(true)} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    {t('flashcards.generate')}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('flashcards.title').replace('{name}', preferences.name)}
                </h3>
                <Button variant="secondary" onClick={() => generateFlashcards(false)} disabled={isGenerating}>
                    {isGenerating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Plus className="w-4 h-4 mr-2" />
                    )}
                    {t('flashcards.generateMore')}
                </Button>
            </div>

            <div
                className="relative h-64 perspective-1000 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.div
                    className="w-full h-full"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className={clsx(
                        'absolute inset-0 p-6 rounded-2xl',
                        'bg-gradient-to-br from-blue-600 to-pink-600',
                        'flex flex-col justify-center items-center text-center text-white',
                        'backface-hidden'
                    )}>
                        <p className="text-xs uppercase tracking-wider opacity-70 mb-4">
                            {currentCard?.topic}
                        </p>
                        <p className="text-xl font-medium">{currentCard?.question}</p>
                        <p className="text-xs mt-4 opacity-70">{t('flashcards.clickToReveal')}</p>
                    </div>

                    <div
                        className={clsx(
                            'absolute inset-0 p-6 rounded-2xl',
                            'bg-white dark:bg-gray-800',
                            'border-2 border-blue-500',
                            'flex flex-col justify-center items-center text-center',
                            'backface-hidden'
                        )}
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <p className="text-gray-900 dark:text-white">{currentCard?.answer}</p>
                    </div>
                </motion.div>
            </div>

            <div className="flex items-center justify-between">
                <Button variant="secondary" onClick={prevCard}>
                    <ArrowLeft className={clsx("w-4 h-4", dir === 'rtl' ? 'ml-2' : 'mr-2')} />
                    {t('flashcards.previous')}
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {currentIndex + 1} / {cards.length}
                </span>
                <Button variant="secondary" onClick={nextCard}>
                    {t('flashcards.next')}
                    <ArrowRight className={clsx("w-4 h-4", dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2')} />
                </Button>
            </div>
        </div>
    );
};

// Quiz Viewer Component
const QuizViewer = ({ preferences }: { preferences: UserPreferences }) => {
    const { t, dir } = useLanguage();
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isGenerating, setIsGenerating] = useState(true);

    const generateQuiz = useCallback(async () => {
        setIsGenerating(true);
        try {
            const subjects = preferences.subjects.map(s =>
                subjectOptions.find(opt => opt.id === s)?.label || s
            ).join(', ');

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `Create 5 multiple choice quiz questions for a ${preferences.experienceLevel} student studying ${subjects}. Goals: ${preferences.learningGoals.join(', ')}. Return ONLY valid JSON array: [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..."}]. correctAnswer is 0-indexed. No other text.`,
                    systemPrompt: 'You are an educational AI. OUTPUT ONLY RAW JSON. NO MARKDOWN. NO BACKTICKS.',
                }),
            });
            const data = await response.json();
            if (data.success) {
                try {
                    const jsonMatch = data.response.match(/\[[\s\S]*\]/);
                    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : data.response);
                    setQuestions(parsed.map((q: QuizQuestion, i: number) => ({ ...q, id: i + 1 })));
                } catch {
                    console.log('Could not parse quiz response');
                }
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [preferences]);

    useEffect(() => {
        if (preferences.hasCompletedOnboarding) {
            generateQuiz();
        }
    }, [preferences.hasCompletedOnboarding, generateQuiz]);

    const handleAnswer = (optionIndex: number) => {
        if (showResult) return;
        setSelectedAnswer(optionIndex);
        setShowResult(true);
        if (optionIndex === questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setQuizCompleted(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setQuizCompleted(false);
        generateQuiz();
    };

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">{t('quiz.generating').replace('{name}', preferences.name)}</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 dark:text-gray-400 mb-4">{t('quiz.error')}</p>
                <Button onClick={generateQuiz}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('quiz.tryAgain')}
                </Button>
            </div>
        );
    }

    if (quizCompleted) {
        return (
            <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-600 to-pink-600 flex items-center justify-center">
                    <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('quiz.completedTitle').replace('{name}', preferences.name)}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {t('quiz.completedScore').replace('{score}', score.toString()).replace('{total}', questions.length.toString())}
                </p>
                <Button onClick={restartQuiz}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('quiz.tryNew')}
                </Button>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('quiz.title')}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t('quiz.questionCount').replace('{current}', (currentQuestion + 1).toString()).replace('{total}', questions.length.toString())}
                </span>
            </div>

            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-600 to-pink-600 transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    {question.question}
                </p>

                <div className="space-y-3">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={showResult}
                            className={clsx(
                                'w-full p-4 rounded-xl text-left transition-all duration-200',
                                'border-2',
                                showResult && index === question.correctAnswer && 'border-green-500 bg-green-50 dark:bg-green-900/20',
                                showResult && selectedAnswer === index && index !== question.correctAnswer && 'border-red-500 bg-red-50 dark:bg-red-900/20',
                                !showResult && 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20',
                                selectedAnswer === index && !showResult && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-gray-900 dark:text-white">{option}</span>
                                {showResult && index === question.correctAnswer && (
                                    <Check className="w-5 h-5 text-green-500" />
                                )}
                                {showResult && selectedAnswer === index && index !== question.correctAnswer && (
                                    <X className="w-5 h-5 text-red-500" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {showResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
                    >
                        <p className="text-sm">{question.explanation}</p>
                    </motion.div>
                )}
            </div>

            {showResult && (
                <div className="flex justify-end">
                    <Button onClick={nextQuestion}>
                        {currentQuestion < questions.length - 1 ? t('quiz.nextQuestion') : t('quiz.seeResults')}
                        <ArrowRight className={clsx("w-4 h-4", dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2')} />
                    </Button>
                </div>
            )}
        </div>
    );
};

// AI Summarizer Component
const SummarizerTool = ({ preferences }: { preferences: UserPreferences }) => {
    const { t } = useLanguage();
    const [topic, setTopic] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeMode, setActiveMode] = useState<'summary' | 'explain' | 'practice'>('summary');

    const generateContent = async () => {
        if (!topic.trim()) return;

        setIsLoading(true);
        setSummary('');

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `${activeMode === 'summary' ? 'Summarize' : activeMode === 'explain' ? 'Explain in detail' : 'Create practice problems for'}: "${topic}". Adapt for a ${preferences.experienceLevel} level ${preferences.learningStyle === 'visual' ? 'visual learner - use bullet points and structure' : preferences.learningStyle === 'hands-on' ? 'hands-on learner - include practical examples' : 'student'}.`,
                    systemPrompt: `You are an educational AI assistant helping ${preferences.name}. Their goals are: ${preferences.learningGoals.join(', ')}. Make content engaging and clear.`,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setSummary(data.response);
            } else {
                setSummary('Error generating content. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setSummary('Error generating content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('summarizer.title')}
                </h3>
                <div className="flex gap-2">
                    {[
                        { id: 'summary' as const, label: 'summarizer.mode.summarize' },
                        { id: 'explain' as const, label: 'summarizer.mode.explain' },
                        { id: 'practice' as const, label: 'summarizer.mode.practice' },
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setActiveMode(mode.id)}
                            className={clsx(
                                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                                activeMode === mode.id
                                    ? 'bg-gradient-to-r from-blue-600 to-pink-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            )}
                        >
                            {t(mode.label)}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('summarizer.personalizedFor').replace('{name}', preferences.name).replace('{level}', preferences.experienceLevel).replace('{style}', preferences.learningStyle)}
            </p>

            <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                    activeMode === 'summary'
                        ? t('summarizer.placeholder.summary')
                        : activeMode === 'explain'
                            ? t('summarizer.placeholder.explain')
                            : t('summarizer.placeholder.practice')
                }
                className="w-full h-32 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />

            <Button onClick={generateContent} disabled={isLoading || !topic.trim()}>
                {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isLoading ? t('summarizer.button.generating') : `${t('summarizer.button.generate')} ${activeMode === 'summary' ? t('summarizer.mode.summarize') : activeMode === 'explain' ? t('summarizer.mode.explain') : t('summarizer.mode.practice')}`}
            </Button>

            {summary && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 border border-blue-100 dark:border-blue-800"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            {t('summarizer.resultTitle')}
                        </h4>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {summary}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// AI-Powered Course Recommendations - Recommends 3 real courses from database
// AI-Powered Course Recommendations - Recommends 3 real courses from database
const PersonalizedLearningPaths = ({ preferences }: { preferences: UserPreferences }) => {
    const { t, dir } = useLanguage();
    const [availableCourses, setAvailableCourses] = useState<any[]>([]);
    const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiReason, setAiReason] = useState<Record<string, string>>({});

    // Fetch all available courses first
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/courses/available');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched available courses:', data.length, 'courses');
                    setAvailableCourses(data);
                } else {
                    setError('Failed to load courses');
                }
            } catch (err) {
                console.error('Failed to fetch courses:', err);
                setError('Failed to connect to server');
            }
        };
        fetchCourses();
    }, []);

    // Use AI to recommend courses when we have courses and preferences
    useEffect(() => {
        const generateRecommendations = async () => {
            if (availableCourses.length === 0 || !preferences.hasCompletedOnboarding) {
                setIsLoading(false);
                return;
            }

            setIsGenerating(true);
            setError(null);

            try {
                const subjects = preferences.subjects.map(s =>
                    subjectOptions.find(opt => opt.id === s)?.label || s
                ).join(', ');

                const courseList = availableCourses.map((c, i) =>
                    `${i + 1}. "${c.title}" (Category: ${c.category}, Price: $${c.price}, Students: ${c._count?.enrollments || 0})`
                ).join('\n');

                const response = await fetch('/api/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: `You are a course recommendation AI. A student named ${preferences.name} has the following profile:
- Interests: ${subjects}
- Goals: ${preferences.learningGoals.join(', ')}
- Experience Level: ${preferences.experienceLevel}
- Weekly Study Time: ${preferences.weeklyHours}

Here are ALL available courses in our database:
${courseList}

TASK: Select exactly 3 courses from THIS LIST that best match this student's profile.

Return ONLY a JSON array with this format:
[
  {"courseIndex": 1, "reason": "Brief explanation why this course fits the student"},
  {"courseIndex": 2, "reason": "Brief explanation"},
  {"courseIndex": 3, "reason": "Brief explanation"}
]

RULES:
- courseIndex must be the number from the list above (1-${availableCourses.length})
- Pick courses that match their interests and experience level
- Return ONLY valid JSON, no markdown`,
                        systemPrompt: 'You are a course recommendation AI. OUTPUT ONLY RAW JSON. NO MARKDOWN. NO BACKTICKS.',
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    console.log('AI Response:', data.response);

                    // Parse AI response
                    let cleanJson = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
                    const firstBracket = cleanJson.indexOf('[');
                    const lastBracket = cleanJson.lastIndexOf(']');

                    if (firstBracket !== -1 && lastBracket !== -1) {
                        cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
                    }

                    const recommendations = JSON.parse(cleanJson);

                    // Map recommendations to actual courses
                    const recommended: any[] = [];
                    const reasons: Record<string, string> = {};

                    for (const rec of recommendations) {
                        const courseIndex = rec.courseIndex - 1; // Convert to 0-based index
                        if (courseIndex >= 0 && courseIndex < availableCourses.length) {
                            const course = availableCourses[courseIndex];
                            recommended.push(course);
                            reasons[course.id] = rec.reason;
                        }
                    }

                    setRecommendedCourses(recommended.slice(0, 3)); // Ensure max 3
                    setAiReason(reasons);
                } else {
                    throw new Error(data.error || 'Failed to get recommendations');
                }
            } catch (err) {
                console.error('AI Recommendation error:', err);
                // Fallback: just show first 3 courses
                setRecommendedCourses(availableCourses.slice(0, 3));
                setError('AI recommendations unavailable. Showing popular courses.');
            } finally {
                setIsLoading(false);
                setIsGenerating(false);
            }
        };

        generateRecommendations();
    }, [availableCourses, preferences]);

    const regenerateRecommendations = () => {
        setIsLoading(true);
        setRecommendedCourses([]);
        // Re-trigger by updating a dummy state or just re-run the effect
        const fetchAndRecommend = async () => {
            // Re-fetch to get latest courses
            try {
                const response = await fetch('/api/courses/available');
                if (response.ok) {
                    const data = await response.json();
                    setAvailableCourses([...data]); // This will trigger the useEffect
                }
            } catch (err) {
                setError('Failed to refresh recommendations');
                setIsLoading(false);
            }
        };
        fetchAndRecommend();
    };

    if (isLoading || isGenerating) {
        return (
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        {isGenerating ? t('recommendations.loading').replace('{name}', preferences.name) : t('common.loading')}
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <>
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('recommendations.title')}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('recommendations.subtitle').replace('{name}', preferences.name)}</p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={regenerateRecommendations}
                        disabled={isGenerating}
                    >
                        <RefreshCw className={clsx("w-4 h-4 mr-2", isGenerating && "animate-spin")} />
                        {t('recommendations.getNewPicks')}
                    </Button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-sm">
                        {error}
                    </div>
                )}

                {recommendedCourses.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">{t('recommendations.noCourses')}</p>
                        <Button onClick={() => window.location.href = '/dashboard/courses'}>
                            {t('recommendations.browseAll')}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendedCourses.map((course, index) => {
                            const colors = ['#3B82F6', '#EC4899', '#10B981'];
                            const color = colors[index % colors.length];

                            return (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer group border border-gray-200/50 dark:border-gray-700/50"
                                    onClick={() => setSelectedCourse(course)}
                                >
                                    {/* Rank Badge */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                                            style={{ backgroundColor: color }}
                                        >
                                            #{index + 1}
                                        </div>
                                        {course.isEnrolled ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                                {t('recommendations.enrolled')}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                ${course.price}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                                        {course.description}
                                    </p>

                                    {/* AI Reason */}
                                    {aiReason[course.id] && (
                                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 mb-3">
                                            <div className="flex items-start gap-2">
                                                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                                    {aiReason[course.id]}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            {course._count?.enrollments || 0} {t('recommendations.students')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" />
                                            {course._count?.lessons || 0} {t('recommendations.lessons')}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* View All Link */}
                {recommendedCourses.length > 0 && (
                    <div className="mt-6 text-center">
                        <Button
                            variant="secondary"
                            onClick={() => window.location.href = '/dashboard/courses'}
                        >
                            {t('recommendations.viewAll').replace('{count}', availableCourses.length.toString())}
                            <ChevronRight className={clsx("w-4 h-4", dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2')} />
                        </Button>
                    </div>
                )}
            </Card>

            {/* Course Detail Modal */}
            <AnimatePresence>
                {selectedCourse && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setSelectedCourse(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-pink-100 dark:from-blue-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                            <GraduationCap className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCourse.title}</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCourse.category}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCourse(null)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <p className="text-gray-600 dark:text-gray-300">
                                    {selectedCourse.description}
                                </p>

                                {aiReason[selectedCourse.id] && (
                                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20">
                                        <div className="flex items-start gap-3">
                                            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">{t('recommendations.whyThisCourse')}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {aiReason[selectedCourse.id]}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Star className="w-4 h-4" />
                                        {selectedCourse._count?.enrollments || 0} students enrolled
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        {selectedCourse._count?.lessons || 0} lessons
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-blue-100 dark:from-pink-900/30 dark:to-blue-900/30 flex items-center justify-center">
                                        <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
                                            {selectedCourse.teacher?.name?.charAt(0) || 'T'}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedCourse.teacher?.name || t('recommendations.unknownTeacher')}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    {selectedCourse.isEnrolled ? (
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700"
                                            onClick={() => window.location.href = '/dashboard/courses'}
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            {t('recommendations.alreadyEnrolled')}
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700"
                                            onClick={() => window.location.href = '/dashboard/courses'}
                                        >
                                            {t('recommendations.enrollNow')} - ${selectedCourse.price}
                                            <ChevronRight className={clsx("w-4 h-4", dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2')} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};



// Main Component
export default function LearningHubPage() {
    const { t } = useLanguage();
    const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTool, setActiveTool] = useState<string | null>('assistant');

    // Load preferences from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(PREFERENCES_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setPreferences(parsed);
                setShowOnboarding(!parsed.hasCompletedOnboarding);
            } catch {
                setShowOnboarding(true);
            }
        } else {
            setShowOnboarding(true);
        }
        setIsLoading(false);
    }, []);

    // Save preferences
    const handleOnboardingComplete = (prefs: UserPreferences) => {
        setPreferences(prefs);
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
        setShowOnboarding(false);
    };

    const aiTools = [
        {
            id: 'assistant',
            icon: Sparkles,
            name: 'aiTool.assistant.name',
            description: 'aiTool.assistant.desc',
            color: 'from-blue-500 to-purple-500',
        },
        {
            id: 'flashcards',
            icon: Zap,
            name: 'aiTool.flashcards.name',
            description: 'aiTool.flashcards.desc',
            color: 'from-pink-500 to-orange-500',
        },
        {
            id: 'quiz',
            icon: FileText,
            name: 'aiTool.quiz.name',
            description: 'aiTool.quiz.desc',
            color: 'from-green-500 to-teal-500',
        },
        {
            id: 'summary',
            icon: Video,
            name: 'aiTool.summarizer.name',
            description: 'aiTool.summarizer.desc',
            color: 'from-purple-500 to-indigo-500',
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <>
            {/* Onboarding Modal */}
            <AnimatePresence>
                {showOnboarding && (
                    <OnboardingModal
                        onComplete={handleOnboardingComplete}
                        initialPreferences={preferences}
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
                    className="flex items-start justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                            {preferences.hasCompletedOnboarding ? `${t('learningHub.title.welcomeBack')} ${preferences.name}!` : t('learningHub.title.generic')}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {preferences.hasCompletedOnboarding
                                ? t('learningHub.subtitle.personal').replace('{level}', preferences.experienceLevel.toLowerCase()).replace('{hours}', preferences.weeklyHours)
                                : t('learningHub.subtitle.generic')}
                        </p>
                    </div>
                    {preferences.hasCompletedOnboarding && (
                        <Button
                            variant="secondary"
                            onClick={() => setShowOnboarding(true)}
                        >
                            <GraduationCap className="w-4 h-4 mr-2" />
                            {t('learningHub.updatePreferences')}
                        </Button>
                    )}
                </motion.div>

                {/* AI Tools Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {aiTools.map((tool) => (
                        <AIToolCard
                            key={tool.id}
                            icon={tool.icon}
                            name={tool.name}
                            description={tool.description}
                            color={tool.color}
                            onClick={() => setActiveTool(tool.id)}
                            isActive={activeTool === tool.id}
                        />
                    ))}
                </motion.div>

                {/* Active Tool Content */}
                <AnimatePresence mode="wait">
                    {activeTool && preferences.hasCompletedOnboarding && (
                        <motion.div
                            key={activeTool}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                                {activeTool === 'assistant' && (
                                    <div className="h-[400px]">
                                        <AIChat
                                            embedded
                                            title={`AI Study Assistant for ${preferences.name}`}
                                            placeholder="Ask me anything about your studies..."
                                        />
                                    </div>
                                )}
                                {activeTool === 'flashcards' && (
                                    <FlashcardViewer preferences={preferences} />
                                )}
                                {activeTool === 'quiz' && (
                                    <QuizViewer preferences={preferences} />
                                )}
                                {activeTool === 'summary' && (
                                    <SummarizerTool preferences={preferences} />
                                )}
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Personalized Learning Paths */}
                {preferences.hasCompletedOnboarding && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <PersonalizedLearningPaths preferences={preferences} />
                    </motion.div>
                )}
            </motion.div>
        </>
    );
}
