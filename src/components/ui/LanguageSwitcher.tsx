'use client';

import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    { code: 'ar' as Language, name: 'العربية', flag: '🇸🇦' },
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
];

interface LanguageSwitcherProps {
    isCollapsed?: boolean;
}

export function LanguageSwitcher({ isCollapsed = false }: LanguageSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useLanguage();

    const currentLanguage = languages.find(l => l.code === language) || languages[0];

    if (isCollapsed) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                        'w-full flex items-center justify-center h-12 rounded-xl',
                        'text-gray-600 dark:text-gray-400',
                        'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                    )}
                >
                    <Globe className="w-5 h-5" />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className={clsx(
                                    'absolute left-full top-0 ml-2 z-50',
                                    'bg-white dark:bg-gray-800 rounded-xl shadow-lg',
                                    'border border-gray-200 dark:border-gray-700',
                                    'py-2 min-w-[160px]'
                                )}
                            >
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setIsOpen(false);
                                        }}
                                        className={clsx(
                                            'w-full flex items-center gap-3 px-4 py-2.5',
                                            'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                                            language === lang.code && 'bg-blue-50 dark:bg-blue-900/20'
                                        )}
                                    >
                                        <span className="text-lg">{lang.flag}</span>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {lang.name}
                                        </span>
                                        {language === lang.code && (
                                            <Check className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    'flex items-center gap-3 w-full px-4 py-2.5 rounded-xl',
                    'text-gray-600 dark:text-gray-400',
                    'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                )}
            >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{currentLanguage.flag} {currentLanguage.name}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={clsx(
                                'absolute bottom-full left-0 mb-2 z-50',
                                'bg-white dark:bg-gray-800 rounded-xl shadow-lg',
                                'border border-gray-200 dark:border-gray-700',
                                'py-2 w-full'
                            )}
                        >
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className={clsx(
                                        'w-full flex items-center gap-3 px-4 py-2.5',
                                        'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                                        language === lang.code && 'bg-blue-50 dark:bg-blue-900/20'
                                    )}
                                >
                                    <span className="text-lg">{lang.flag}</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {lang.name}
                                    </span>
                                    {language === lang.code && (
                                        <Check className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
