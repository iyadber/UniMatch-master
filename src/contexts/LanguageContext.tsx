'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ar' | 'fr';

interface Translations {
    [key: string]: {
        en: string;
        ar: string;
        fr: string;
    };
}

// Add translations here
export const translations: Translations = {
    // Navigation
    'nav.dashboard': {
        en: 'Dashboard',
        ar: 'لوحة التحكم',
        fr: 'Tableau de bord',
    },
    'nav.aiLearningHub': {
        en: 'AI Learning Hub',
        ar: 'مركز التعلم الذكي',
        fr: 'Hub d\'apprentissage IA',
    },
    'nav.findPhDTutor': {
        en: 'Find a PhD Tutor',
        ar: 'ابحث عن مدرس دكتوراه',
        fr: 'Trouver un tuteur PhD',
    },
    'nav.aiChatTutor': {
        en: 'AI Chat Tutor',
        ar: 'مدرس الدردشة الذكي',
        fr: 'Tuteur Chat IA',
    },
    'nav.careerBoost': {
        en: 'Career Boost',
        ar: 'تعزيز المسار المهني',
        fr: 'Boost Carrière',
    },
    'nav.messages': {
        en: 'Messages',
        ar: 'الرسائل',
        fr: 'Messages',
    },
    'nav.calendar': {
        en: 'Calendar',
        ar: 'التقويم',
        fr: 'Calendrier',
    },
    'nav.courses': {
        en: 'Courses',
        ar: 'الدورات',
        fr: 'Cours',
    },
    'nav.settings': {
        en: 'Settings',
        ar: 'الإعدادات',
        fr: 'Paramètres',
    },
    // Student Dashboard
    'student.myModules': {
        en: 'My Modules',
        ar: 'وحداتي',
        fr: 'Mes Modules',
    },
    'student.aiStudyAssistant': {
        en: 'AI Study Assistant',
        ar: 'مساعد الدراسة الذكي',
        fr: 'Assistant d\'étude IA',
    },
    'student.myPerformance': {
        en: 'My Performance',
        ar: 'أدائي',
        fr: 'Ma Performance',
    },
    'student.recommendedTutors': {
        en: 'Recommended Tutors',
        ar: 'المعلمون الموصى بهم',
        fr: 'Tuteurs Recommandés',
    },
    // Tutor Dashboard
    'tutor.myBookings': {
        en: 'My Bookings',
        ar: 'حجوزاتي',
        fr: 'Mes Réservations',
    },
    'tutor.earnings': {
        en: 'Earnings',
        ar: 'الأرباح',
        fr: 'Revenus',
    },
    'tutor.studentAnalytics': {
        en: 'Student Analytics',
        ar: 'تحليلات الطلاب',
        fr: 'Analytique Étudiants',
    },
    'tutor.myRating': {
        en: 'My Rating & Feedback',
        ar: 'تقييمي والملاحظات',
        fr: 'Mon Évaluation & Retours',
    },
    // Admin Dashboard
    'admin.students': {
        en: 'Students',
        ar: 'الطلاب',
        fr: 'Étudiants',
    },
    'admin.tutors': {
        en: 'Tutors',
        ar: 'المعلمون',
        fr: 'Tuteurs',
    },
    'admin.platformAnalytics': {
        en: 'Platform Analytics',
        ar: 'تحليلات المنصة',
        fr: 'Analytique Plateforme',
    },
    'admin.aiSettings': {
        en: 'AI Settings',
        ar: 'إعدادات الذكاء الاصطناعي',
        fr: 'Paramètres IA',
    },
    // Common
    'common.signOut': {
        en: 'Sign out',
        ar: 'تسجيل الخروج',
        fr: 'Déconnexion',
    },
    'common.darkMode': {
        en: 'Dark Mode',
        ar: 'الوضع الداكن',
        fr: 'Mode Sombre',
    },
    'common.lightMode': {
        en: 'Light Mode',
        ar: 'الوضع الفاتح',
        fr: 'Mode Clair',
    },
    'common.search': {
        en: 'Search anything...',
        ar: 'ابحث عن أي شيء...',
        fr: 'Rechercher...',
    },
    'common.comingSoon': {
        en: 'Coming Soon',
        ar: 'قريباً',
        fr: 'Bientôt Disponible',
    },
    // Subtitle
    'home.subtitle': {
        en: 'An AI Ecosystem Connecting Students with PhD Researchers — Where Intelligence Finds Its Match.',
        ar: 'نظام بيئي للذكاء الاصطناعي يربط الطلاب بباحثي الدكتوراه — حيث يجد الذكاء نظيره.',
        fr: 'Un Écosystème IA Connectant les Étudiants aux Chercheurs PhD — Où l\'Intelligence Trouve Son Match.',
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        // Load saved language preference
        const savedLang = localStorage.getItem('unimatch-language') as Language;
        if (savedLang && ['en', 'ar', 'fr'].includes(savedLang)) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('unimatch-language', lang);
        // Update document direction for RTL languages
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    const t = (key: string): string => {
        const translation = translations[key];
        if (!translation) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }
        return translation[language] || translation.en || key;
    };

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
