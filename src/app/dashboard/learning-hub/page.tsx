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
    { id: 'visual', label: 'Visual', desc: 'I learn best with videos and diagrams' },
    { id: 'reading', label: 'Reading/Writing', desc: 'I prefer articles and notes' },
    { id: 'hands-on', label: 'Hands-on', desc: 'I learn by doing and practicing' },
    { id: 'mixed', label: 'Mixed', desc: 'A combination of all styles' },
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
                            {step === 1 && "Welcome to AI Learning Hub!"}
                            {step === 2 && "What do you want to learn?"}
                            {step === 3 && "What are your goals?"}
                            {step === 4 && "How do you learn best?"}
                            {step === 5 && "Almost there!"}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            {step === 1 && "Let's personalize your learning experience"}
                            {step === 2 && "Select all subjects that interest you"}
                            {step === 3 && "Choose your learning objectives"}
                            {step === 4 && "We'll adapt content to your style"}
                            {step === 5 && "Just a couple more preferences"}
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
                            {/* Step 1: Name */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        What should we call you?
                                    </label>
                                    <input
                                        type="text"
                                        value={prefs.name}
                                        onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-lg"
                                        autoFocus
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        This helps us personalize your learning experience
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
                                                {style.label}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {style.desc}
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
                                            Your experience level
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
                                            Weekly study time
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
                            <ArrowLeft className="w-4 h-4" />
                            Back
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
                            {step === totalSteps ? 'Get Started' : 'Continue'}
                            {step < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
                            {step === totalSteps && <Sparkles className="w-4 h-4 ml-2" />}
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
}) => (
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
            {name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
        </p>
    </button>
);

// Flashcard Viewer Component
const FlashcardViewer = ({ preferences }: { preferences: UserPreferences }) => {
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
                    systemPrompt: 'You are an educational AI. Return ONLY valid JSON array, no markdown, no explanation.',
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
                <p className="text-gray-500 dark:text-gray-400">Generating personalized flashcards...</p>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No flashcards yet</p>
                <Button onClick={() => generateFlashcards(true)} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Generate Flashcards
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI-Generated Flashcards for {preferences.name}
                </h3>
                <Button variant="secondary" onClick={() => generateFlashcards(false)} disabled={isGenerating}>
                    {isGenerating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Plus className="w-4 h-4 mr-2" />
                    )}
                    Generate More
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
                        <p className="text-xs mt-4 opacity-70">Click to reveal answer</p>
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
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {currentIndex + 1} / {cards.length}
                </span>
                <Button variant="secondary" onClick={nextCard}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};

// Quiz Viewer Component
const QuizViewer = ({ preferences }: { preferences: UserPreferences }) => {
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
                    systemPrompt: 'You are an educational AI. Return ONLY valid JSON array, no markdown.',
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
                <p className="text-gray-500 dark:text-gray-400">Generating personalized quiz for {preferences.name}...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Could not generate quiz</p>
                <Button onClick={generateQuiz}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
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
                    Great job, {preferences.name}!
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    You scored {score} out of {questions.length}
                </p>
                <Button onClick={restartQuiz}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try New Quiz
                </Button>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Personalized Quiz
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Question {currentQuestion + 1} of {questions.length}
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
                        {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );
};

