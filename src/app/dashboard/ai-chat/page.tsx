'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AIChat, AIChatHandle } from '@/components/ai/AIChat';
import {
    Sparkles,
    BookOpen,
    Brain,
    Lightbulb,
    History,
    Star,
    Trash2,
    Plus,
    MessageSquare
} from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';



// Chat session type
interface ChatSession {
    id: string;
    title: string;
    preview: string;
    date: string;
    messages: Array<{ role: string; content: string }>;
}

export default function AIChatPage() {
    const { t } = useLanguage();

    const suggestedPrompts = [
        {
            icon: BookOpen,
            title: t('aiChat.prompt.explain.title'),
            prompt: t('aiChat.prompt.explain.content'),
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Brain,
            title: t('aiChat.prompt.study.title'),
            prompt: t('aiChat.prompt.study.content'),
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: Lightbulb,
            title: t('aiChat.prompt.solve.title'),
            prompt: t('aiChat.prompt.solve.content'),
            color: 'from-orange-500 to-yellow-500',
        },
        {
            icon: Star,
            title: t('aiChat.prompt.practice.title'),
            prompt: t('aiChat.prompt.practice.content'),
            color: 'from-green-500 to-teal-500',
        },
    ];
    const chatRef = useRef<AIChatHandle>(null);
    const [chatKey, setChatKey] = useState(0); // For resetting chat
    const [chatHistory, setChatHistory] = useState<ChatSession[]>([
        {
            id: '1',
            title: 'Neural Networks Explained',
            preview: 'A neural network is a computational model inspired by...',
            date: '2 hours ago',
            messages: [],
        },
        {
            id: '2',
            title: 'Calculus Integration Help',
            preview: 'To solve integration by parts, use the formula...',
            date: 'Yesterday',
            messages: [],
        },
        {
            id: '3',
            title: 'Physics Problem Solving',
            preview: 'The kinetic energy formula is KE = 1/2 mv²...',
            date: '2 days ago',
            messages: [],
        },
    ]);

    const handlePromptClick = (prompt: string) => {
        if (chatRef.current) {
            chatRef.current.sendMessage(prompt);
        }
    };

    const handleNewChat = () => {
        setChatKey(prev => prev + 1);
    };

    const handleDeleteHistory = (id: string) => {
        setChatHistory(prev => prev.filter(chat => chat.id !== id));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[calc(100vh-8rem)]"
        >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                {/* Sidebar */}
                <div className="lg:col-span-1 flex flex-col gap-4 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                                {t('aiChat.title')}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {t('aiChat.subtitle')}
                            </p>
                        </div>
                        <Button onClick={handleNewChat} variant="secondary" className="shrink-0">
                            <Plus className="w-4 h-4 mr-1" />
                            {t('aiChat.newChat')}
                        </Button>
                    </div>

                    {/* Suggested Prompts */}
                    <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shrink-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-500" />
                            {t('aiChat.quickPrompts')}
                        </h3>
                        <div className="space-y-2">
                            {suggestedPrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePromptClick(prompt.prompt)}
                                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200 text-left group hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            'w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br shrink-0',
                                            prompt.color,
                                            'group-hover:scale-110 group-hover:shadow-lg transition-all duration-200'
                                        )}>
                                            <prompt.icon className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {prompt.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                {prompt.prompt}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Chat History */}
                    <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 flex-1 overflow-hidden flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 shrink-0">
                            <History className="w-4 h-4 text-gray-500" />
                            {t('aiChat.recentChats')}
                        </h3>
                        <div className="space-y-2 overflow-y-auto flex-1">
                            {chatHistory.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">{t('aiChat.noHistory')}</p>
                                </div>
                            ) : (
                                chatHistory.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className="group relative p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                                    >
                                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 pr-6">
                                            {chat.title}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                                            {chat.preview}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            {chat.date}
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteHistory(chat.id);
                                            }}
                                            className="absolute right-2 top-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* Features */}
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 border-0 shrink-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            ✨ {t('aiChat.capabilities')}
                        </h3>
                        <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                {t('aiChat.cap.explanations')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                                {t('aiChat.cap.practice')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                {t('aiChat.cap.studyPlan')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                {t('aiChat.cap.visualization')}
                            </li>
                        </ul>
                    </Card>
                </div>

                {/* Main Chat Area */}
                <div className="lg:col-span-3 h-full min-h-0">
                    <Card className="h-full p-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                        <AIChat
                            key={chatKey}
                            ref={chatRef}
                            embedded
                            title={t('aiChat.chat.title')}
                            placeholder={t('aiChat.chat.placeholder')}
                        />
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