// AI Summarizer Component
const SummarizerTool = ({ preferences }: { preferences: UserPreferences }) => {
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
                    AI Content Generator
                </h3>
                <div className="flex gap-2">
                    {[
                        { id: 'summary' as const, label: 'Summarize' },
                        { id: 'explain' as const, label: 'Explain' },
                        { id: 'practice' as const, label: 'Practice' },
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
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
                Content personalized for {preferences.name} ({preferences.experienceLevel} level, {preferences.learningStyle} learner)
            </p>

            <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                    activeMode === 'summary'
                        ? "Enter a topic to summarize..."
                        : activeMode === 'explain'
                            ? "Enter a concept to explain..."
                            : "Enter a subject for practice problems..."
                }
                className="w-full h-32 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />

            <Button onClick={generateContent} disabled={isLoading || !topic.trim()}>
                {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Generating...' : `Generate ${activeMode === 'summary' ? 'Summary' : activeMode === 'explain' ? 'Explanation' : 'Practice Problems'}`}
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
                            AI Generated Content
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

// Learning Paths Component
const PersonalizedLearningPaths = ({ preferences }: { preferences: UserPreferences }) => {
    const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
    const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
    const [isGenerating, setIsGenerating] = useState(true);

    const generatePaths = useCallback(async () => {
        setIsGenerating(true);
        try {
            const subjects = preferences.subjects.map(s =>
                subjectOptions.find(opt => opt.id === s)?.label || s
            ).join(', ');

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `Create 3 personalized learning paths for a ${preferences.experienceLevel} student interested in ${subjects}. Goals: ${preferences.learningGoals.join(', ')}. Weekly time: ${preferences.weeklyHours}. Return ONLY valid JSON array: [{"title": "...", "description": "...", "duration": "X hours", "level": "${preferences.experienceLevel}", "lessons": [{"title": "...", "duration": "XX min", "content": "Brief description..."}]}]. Include 4-5 lessons per path. No other text.`,
                    systemPrompt: 'You are an educational AI. Return ONLY valid JSON array, no markdown.',
                }),
            });
            const data = await response.json();
            if (data.success) {
                try {
                    const jsonMatch = data.response.match(/\[[\s\S]*\]/);
                    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : data.response);
                    const colors = ['#3B82F6', '#EC4899', '#10B981'];
                    const icons = [Brain, TrendingUp, FileText];
                    setLearningPaths(parsed.map((p: LearningPath, i: number) => ({
                        ...p,
                        id: i + 1,
                        color: colors[i % colors.length],
                        icon: icons[i % icons.length],
                        progress: 0,
                        lessons: p.lessons.map((l: Lesson, j: number) => ({
                            ...l,
                            id: j + 1,
                            completed: false,
                        })),
                    })));
                } catch {
                    console.log('Could not parse learning paths');
                }
            }
        } catch (error) {
            console.error('Error generating paths:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [preferences]);

    useEffect(() => {
        if (preferences.hasCompletedOnboarding) {
            generatePaths();
        }
    }, [preferences.hasCompletedOnboarding, generatePaths]);

    if (isGenerating) {
        return (
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Creating personalized learning paths for {preferences.name}...</p>
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
                            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Learning Paths</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">AI-curated for {preferences.name}</p>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={generatePaths} disabled={isGenerating}>
                        <RefreshCw className={clsx("w-4 h-4 mr-2", isGenerating && "animate-spin")} />
                        Regenerate
                    </Button>
                </div>

                {learningPaths.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No learning paths generated yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {learningPaths.map((path) => (
                            <motion.div
                                key={path.id}
                                whileHover={{ scale: 1.02 }}
                                className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer group"
                                onClick={() => setSelectedPath(path)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${path.color}20` }}
                                    >
                                        <path.icon className="w-6 h-6" style={{ color: path.color }} />
                                    </div>
                                    <span className={clsx(
                                        'px-2 py-1 rounded-full text-xs font-medium',
                                        path.level === 'Beginner' && 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                                        path.level === 'Intermediate' && 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
                                        path.level === 'Advanced' && 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
                                    )}>
                                        {path.level}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {path.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {path.description}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" />
                                        {path.lessons.length} lessons
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {path.duration}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Path Detail Modal */}
            <AnimatePresence>
                {selectedPath && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                            style={{ backgroundColor: `${selectedPath.color}20` }}
                                        >
                                            <selectedPath.icon className="w-7 h-7" style={{ color: selectedPath.color }} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedPath.title}</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedPath.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPath(null)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                <div className="space-y-3">
                                    {selectedPath.lessons.map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center gap-4"
                                        >
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                    <Clock className="w-3 h-3" />
                                                    {lesson.duration}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    ))}
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
            name: 'AI Study Assistant',
            description: 'Get instant answers to your study questions',
            color: 'from-blue-500 to-purple-500',
        },
        {
            id: 'flashcards',
            icon: Zap,
            name: 'Smart Flashcards',
            description: 'AI-generated flashcards for efficient learning',
            color: 'from-pink-500 to-orange-500',
        },
        {
            id: 'quiz',
            icon: FileText,
            name: 'Practice Quizzes',
            description: 'Adaptive quizzes that match your level',
            color: 'from-green-500 to-teal-500',
        },
        {
            id: 'summary',
            icon: Video,
            name: 'AI Summarizer',
            description: 'Get concise summaries of complex topics',
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
                            {preferences.hasCompletedOnboarding ? `Welcome back, ${preferences.name}!` : 'AI Learning Hub'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {preferences.hasCompletedOnboarding
                                ? `Personalized ${preferences.experienceLevel.toLowerCase()} learning • ${preferences.weeklyHours}/week`
                                : 'Personalized learning powered by artificial intelligence'}
                        </p>
                    </div>
                    {preferences.hasCompletedOnboarding && (
                        <Button
                            variant="secondary"
                            onClick={() => setShowOnboarding(true)}
                        >
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Update Preferences
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
