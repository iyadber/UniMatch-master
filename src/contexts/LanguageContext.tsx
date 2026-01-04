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
        fr: 'Hub d\'IA',
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
    'nav.profileSettings': {
        en: 'Profile Settings',
        ar: 'إعدادات',
        fr: 'Paramètres',
    },
    'nav.section.student': {
        en: 'Student Dashboard',
        ar: 'لوحة تحكم الطالب',
        fr: 'Tableau de bord étudiant',
    },
    'nav.section.tutor': {
        en: 'Tutor Dashboard',
        ar: 'لوحة تحكم المعلم',
        fr: 'Tableau de bord tuteur',
    },
    'nav.section.admin': {
        en: 'Admin Dashboard',
        ar: 'لوحة تحكم المسؤول',
        fr: 'Tableau de bord admin',
    },
    'nav.section.other': {
        en: 'Other',
        ar: 'أخرى',
        fr: 'Autre',
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
    // Admin Dashboard Pages
    'admin.dashboard.title': {
        en: 'Admin Dashboard',
        ar: 'لوحة تحكم المسؤول',
        fr: 'Tableau de bord Admin',
    },
    'admin.dashboard.subtitle': {
        en: 'Manage platform users, analytics, and AI configuration',
        ar: 'إدارة مستخدمي المنصة والتحليلات وإعدادات الذكاء الاصطناعي',
        fr: 'Gérer les utilisateurs, l\'analytique et la configuration IA',
    },
    'admin.stats.totalStudents': {
        en: 'Total Students',
        ar: 'إجمالي الطلاب',
        fr: 'Total Étudiants',
    },
    'admin.stats.activeTutors': {
        en: 'Active Tutors',
        ar: 'المعلمون النشطون',
        fr: 'Tuteurs Actifs',
    },
    'admin.stats.totalRevenue': {
        en: 'Total Revenue',
        ar: 'إجمالي الإيرادات',
        fr: 'Revenu Total',
    },
    'admin.stats.aiCalls': {
        en: 'AI API Calls',
        ar: 'مكالمات API للذكاء الاصطناعي',
        fr: 'Appels API IA',
    },
    'admin.tabs.analytics': {
        en: 'Platform Analytics',
        ar: 'تحليلات المنصة',
        fr: 'Analytique Plateforme',
    },
    'admin.tabs.students': {
        en: 'Students',
        ar: 'الطلاب',
        fr: 'Étudiants',
    },
    'admin.tabs.tutors': {
        en: 'Tutors',
        ar: 'المعلمون',
        fr: 'Tuteurs',
    },
    'admin.tabs.aiSettings': {
        en: 'AI Settings',
        ar: 'إعدادات الذكاء الاصطناعي',
        fr: 'Paramètres IA',
    },
    'admin.charts.platformGrowth': {
        en: 'Platform Growth',
        ar: 'نمو المنصة',
        fr: 'Croissance de la Plateforme',
    },
    'admin.charts.platformGrowthDesc': {
        en: 'Users, sessions, and revenue trends',
        ar: 'اتجاهات المستخدمين والجلسات والإيرادات',
        fr: 'Tendances utilisateurs, sessions et revenus',
    },
    'admin.charts.userDistribution': {
        en: 'User Distribution',
        ar: 'توزيع المستخدمين',
        fr: 'Distribution des Utilisateurs',
    },
    'admin.charts.byUserType': {
        en: 'By user type',
        ar: 'حسب نوع المستخدم',
        fr: 'Par type d\'utilisateur',
    },
    'admin.students.title': {
        en: 'Students Management',
        ar: 'إدارة الطلاب',
        fr: 'Gestion des Étudiants',
    },
    'admin.students.desc': {
        en: 'View and manage student accounts',
        ar: 'عرض وإدارة حسابات الطلاب',
        fr: 'Voir et gérer les comptes étudiants',
    },
    'admin.students.searchPlaceholder': {
        en: 'Search students...',
        ar: 'البحث عن الطلاب...',
        fr: 'Rechercher des étudiants...',
    },
    'admin.students.table.student': {
        en: 'Student',
        ar: 'الطالب',
        fr: 'Étudiant',
    },
    'admin.students.table.email': {
        en: 'Email',
        ar: 'البريد الإلكتروني',
        fr: 'E-mail',
    },
    'admin.students.table.courses': {
        en: 'Courses',
        ar: 'الدورات',
        fr: 'Cours',
    },
    'admin.students.table.joined': {
        en: 'Joined',
        ar: 'انضم',
        fr: 'Rejoint',
    },
    'admin.students.table.status': {
        en: 'Status',
        ar: 'الحالة',
        fr: 'Statut',
    },
    'admin.students.table.actions': {
        en: 'Actions',
        ar: 'الإجراءات',
        fr: 'Actions',
    },
    'admin.tutors.title': {
        en: 'Tutors Management',
        ar: 'إدارة المعلمين',
        fr: 'Gestion des Tuteurs',
    },
    'admin.tutors.desc': {
        en: 'Manage tutor accounts and verification',
        ar: 'إدارة حسابات المعلمين والتحقق',
        fr: 'Gérer les comptes tuteurs et la vérification',
    },
    'admin.tutors.pendingApprovals': {
        en: 'Pending Approvals',
        ar: 'موافقات معلقة',
        fr: 'Approbations en attente',
    },
    'admin.tutors.table.tutor': {
        en: 'Tutor',
        ar: 'المعلم',
        fr: 'Tuteur',
    },
    'admin.tutors.table.students': {
        en: 'Students',
        ar: 'الطلاب',
        fr: 'Étudiants',
    },
    'admin.tutors.table.rating': {
        en: 'Rating',
        ar: 'التقييم',
        fr: 'Évaluation',
    },
    'admin.tutors.table.earnings': {
        en: 'Earnings',
        ar: 'الأرباح',
        fr: 'Revenus',
    },
    'admin.ai.config.title': {
        en: 'AI Configuration',
        ar: 'تكوين الذكاء الاصطناعي',
        fr: 'Configuration IA',
    },
    'admin.ai.config.desc': {
        en: 'Gemini model settings',
        ar: 'إعدادات نموذج Gemini',
        fr: 'Paramètres du modèle Gemini',
    },
    'admin.ai.model': {
        en: 'Model',
        ar: 'النموذج',
        fr: 'Modèle',
    },
    'admin.ai.temperature': {
        en: 'Temperature',
        ar: 'درجة الحرارة',
        fr: 'Température',
    },
    'admin.ai.tempDesc': {
        en: 'Higher values make output more random',
        ar: 'القيم الأعلى تجعل المخرجات أكثر عشوائية',
        fr: 'Des valeurs plus élevées rendent la sortie plus aléatoire',
    },
    'admin.ai.maxTokens': {
        en: 'Max Output Tokens',
        ar: 'الحد الأقصى لرموز الإخراج',
        fr: 'Jetons de sortie max',
    },
    'admin.ai.features.title': {
        en: 'AI Features',
        ar: 'ميزات الذكاء الاصطناعي',
        fr: 'Fonctionnalités IA',
    },
    'admin.ai.features.desc': {
        en: 'Enable/disable AI features',
        ar: 'تمكين/تعطيل ميزات الذكاء الاصطناعي',
        fr: 'Activer/désactiver les fonctionnalités IA',
    },
    'admin.ai.features.studyAssistant': {
        en: 'AI Study Assistant',
        ar: 'مساعد الدراسة الذكي',
        fr: 'Assistant d\'étude IA',
    },
    'admin.ai.features.studyAssistantDesc': {
        en: 'Chat-based learning assistance for students',
        ar: 'مساعدة تعليمية قائمة على الدردشة للطلاب',
        fr: 'Assistance d\'apprentissage par chat pour les étudiants',
    },
    'admin.ai.features.tutorMatching': {
        en: 'Tutor Matching',
        ar: 'مطابقة المعلمين',
        fr: 'Jumelage de tuteurs',
    },
    'admin.ai.features.tutorMatchingDesc': {
        en: 'AI-powered tutor recommendations',
        ar: 'توصيات المعلمين المدعومة بالذكاء الاصطناعي',
        fr: 'Recommandations de tuteurs alimentées par l\'IA',
    },
    'admin.ai.features.contentModeration': {
        en: 'Content Moderation',
        ar: 'إشراف المحتوى',
        fr: 'Modération de contenu',
    },
    'admin.ai.features.contentModerationDesc': {
        en: 'Automatic content safety checks',
        ar: 'فحوصات سلامة المحتوى التلقائية',
        fr: 'Vérifications automatiques de sécurité du contenu',
    },
    'admin.ai.usage.title': {
        en: 'API Usage',
        ar: 'استخدام API',
        fr: 'Utilisation API',
    },
    'admin.ai.usage.today': {
        en: 'Today',
        ar: 'اليوم',
        fr: 'Aujourd\'hui',
    },
    'admin.ai.usage.thisMonth': {
        en: 'This Month',
        ar: 'هذا الشهر',
        fr: 'Ce mois-ci',
    },
    'admin.ai.usage.limitUsed': {
        en: 'of monthly limit used',
        ar: 'من الحد الشهري المستخدم',
        fr: 'de la limite mensuelle utilisée',
    },
    'admin.ai.usage.calls': {
        en: 'calls',
        ar: 'مكالمات',
        fr: 'appels',
    },

    // Student Dashboard Pages
    'student.dashboard.title': {
        en: 'My Courses',
        ar: 'دوراتي',
        fr: 'Mes Cours',
    },
    'student.dashboard.subtitle': {
        en: 'View and continue your enrolled courses',
        ar: 'عرض ومتابعة دوراتك المسجلة',
        fr: 'Voir et continuer vos cours inscrits',
    },
    'student.stats.enrolled': {
        en: 'Courses Enrolled',
        ar: 'الدورات المسجلة',
        fr: 'Cours Inscrits',
    },
    'student.stats.activeCourses': {
        en: 'Active courses',
        ar: 'الدورات النشطة',
        fr: 'Cours actifs',
    },
    'student.stats.totalLessons': {
        en: 'Total Lessons',
        ar: 'إجمالي الدروس',
        fr: 'Total Leçons',
    },
    'student.stats.availableToWatch': {
        en: 'Available to watch',
        ar: 'متاح للمشاهدة',
        fr: 'Disponible à regarder',
    },
    'student.stats.completed': {
        en: 'Completed',
        ar: 'مكتمل',
        fr: 'Terminé',
    },
    'student.stats.remaining': {
        en: 'remaining',
        ar: 'متبقي',
        fr: 'restant',
    },
    'student.stats.avgProgress': {
        en: 'Avg. Progress',
        ar: 'متوسط التقدم',
        fr: 'Progression Moy.',
    },
    'student.stats.overallCompletion': {
        en: 'Overall completion',
        ar: 'الإكمال الكلي',
        fr: 'Achèvement global',
    },
    'student.courses.title': {
        en: 'My Enrolled Courses',
        ar: 'دوراتي المسجلة',
        fr: 'Mes Cours Inscrits',
    },
    'student.courses.subtitle': {
        en: 'Continue learning where you left off',
        ar: 'تابع التعلم من حيث توقفت',
        fr: 'Continuez d\'apprendre là où vous vous êtes arrêté',
    },
    'student.courses.exploreMore': {
        en: 'Explore More',
        ar: 'اكتشف المزيد',
        fr: 'Explorer Plus',
    },
    'student.courses.loading': {
        en: 'Loading your courses...',
        ar: 'جارٍ تحميل دوراتك...',
        fr: 'Chargement de vos cours...',
    },
    'student.courses.error': {
        en: 'Failed to load courses',
        ar: 'فشل تحميل الدورات',
        fr: 'Échec du chargement des cours',
    },
    'student.courses.tryAgain': {
        en: 'Try Again',
        ar: 'حاول مرة أخرى',
        fr: 'Réessayer',
    },
    'student.courses.noCourses': {
        en: 'No courses enrolled yet',
        ar: 'لا توجد دورات مسجلة بعد',
        fr: 'Aucun cours inscrit pour le moment',
    },
    'student.courses.startLearning': {
        en: 'Start your learning journey by enrolling in a course',
        ar: 'ابدأ رحلتك التعليمية بالتسجيل في دورة',
        fr: 'Commencez votre parcours d\'apprentissage en vous inscrivant à un cours',
    },
    'student.courses.browse': {
        en: 'Browse Courses',
        ar: 'تصفح الدورات',
        fr: 'Parcourir les Cours',
    },
    'student.courses.watch': {
        en: 'Watch',
        ar: 'شاهد',
        fr: 'Regarder',
    },
    'student.courses.lessons': {
        en: 'lessons',
        ar: 'دروس',
        fr: 'leçons',
    },
    'student.courses.complete': {
        en: 'complete',
        ar: 'مكتمل',
        fr: 'complet',
    },
    'student.ai.placeholder': {
        en: 'Ask about your courses...',
        ar: 'اسأل عن دوراتك...',
        fr: 'Demandez à propos de vos cours...',
    },
    'student.performance.title': {
        en: 'My Performance',
        ar: 'أدائي',
        fr: 'Ma Performance',
    },
    'student.performance.subtitle': {
        en: 'Weekly progress overview',
        ar: 'نظرة عامة على التقدم الأسبوعي',
        fr: 'Aperçu des progrès hebdomadaires',
    },
    'student.focus.title': {
        en: 'Focus Areas',
        ar: 'مجالات التركيز',
        fr: 'Domaines d\'intérêt',
    },
    'student.focus.subtitle': {
        en: 'Time distribution',
        ar: 'توزيع الوقت',
        fr: 'Distribution du temps',
    },
    'student.tutors.title': {
        en: 'Recommended Tutors',
        ar: 'المعلمون الموصى بهم',
        fr: 'Tuteurs Recommandés',
    },
    'student.tutors.subtitle': {
        en: 'AI-powered suggestions based on your interests',
        ar: 'اقتراحات مدعومة بالذكاء الاصطناعي بناءً على اهتماماتك',
        fr: 'Suggestions alimentées par l\'IA basées sur vos intérêts',
    },
    'student.tutors.viewAll': {
        en: 'View All',
        ar: 'عرض الكل',
        fr: 'Voir Tout',
    },
    'student.tutors.match': {
        en: 'Match',
        ar: 'تطابق',
        fr: 'Correspondance',
    },
    'student.tutors.students': {
        en: 'students',
        ar: 'طلاب',
        fr: 'étudiants',
    },

    // Tutor Dashboard Pages
    'tutor.dashboard.title': {
        en: 'Tutor Dashboard',
        ar: 'لوحة تحكم المعلم',
        fr: 'Tableau de bord Tuteur',
    },
    'tutor.dashboard.subtitle': {
        en: 'Manage your sessions and monitor student progress',
        ar: 'إدارة جلساتك ومراقبة تقدم الطلاب',
        fr: 'Gérez vos sessions et surveillez les progrès des étudiants',
    },
    'tutor.stats.activeStudents': {
        en: 'Active Students',
        ar: 'الطلاب النشطين',
        fr: 'Étudiants actifs',
    },
    'tutor.stats.totalEnrollments': {
        en: 'total enrollments',
        ar: 'إجمالي التسجيلات',
        fr: 'inscriptions totales',
    },
    'tutor.stats.sessionsCompleted': {
        en: 'Sessions Completed',
        ar: 'الجلسات المكتملة',
        fr: 'Sessions terminées',
    },
    'tutor.stats.totalSessions': {
        en: 'total sessions',
        ar: 'إجمالي الجلسات',
        fr: 'sessions totales',
    },
    'tutor.stats.upcomingSessions': {
        en: 'Upcoming Sessions',
        ar: 'الجلسات القادمة',
        fr: 'Sessions à venir',
    },
    'tutor.stats.scheduled': {
        en: 'scheduled',
        ar: 'مجدولة',
        fr: 'prévu',
    },
    'tutor.stats.myCourses': {
        en: 'My Courses',
        ar: 'دوراتي',
        fr: 'Mes Cours',
    },
    'tutor.stats.activeCourses': {
        en: 'active courses',
        ar: 'دورات نشطة',
        fr: 'cours actifs',
    },
    'tutor.bookings.title': {
        en: 'My Bookings',
        ar: 'حجوزاتي',
        fr: 'Mes Réservations',
    },
    'tutor.bookings.subtitle': {
        en: 'Upcoming sessions',
        ar: 'الجلسات القادمة',
        fr: 'Sessions à venir',
    },
    'tutor.bookings.viewCalendar': {
        en: 'View Calendar',
        ar: 'عرض التقويم',
        fr: 'Voir le calendrier',
    },
    'tutor.bookings.noBookings': {
        en: 'No upcoming sessions',
        ar: 'لا توجد جلسات قادمة',
        fr: 'Aucune session à venir',
    },
    'tutor.bookings.emptyDesc': {
        en: 'Your scheduled sessions will appear here',
        ar: 'ستظهر جلساتك المجدولة هنا',
        fr: 'Vos sessions programmées apparaîtront ici',
    },
    'tutor.bookings.confirmed': {
        en: 'Confirmed',
        ar: 'مؤكد',
        fr: 'Confirmé',
    },
    'tutor.bookings.videoCall': {
        en: 'Video Call',
        ar: 'مكالمة فيديو',
        fr: 'Appel Vidéo',
    },
    'tutor.courses.title': {
        en: 'My Courses',
        ar: 'دوراتي',
        fr: 'Mes Cours',
    },
    'tutor.courses.subtitle': {
        en: 'Course overview',
        ar: 'نظرة عامة على الدورة',
        fr: 'Aperçu du cours',
    },
    'tutor.courses.noCourses': {
        en: 'No courses yet',
        ar: 'لا توجد دورات حتى الآن',
        fr: 'Pas encore de cours',
    },
    'tutor.courses.create': {
        en: 'Create Course',
        ar: 'إنشاء دورة',
        fr: 'Créer un Cours',
    },
    'tutor.courses.student': {
        en: 'student',
        ar: 'طالب',
        fr: 'étudiant',
    },
    'tutor.courses.students': {
        en: 'students',
        ar: 'طلاب',
        fr: 'étudiants',
    },
    'tutor.courses.viewAll': {
        en: 'View All',
        ar: 'عرض الكل',
        fr: 'Voir Tout',
    },
    'tutor.rating.title': {
        en: 'My Rating',
        ar: 'تقييمي',
        fr: 'Mon Évaluation',
    },
    'tutor.rating.subtitle': {
        en: 'Student feedback coming soon',
        ar: 'تعليقات الطلاب قريبًا',
        fr: 'Commentaires des étudiants bientôt disponibles',
    },
    'tutor.rating.noRatings': {
        en: 'No ratings yet',
        ar: 'لا توجد تقييمات حتى الآن',
        fr: 'Pas encore d\'évaluations',
    },
    'tutor.loading': {
        en: 'Loading dashboard...',
        ar: 'جارٍ تحميل لوحة القيادة...',
        fr: 'Chargement du tableau de bord...',
    },
    'tutor.error': {
        en: 'Failed to load tutor data',
        ar: 'فشل تحميل بيانات المعلم',
        fr: 'Échec du chargement des données du tuteur',
    },
    'tutor.tryAgain': {
        en: 'Try Again',
        ar: 'حاول مرة أخرى',
        fr: 'Réessayer',
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
    'common.loading': {
        en: 'Loading...',
        ar: 'جاري التحميل...',
        fr: 'Chargement...',
    },
    'common.comingSoon': {
        en: 'Coming Soon',
        ar: 'قريباً',
        fr: 'Bientôt Disponible',
    },
    'common.soon': {
        en: 'Soon',
        ar: 'قريباً',
        fr: 'Bientôt',
    },
    'common.guestUser': {
        en: 'Guest User',
        ar: 'زائر',
        fr: 'Invité',
    },
    // Subtitle
    'home.subtitle': {
        en: 'An AI Ecosystem Connecting Students with PhD Researchers — Where Intelligence Finds Its Match.',
        ar: 'نظام بيئي للذكاء الاصطناعي يربط الطلاب بباحثي الدكتوراه — حيث يجد الذكاء نظيره.',
        fr: 'Un Écosystème IA Connectant les Étudiants aux Chercheurs PhD — Où l\'Intelligence Trouve Son Match.',
    },
    // Authentication
    'auth.welcomeBack': {
        en: 'Welcome Back!',
        ar: 'مرحبًا بعودتك!',
        fr: 'Bon retour !',
    },
    'auth.signInSubtitle': {
        en: 'Sign in to your UniMatch account',
        ar: 'سجل الدخول إلى حساب UniMatch الخاص بك',
        fr: 'Connectez-vous à votre compte UniMatch',
    },
    'auth.registrationSuccess': {
        en: 'Registration successful! Please sign in.',
        ar: 'تم التسجيل بنجاح! الرجاء تسجيل الدخول.',
        fr: 'Inscription réussie ! Veuillez vous connecter.',
    },
    'auth.emailRequired': {
        en: 'Email is required',
        ar: 'البريد الإلكتروني مطلوب',
        fr: 'L\'e-mail est requis',
    },
    'auth.passwordRequired': {
        en: 'Password is required',
        ar: 'كلمة المرور مطلوبة',
        fr: 'Le mot de passe est requis',
    },
    'auth.invalidCredentials': {
        en: 'Invalid email or password. Please try again.',
        ar: 'البريد الإلكتروني أو كلمة المرور غير صالحة. حاول مرة أخرى.',
        fr: 'E-mail ou mot de passe invalide. Veuillez réessayer.',
    },
    'auth.authError': {
        en: 'Authentication error:',
        ar: 'خطأ في المصادقة:',
        fr: 'Erreur d\'authentification :',
    },
    'auth.unexpectedError': {
        en: 'An unexpected error occurred during sign in. Please try again later.',
        ar: 'حدث خطأ غير متوقع أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى لاحقًا.',
        fr: 'Une erreur inattendue s\'est produite lors de la connexion. Veuillez réessayer plus tard.',
    },
    'auth.emailLabel': {
        en: 'Email Address',
        ar: 'عنوان البريد الإلكتروني',
        fr: 'Adresse e-mail',
    },
    'auth.emailPlaceholder': {
        en: 'Enter your email',
        ar: 'أدخل بريدك الإلكتروني',
        fr: 'Entrez votre e-mail',
    },
    'auth.passwordLabel': {
        en: 'Password',
        ar: 'كلمة المرور',
        fr: 'Mot de passe',
    },
    'auth.passwordPlaceholder': {
        en: 'Enter your password',
        ar: 'أدخل كلمة المرور',
        fr: 'Entrez votre mot de passe',
    },
    'auth.forgotPassword': {
        en: 'Forgot password?',
        ar: 'نسيت كلمة المرور؟',
        fr: 'Mot de passe oublié ?',
    },
    'auth.signingIn': {
        en: 'Signing in...',
        ar: 'جاري تسجيل الدخول...',
        fr: 'Connexion en cours...',
    },
    'auth.signIn': {
        en: 'Sign In',
        ar: 'تسجيل الدخول',
        fr: 'Se connecter',
    },
    'auth.orContinueWith': {
        en: 'Or continue with',
        ar: 'أو الاستمرار مع',
        fr: 'Ou continuer avec',
    },
    'auth.signInGoogle': {
        en: 'Sign in with Google',
        ar: 'تسجيل الدخول باستخدام Google',
        fr: 'Se connecter avec Google',
    },
    'auth.noAccount': {
        en: 'Don\'t have an account?',
        ar: 'ليس لديك حساب؟',
        fr: 'Vous n\'avez pas de compte ?',
    },
    'auth.signUp': {
        en: 'Sign up',
        ar: 'إنشاء حساب',
        fr: 'S\'inscrire',
    },
    'auth.createAccount': {
        en: 'Create an Account',
        ar: 'إنشاء حساب',
        fr: 'Créer un compte',
    },
    'auth.joinSubtitle': {
        en: 'Sign up to join UniMatch',
        ar: 'سجل للانضمام إلى UniMatch',
        fr: 'Inscrivez-vous pour rejoindre UniMatch',
    },
    'auth.passwordMismatch': {
        en: 'Passwords do not match',
        ar: 'كلمتا المرور غير متطابقتين',
        fr: 'Les mots de passe ne correspondent pas',
    },
    'auth.passwordTooShort': {
        en: 'Password must be at least 6 characters',
        ar: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل',
        fr: 'Le mot de passe doit contenir au moins 6 caractères',
    },
    'auth.fullnameLabel': {
        en: 'Full Name',
        ar: 'الاسم الكامل',
        fr: 'Nom complet',
    },
    'auth.fullnamePlaceholder': {
        en: 'Enter your full name',
        ar: 'أدخل اسمك الكامل',
        fr: 'Entrez votre nom complet',
    },
    'auth.createPasswordPlaceholder': {
        en: 'Create a password',
        ar: 'أنشئ كلمة مرور',
        fr: 'Créez un mot de passe',
    },
    'auth.confirmPasswordLabel': {
        en: 'Confirm Password',
        ar: 'تأكيد كلمة المرور',
        fr: 'Confirmer le mot de passe',
    },
    'auth.confirmPasswordPlaceholder': {
        en: 'Confirm your password',
        ar: 'أكد كلمة المرور',
        fr: 'Confirmez votre mot de passe',
    },
    'auth.iAmA': {
        en: 'I am a:',
        ar: 'أنا:',
        fr: 'Je suis un :',
    },
    'auth.studentRole': {
        en: 'Student',
        ar: 'طالب',
        fr: 'Étudiant',
    },
    'auth.teacherRole': {
        en: 'Teacher',
        ar: 'معلم',
        fr: 'Enseignant',
    },
    'auth.creatingAccount': {
        en: 'Creating Account...',
        ar: 'جاري إنشاء الحساب...',
        fr: 'Création du compte...',
    },
    'auth.failedToRegister': {
        en: 'Failed to register',
        ar: 'فشل التسجيل',
        fr: 'Échec de l\'inscription',
    },
    'auth.alreadyHaveAccount': {
        en: 'Already have an account?',
        ar: 'لديك حساب بالفعل؟',
        fr: 'Vous avez déjà un compte ?',
    },
    // Dashboard Main
    'dashboard.title': {
        en: 'Dashboard',
        ar: 'لوحة التحكم',
        fr: 'Tableau de bord',
    },
    'dashboard.createCourse': {
        en: 'Create Course',
        ar: 'إنشاء دورة',
        fr: 'Créer un cours',
    },
    'dashboard.manageCourses': {
        en: 'Manage Courses',
        ar: 'إدارة الدورات',
        fr: 'Gérer les cours',
    },
    'dashboard.manageCoursesDesc': {
        en: 'Create and manage your courses',
        ar: 'إنشاء وإدارة دوراتك',
        fr: 'Créez et gérez vos cours',
    },
    'dashboard.stats.totalSessions': {
        en: 'Total Sessions',
        ar: 'إجمالي الجلسات',
        fr: 'Total des sessions',
    },
    'dashboard.stats.activeStudents': {
        en: 'Active Students',
        ar: 'الطلاب النشطون',
        fr: 'Étudiants actifs',
    },
    'dashboard.stats.courses': {
        en: 'Courses',
        ar: 'الدورات',
        fr: 'Cours',
    },
    'dashboard.stats.avgRating': {
        en: 'Average Rating',
        ar: 'متوسط التقييم',
        fr: 'Note moyenne',
    },
    'dashboard.stats.vsLastMonth': {
        en: 'vs last month',
        ar: 'مقابل الشهر الماضي',
        fr: 'vs mois dernier',
    },
    'dashboard.recentActivity': {
        en: 'Recent Activity',
        ar: 'النشاط الأخير',
        fr: 'Activité récente',
    },
    'dashboard.noCoursesTitle': {
        en: 'No courses yet',
        ar: 'لا توجد دورات بعد',
        fr: 'Pas encore de cours',
    },
    'dashboard.noCreatedCourses': {
        en: 'You haven\'t created any courses yet. Get started by creating your first course.',
        ar: 'لم تنشئ أي دورات بعد. ابدأ بإنشاء دورتك الأولى.',
        fr: 'Vous n\'avez pas encore créé de cours. Commencez par créer votre premier cours.',
    },
    'dashboard.noEnrolledCourses': {
        en: 'You haven\'t enrolled in any courses yet. Browse available courses to get started.',
        ar: 'لم تشترك في أي دورات بعد. تصفح الدورات المتاحة للبدء.',
        fr: 'Vous n\'êtes pas encore inscrit à des cours. Parcourez les cours disponibles pour commencer.',
    },
    // Settings Page
    'settings.title': {
        en: 'Settings',
        ar: 'الإعدادات',
        fr: 'Paramètres',
    },
    'settings.subtitle': {
        en: 'Manage your account settings and preferences',
        ar: 'إدارة إعدادات حسابك وتفضيلاتك',
        fr: 'Gérez les paramètres et préférences de votre compte',
    },
    'settings.tabs.profile': {
        en: 'Profile',
        ar: 'الملف الشخصي',
        fr: 'Profil',
    },
    'settings.tabs.account': {
        en: 'Account',
        ar: 'الحساب',
        fr: 'Compte',
    },
    'settings.tabs.password': {
        en: 'Password',
        ar: 'كلمة المرور',
        fr: 'Mot de passe',
    },
    'settings.tabs.notifications': {
        en: 'Notifications',
        ar: 'الإشعارات',
        fr: 'Notifications',
    },
    'settings.tabs.privacy': {
        en: 'Privacy',
        ar: 'الخصوصية',
        fr: 'Confidentialité',
    },
    'settings.tabs.courses': {
        en: 'My Courses',
        ar: 'دوراتي',
        fr: 'Mes Cours',
    },
    'settings.tabs.availability': {
        en: 'Availability',
        ar: 'التوفر',
        fr: 'Disponibilité',
    },
    'settings.tabs.payments': {
        en: 'Payments',
        ar: 'المدفوعات',
        fr: 'Paiements',
    },
    'settings.tabs.enrollments': {
        en: 'My Enrollments',
        ar: 'تسجيلاتي',
        fr: 'Mes Inscriptions',
    },
    'settings.tabs.sessions': {
        en: 'Session History',
        ar: 'سجل الجلسات',
        fr: 'Historique des sessions',
    },
    'settings.tabs.help': {
        en: 'Help & Support',
        ar: 'المساعدة والدعم',
        fr: 'Aide & Support',
    },
    'settings.tabs.terms': {
        en: 'Terms',
        ar: 'الشروط',
        fr: 'Conditions',
    },
    // Settings - Profile
    'settings.profile.title': {
        en: 'Profile Information',
        ar: 'معلومات الملف الشخصي',
        fr: 'Informations du profil',
    },
    'settings.profile.desc': {
        en: 'Update your profile information and how others see you on the platform.',
        ar: 'قم بتحديث معلومات ملفك الشخصي وكيف يراك الآخرون على المنصة.',
        fr: 'Mettez à jour vos informations de profil et la façon dont les autres vous voient sur la plateforme.',
    },
    'settings.profile.changePhoto': {
        en: 'Change Photo',
        ar: 'تغيير الصورة',
        fr: 'Changer la photo',
    },
    'settings.profile.fullName': {
        en: 'Full Name',
        ar: 'الاسم الكامل',
        fr: 'Nom complet',
    },
    'settings.profile.email': {
        en: 'Email Address',
        ar: 'البريد الإلكتروني',
        fr: 'Adresse e-mail',
    },
    'settings.profile.bio': {
        en: 'Bio',
        ar: 'السيرة الذاتية',
        fr: 'Bio',
    },
    'settings.profile.bioPlaceholder.teacher': {
        en: 'Describe your teaching experience and expertise...',
        ar: 'صف خبرتك في التدريس واختصاصك...',
        fr: 'Décrivez votre expérience d\'enseignement et votre expertise...',
    },
    'settings.profile.bioPlaceholder.student': {
        en: 'Tell us about yourself...',
        ar: 'أخبرنا عن نفسك...',
        fr: 'Parlez-nous de vous...',
    },
    'settings.profile.specializations': {
        en: 'Specializations',
        ar: 'التخصصات',
        fr: 'Spécialisations',
    },
    'settings.profile.add': {
        en: 'Add',
        ar: 'إضافة',
        fr: 'Ajouter',
    },
    'settings.saveChanges': {
        en: 'Save Changes',
        ar: 'حفظ التغييرات',
        fr: 'Enregistrer les modifications',
    },
    // Settings - Password
    'settings.password.title': {
        en: 'Change Password',
        ar: 'تغيير كلمة المرور',
        fr: 'Changer le mot de passe',
    },
    'settings.password.desc': {
        en: 'Update your password to maintain account security.',
        ar: 'قم بتحديث كلمة المرور للحفاظ على أمان الحساب.',
        fr: 'Mettez à jour votre mot de passe pour maintenir la sécurité du compte.',
    },
    'settings.password.current': {
        en: 'Current Password',
        ar: 'كلمة المرور الحالية',
        fr: 'Mot de passe actuel',
    },
    'settings.password.new': {
        en: 'New Password',
        ar: 'كلمة المرور الجديدة',
        fr: 'Nouveau mot de passe',
    },
    'settings.password.confirm': {
        en: 'Confirm New Password',
        ar: 'تأكيد كلمة المرور الجديدة',
        fr: 'Confirmer le nouveau mot de passe',
    },
    'settings.password.update': {
        en: 'Update Password',
        ar: 'تحديث كلمة المرور',
        fr: 'Mettre à jour le mot de passe',
    },
    // Settings - Notifications
    'settings.notifications.title': {
        en: 'Notification Preferences',
        ar: 'تفضيلات الإشعارات',
        fr: 'Préférences de notifications',
    },
    'settings.notifications.desc': {
        en: 'Choose what notifications you receive and how.',
        ar: 'اختر الإشعارات التي تتلقاها وكيفية تلقيها.',
        fr: 'Choisissez quelles notifications vous recevez et comment.',
    },
    'settings.notifications.email': {
        en: 'Email Notifications',
        ar: 'إشعارات البريد الإلكتروني',
        fr: 'Notifications par e-mail',
    },
    'settings.notifications.emailDesc': {
        en: 'Get notified about important updates via email',
        ar: 'احصل على إشعارات حول التحديثات المهمة عبر البريد الإلكتروني',
        fr: 'Soyez notifié des mises à jour importantes par e-mail',
    },
    'settings.notifications.push': {
        en: 'Push Notifications',
        ar: 'إشعارات فورية',
        fr: 'Notifications push',
    },
    'settings.notifications.pushDesc': {
        en: 'Receive push notifications in your browser',
        ar: 'تلقي إشعارات فورية في متصفحك',
        fr: 'Recevez des notifications push dans votre navigateur',
    },
    'settings.notifications.marketing': {
        en: 'Marketing Emails',
        ar: 'رسائل التسويق',
        fr: 'E-mails marketing',
    },
    'settings.notifications.marketingDesc': {
        en: 'Receive updates about new features and offerings',
        ar: 'تلقي تحديثات حول الميزات والعروض الجديدة',
        fr: 'Recevez des mises à jour sur les nouvelles fonctionnalités et offres',
    },
    'settings.notifications.save': {
        en: 'Save Preferences',
        ar: 'حفظ التفضيلات',
        fr: 'Enregistrer les préférences',
    },
    // Messages
    'messages.title': {
        en: 'Messages',
        ar: 'الرسائل',
        fr: 'Messages',
    },
    'messages.search': {
        en: 'Search conversations...',
        ar: 'البحث في المحادثات...',
        fr: 'Rechercher des conversations...',
    },
    'messages.startNew': {
        en: 'Start a new conversation',
        ar: 'بدء محادثة جديدة',
        fr: 'Démarrer une nouvelle conversation',
    },
    'messages.noConversations': {
        en: 'No conversations yet',
        ar: 'لا توجد محادثات حتى الآن',
        fr: 'Pas encore de conversations',
    },
    'messages.studentEmptyState': {
        en: 'Enroll in a course or book a session to message teachers',
        ar: 'اشترك في دورة أو احجز جلسة لمراسلة المعلمين',
        fr: 'Inscrivez-vous à un cours ou réservez une session pour contacter les enseignants',
    },
    'messages.teacherEmptyState': {
        en: 'Your students will appear here',
        ar: 'سيظهر طلابك هنا',
        fr: 'Vos étudiants apparaîtront ici',
    },
    'messages.noMatching': {
        en: 'No matching conversations',
        ar: 'لا توجد محادثات مطابقة',
        fr: 'Aucune conversation correspondante',
    },
    'messages.loading': {
        en: 'Loading messages...',
        ar: 'جارٍ تحميل الرسائل...',
        fr: 'Chargement des messages...',
    },
    'messages.noMessages': {
        en: 'No messages yet',
        ar: 'لا توجد رسائل حتى الآن',
        fr: 'Pas encore de messages',
    },
    'messages.startPrompt': {
        en: 'Send a message to start the conversation',
        ar: 'أرسل رسالة لبدء المحادثة',
        fr: 'Envoyez un message pour démarrer la conversation',
    },
    'messages.typePlaceholder': {
        en: 'Type a message...',
        ar: 'اكتب رسالة...',
        fr: 'Tapez un message...',
    },
    'messages.welcome': {
        en: 'Welcome to Messages',
        ar: 'مرحبًا بك في الرسائل',
        fr: 'Bienvenue dans les messages',
    },
    'messages.welcomeDesc.student': {
        en: 'Connect with your tutors. Select a conversation from the list to start messaging.',
        ar: 'تواصل مع معلميك. اختر محادثة من القائمة لبدء المراسلة.',
        fr: 'Connectez-vous avec vos tuteurs. Sélectionnez une conversation dans la liste pour commencer à échanger.',
    },
    'messages.welcomeDesc.teacher': {
        en: 'Connect with your students. Select a conversation from the list to start messaging.',
        ar: 'تواصل مع طلابك. اختر محادثة من القائمة لبدء المراسلة.',
        fr: 'Connectez-vous avec vos étudiants. Sélectionnez une conversation dans la liste pour commencer à échanger.',
    },
    'messages.conversationsCount': {
        en: 'conversations',
        ar: 'محادثات',
        fr: 'conversations',
    },
    'messages.unreadCount': {
        en: 'unread',
        ar: 'غير مقروءة',
        fr: 'non lu',
    },
    'messages.typing': {
        en: 'typing...',
        ar: 'يكتب...',
        fr: 'écrit...',
    },
    // Courses
    'courses.title': {
        en: 'Explore Courses',
        ar: 'استكشاف الدورات',
        fr: 'Explorer les Cours',
    },
    'courses.subtitle': {
        en: 'Discover a wide range of courses taught by expert instructors. Enhance your knowledge and skills with our comprehensive learning materials.',
        ar: 'اكتشف مجموعة واسعة من الدورات التي يدرسها مدربون خبراء. عزز معرفتك ومهاراتك من خلال موادنا التعليمية الشاملة.',
        fr: 'Découvrez un large éventail de cours dispensés par des experts. Améliorez vos connaissances et vos compétences grâce à notre matériel pédagogique complet.',
    },
    'courses.categories': {
        en: 'Categories',
        ar: 'التصنيفات',
        fr: 'Catégories',
    },
    'courses.searchPlaceholder': {
        en: 'Search courses...',
        ar: 'البحث عن الدورات...',
        fr: 'Rechercher des cours...',
    },
    'courses.searchLabel': {
        en: 'Search courses',
        ar: 'البحث عن الدورات',
        fr: 'Rechercher des cours',
    },
    'courses.loading': {
        en: 'Loading courses...',
        ar: 'جارٍ تحميل الدورات...',
        fr: 'Chargement des cours...',
    },
    'courses.noCourses': {
        en: 'No courses found',
        ar: 'لم يتم العثور على دورات',
        fr: 'Aucun cours trouvé',
    },
    'courses.noMatching': {
        en: 'We couldn\'t find any courses matching your search',
        ar: 'لم نتمكن من العثور على أي دورات تطابق بحثك',
        fr: 'Nous n\'avons trouvé aucun cours correspondant à votre recherche',
    },
    'courses.emptyCategory': {
        en: 'No courses are available in this category yet',
        ar: 'لا توجد دورات متاحة في هذا التصنيف حتى الآن',
        fr: 'Aucun cours n\'est encore disponible dans cette catégorie',
    },
    'courses.students': {
        en: 'students',
        ar: 'طلاب',
        fr: 'étudiants',
    },
    'courses.lessons': {
        en: 'lessons',
        ar: 'دروس',
        fr: 'leçons',
    },
    'courses.enrollNow': {
        en: 'Enroll Now',
        ar: 'سجل الآن',
        fr: 'S\'inscrire maintenant',
    },
    'courses.enrolling': {
        en: 'Enrolling...',
        ar: 'جارٍ التسجيل...',
        fr: 'Inscription en cours...',
    },
    'courses.enrolled': {
        en: 'Enrolled',
        ar: 'تم التسجيل',
        fr: 'Inscrit',
    },
    'courses.successEnroll': {
        en: 'Successfully enrolled in course',
        ar: 'تم التسجيل في الدورة بنجاح',
        fr: 'Inscription au cours réussie',
    },
    'courses.errorEnroll': {
        en: 'Failed to enroll in course',
        ar: 'فشل التسجيل في الدورة',
        fr: 'Échec de l\'inscription au cours',
    },
    'courses.signInError': {
        en: 'Please sign in to enroll in courses',
        ar: 'يرجى تسجيل الدخول للتسجيل في الدورات',
        fr: 'Veuillez vous connecter pour vous inscrire aux cours',
    },
    'courses.fetchError': {
        en: 'Failed to fetch courses',
        ar: 'فشل جلب الدورات',
        fr: 'Échec de la récupération des cours',
    },
    // Categories
    'category.All': { en: 'All', ar: 'الكل', fr: 'Tout' },
    'category.Mathematics': { en: 'Mathematics', ar: 'الرياضيات', fr: 'Mathématiques' },
    'category.Physics': { en: 'Physics', ar: 'الفيزياء', fr: 'Physique' },
    'category.Chemistry': { en: 'Chemistry', ar: 'الكيمياء', fr: 'Chimie' },
    'category.Biology': { en: 'Biology', ar: 'الأحياء', fr: 'Biologie' },
    'category.ComputerScience': { en: 'Computer Science', ar: 'علوم الحاسوب', fr: 'Informatique' },
    'category.Engineering': { en: 'Engineering', ar: 'الهندسة', fr: 'Ingénierie' },
    'category.Literature': { en: 'Literature', ar: 'الأدب', fr: 'Littérature' },
    'category.History': { en: 'History', ar: 'التاريخ', fr: 'Histoire' },
    'category.Economics': { en: 'Economics', ar: 'الاقتصاد', fr: 'Économie' },
    // Schedule
    'schedule.calendar': {
        en: 'Calendar',
        ar: 'التقويم',
        fr: 'Calendrier',
    },
    'schedule.viewManage': {
        en: 'View and manage your schedule',
        ar: 'عرض وإدارة جدولك',
        fr: 'Consulter et gérer votre emploi du temps',
    },
    'schedule.sessionsFor': {
        en: 'Sessions for',
        ar: 'الجلسات ليوم',
        fr: 'Sessions pour',
    },
    'schedule.browseTeachers': {
        en: 'Browse Teachers',
        ar: 'تصفح المعلمين',
        fr: 'Parcourir les enseignants',
    },
    'schedule.noSessions': {
        en: 'No sessions scheduled',
        ar: 'لا توجد جلسات مجدولة',
        fr: 'Aucune session prévue',
    },
    'schedule.noSessionsDesc': {
        en: 'You haven\'t scheduled any sessions yet. Browse available teachers to get started.',
        ar: 'لم تقم بجدولة أي جلسات بعد. تصفح المعلمين المتاحين للبدء.',
        fr: 'Vous n\'avez pas encore programmé de sessions. Parcourez les enseignants disponibles pour commencer.',
    },
    'schedule.markCompleted': {
        en: 'Mark as Completed',
        ar: 'تحديد كمكتمل',
        fr: 'Marquer comme terminé',
    },
    'schedule.cancelRequest': {
        en: 'Cancel Request',
        ar: 'إلغاء الطلب',
        fr: 'Annuler la demande',
    },
    'schedule.updating': {
        en: 'Updating...',
        ar: 'جارٍ التحديث...',
        fr: 'Mise à jour...',
    },
    'schedule.upcomingSessions': {
        en: 'upcoming sessions this month',
        ar: 'جلسات قادمة هذا الشهر',
        fr: 'sessions à venir ce mois-ci',
    },
    'schedule.requestsFor': {
        en: 'Requests for',
        ar: 'طلبات ليوم',
        fr: 'Demandes pour',
    },
    'schedule.manageRequests': {
        en: 'Manage session requests for the selected day',
        ar: 'إدارة طلبات الجلسات لليوم المحدد',
        fr: 'Gérer les demandes de session pour le jour sélectionné',
    },
    'schedule.status.pending': {
        en: 'Pending',
        ar: 'قيد الانتظار',
        fr: 'En attente',
    },
    'schedule.status.accepted': {
        en: 'Accepted',
        ar: 'مقبولة',
        fr: 'Acceptée',
    },
    'schedule.status.rejected': {
        en: 'Rejected',
        ar: 'مرفوضة',
        fr: 'Rejetée',
    },
    'schedule.status.completed': {
        en: 'Completed',
        ar: 'مكتملة',
        fr: 'Terminée',
    },
    'schedule.status.cancelled': {
        en: 'Cancelled',
        ar: 'ملغاة',
        fr: 'Annulée',
    },
    'schedule.noRequestsDay': {
        en: 'No requests for this day',
        ar: 'لا توجد طلبات لهذا اليوم',
        fr: 'Aucune demande pour ce jour',
    },
    'schedule.todaySchedule': {
        en: 'Today\'s Schedule',
        ar: 'جدول اليوم',
        fr: 'Programme d\'aujourd\'hui',
    },
    'schedule.yourSessionsToday': {
        en: 'Your sessions for',
        ar: 'جلساتك ليوم',
        fr: 'Vos sessions pour',
    },
    'schedule.noSessionsToday': {
        en: 'No sessions scheduled for today',
        ar: 'لا توجد جلسات مجدولة لهذا اليوم',
        fr: 'Aucune session prévue pour aujourd\'hui',
    },
    'schedule.calendarView': {
        en: 'Calendar View',
        ar: 'عرض التقويم',
        fr: 'Vue Calendrier',
    },
    'schedule.listView': {
        en: 'List View',
        ar: 'عرض القائمة',
        fr: 'Vue Liste',
    },
    'schedule.scheduleSession': {
        en: 'Schedule a Session',
        ar: 'جدولة جلسة',
        fr: 'Planifier une session',
    },
    'schedule.chooseDate': {
        en: 'Choose a date and time to schedule your session',
        ar: 'اختر تاريخًا ووقتًا لجدولة جلستك',
        fr: 'Choisissez une date et une heure pour planifier votre session',
    },
    'schedule.yourSessions': {
        en: 'Your Sessions',
        ar: 'جلساتك',
        fr: 'Vos Sessions',
    },
    'schedule.viewUpcoming': {
        en: 'View and manage your upcoming sessions',
        ar: 'عرض وإدارة جلساتك القادمة',
        fr: 'Consulter et gérer vos sessions à venir',
    },
    'schedule.with': {
        en: 'with',
        ar: 'مع',
        fr: 'avec',
    },
    'schedule.course': {
        en: 'Course',
        ar: 'الدورة',
        fr: 'Cours',
    },
    'schedule.unknownTeacher': {
        en: 'Unknown Teacher',
        ar: 'معلم غير معروف',
        fr: 'Enseignant inconnu',
    },
    'schedule.unknownStudent': {
        en: 'Unknown Student',
        ar: 'طالب غير معروف',
        fr: 'Étudiant inconnu',
    },
    // Find Tutor
    'findTutor.title': {
        en: 'Find a PhD Tutor',
        ar: 'ابحث عن معلم دكتوراه',
        fr: 'Trouver un tuteur PhD',
    },
    'findTutor.subtitle': {
        en: 'Connect with expert PhD researchers for personalized tutoring',
        ar: 'تواصل مع باحثين دكتوراه خبراء للحصول على دروس خصوصية',
        fr: 'Connectez-vous avec des chercheurs PhD experts pour un tutorat personnalisé',
    },
    'findTutor.searchPlaceholder': {
        en: 'Search by name, subject, or expertise...',
        ar: 'البحث بالاسم، المادة، أو الخبرة...',
        fr: 'Rechercher par nom, matière ou expertise...',
    },
    'findTutor.filters': {
        en: 'Filters',
        ar: 'تصفية',
        fr: 'Filtres',
    },
    'findTutor.aiHelper': {
        en: 'AI Match Helper',
        ar: 'مساعد التطابق الذكي',
        fr: 'Assistant de correspondance IA',
    },
    'findTutor.aiHelperDesc': {
        en: 'Let AI find your perfect tutor match based on your learning style',
        ar: 'دع الذكاء الاصطناعي يجد لك المعلم المثالي بناءً على أسلوب تعلمك',
        fr: 'Laissez l\'IA trouver votre tuteur idéal en fonction de votre style d\'apprentissage',
    },
    'findTutor.startMatching': {
        en: 'Start Matching',
        ar: 'ابدأ التطابق',
        fr: 'Commencer',
    },
    'findTutor.availableTutors': {
        en: 'Available Tutors',
        ar: 'المعلمون المتاحون',
        fr: 'Tuteurs disponibles',
    },
    'findTutor.noTutors': {
        en: 'No tutors found',
        ar: 'لم يتم العثور على معلمين',
        fr: 'Aucun tuteur trouvé',
    },
    'findTutor.noTutorsDesc': {
        en: 'Try adjusting your search or filters to find more tutors',
        ar: 'حاول تعديل البحث أو الفلاتر للعثور على المزيد من المعلمين',
        fr: 'Essayez d\'ajuster votre recherche ou vos filtres pour trouver plus de tuteurs',
    },
    // AI Matching Modal
    'aiMatch.title': {
        en: 'AI Tutor Matching',
        ar: 'تطابق المعلم الذكي',
        fr: 'Correspondance tuteur IA',
    },
    'aiMatch.step': {
        en: 'Step',
        ar: 'خطوة',
        fr: 'Étape',
    },
    'aiMatch.of': {
        en: 'of',
        ar: 'من',
        fr: 'de',
    },
    'aiMatch.subjectQuestion': {
        en: 'What do you need help with?',
        ar: 'بم تحتاج المساعدة؟',
        fr: 'De quoi avez-vous besoin d\'aide ?',
    },
    'aiMatch.subjectArea': {
        en: 'Subject Area',
        ar: 'مجال المادة',
        fr: 'Domaine',
    },
    'aiMatch.selectSubject': {
        en: 'Select a subject...',
        ar: 'اختر مادة...',
        fr: 'Sélectionnez une matière...',
    },
    'aiMatch.topicLabel': {
        en: 'Specific Topic or Question',
        ar: 'موضوع محدد أو سؤال',
        fr: 'Sujet ou question spécifique',
    },
    'aiMatch.topicPlaceholder': {
        en: 'Describe what you need help with...',
        ar: 'صف ما تحتاج المساعدة فيه...',
        fr: 'Décrivez ce dont vous avez besoin d\'aide...',
    },
    'aiMatch.goalQuestion': {
        en: 'What\'s your main goal?',
        ar: 'ما هو هدفك الرئيسي؟',
        fr: 'Quelle est votre objectif principal ?',
    },
    'aiMatch.styleQuestion': {
        en: 'How do you prefer to learn?',
        ar: 'كيف تفضل أن تتعلم؟',
        fr: 'Comment préférez-vous apprendre ?',
    },
    'aiMatch.budgetQuestion': {
        en: 'Budget preference',
        ar: 'تفضيل الميزانية',
        fr: 'Préférence budgétaire',
    },
    'aiMatch.urgencyQuestion': {
        en: 'How urgent?',
        ar: 'ما مدى الاستعجال؟',
        fr: 'Quelle urgence ?',
    },
    'aiMatch.cancel': { en: 'Cancel', ar: 'إلغاء', fr: 'Annuler' },
    'aiMatch.back': { en: 'Back', ar: 'رجوع', fr: 'Retour' },
    'aiMatch.continue': { en: 'Continue', ar: 'متابعة', fr: 'Continuer' },
    'aiMatch.findMatches': { en: 'Find Matches', ar: 'بحث عن تطابقات', fr: 'Trouver des correspondances' },

    // AI Results
    'aiResults.title': {
        en: 'AI-Recommended Tutors',
        ar: 'معلمون موصى بهم من الذكاء الاصطناعي',
        fr: 'Tuteurs recommandés par l\'IA',
    },
    'aiResults.analyzing': {
        en: 'AI is analyzing tutors to find your perfect match...',
        ar: 'يقوم الذكاء الاصطناعي بتحليل المعلمين للعثور على التطابق المثالي...',
        fr: 'L\'IA analyse les tuteurs pour trouver votre match parfait...',
    },
    'aiResults.analyzingDesc': {
        en: 'Considering expertise, teaching style, and availability',
        ar: 'مع مراعاة الخبرة، أسلوب التدريس، والتوافر',
        fr: 'Prise en compte de l\'expertise, du style d\'enseignement et de la disponibilité',
    },
    'aiResults.bestMatch': {
        en: 'Best Match for You',
        ar: 'أفضل تطابق لك',
        fr: 'Meilleur match pour vous',
    },
    'aiResults.aiInsight': {
        en: 'AI Insight',
        ar: 'رؤية الذكاء الاصطناعي',
        fr: 'Aperçu IA',
    },
    'aiResults.match': { en: 'Match', ar: 'تطابق', fr: 'Match' },
    'tutor.message': { en: 'Message', ar: 'رسالة', fr: 'Message' },
    'tutor.bookSession': { en: 'Book Session', ar: 'حجز جلسة', fr: 'Réserver une session' },
    'tutor.reviews': { en: 'reviews', ar: 'مراجعات', fr: 'avis' },

    // Options (Goals, Styles, etc)
    'goal.Exam preparation': { en: 'Exam preparation', ar: 'التحضير للامتحان', fr: 'Préparation aux examens' },
    'goal.Understand concepts deeply': { en: 'Understand concepts deeply', ar: 'فهم المفاهيم بعمق', fr: 'Comprendre les concepts en profondeur' },
    'goal.Complete assignments': { en: 'Complete assignments', ar: 'إكمال الواجبات', fr: 'Terminer les devoirs' },
    'goal.Research guidance': { en: 'Research guidance', ar: 'توجيه البحث', fr: 'Conseils de recherche' },
    'goal.Skill development': { en: 'Skill development', ar: 'تطوير المهارات', fr: 'Développement des compétences' },
    'goal.Career advancement': { en: 'Career advancement', ar: 'التقدم الوظيفي', fr: 'Avancement professionnel' },

    'style.Visual (diagrams, videos)': { en: 'Visual (diagrams, videos)', ar: 'بصري (مخططات، فيديوهات)', fr: 'Visuel (diagrammes, vidéos)' },
    'style.Hands-on (practice problems)': { en: 'Hands-on (practice problems)', ar: 'عملي (مسائل تدريبية)', fr: 'Pratique (problèmes d\'exercice)' },
    'style.Conceptual (theory-first)': { en: 'Conceptual (theory-first)', ar: 'مفاهيمي (النظرية أولاً)', fr: 'Conceptuel (théorie d\'abord)' },
    'style.Interactive (discussion-based)': { en: 'Interactive (discussion-based)', ar: 'تفاعلي (قائم على النقاش)', fr: 'Interactif (basé sur la discussion)' },

    'budget.Under $50/hour': { en: 'Under $50/hour', ar: 'أقل من 50$/ساعة', fr: 'Moins de 50$/heure' },
    'budget.$50-75/hour': { en: '$50-75/hour', ar: '50-75$/ساعة', fr: '50-75$/heure' },
    'budget.$75-100/hour': { en: '$75-100/hour', ar: '75-100$/ساعة', fr: '75-100$/heure' },
    'budget.Any budget': { en: 'Any budget', ar: 'أي ميزانية', fr: 'Tout budget' },

    'urgency.Need help ASAP': { en: 'Need help ASAP', ar: 'أحتاج مساعدة عاجلة', fr: 'Besoin d\'aide ASAP' },
    'urgency.Within this week': { en: 'Within this week', ar: 'خلال هذا الأسبوع', fr: 'Cette semaine' },
    // Learning Hub
    'learningHub.title.welcomeBack': { en: 'Welcome back,', ar: 'مرحباً بعودتك،', fr: 'Bon retour,' },
    'learningHub.title.generic': { en: 'AI Learning Hub', ar: 'مركز التعلم الذكي', fr: 'Centre d\'apprentissage IA' },
    'learningHub.subtitle.personal': { en: 'Personalized {level} learning', ar: 'تعلم {level} مخصص', fr: 'Apprentissage {level} personnalisé' },
    'learningHub.subtitle.generic': { en: 'Personalized learning powered by artificial intelligence', ar: 'تعلم مخصص مدعوم بالذكاء الاصطناعي', fr: 'Apprentissage personnalisé propulsé par l\'IA' },
    'learningHub.updatePreferences': { en: 'Update Preferences', ar: 'تحديث التفضيلات', fr: 'Mettre à jour les préférences' },

    // Onboarding
    'onboarding.welcome': { en: 'Welcome to AI Learning Hub!', ar: 'مرحباً بك في مركز التعلم الذكي!', fr: 'Bienvenue au Centre d\'apprentissage IA !' },
    'onboarding.welcomeDesc': { en: "Let's personalize your learning experience", ar: 'دعنا نخصص تجربة التعلم الخاصة بك', fr: 'Personnalisons votre expérience d\'apprentissage' },
    'onboarding.subjects': { en: 'What do you want to learn?', ar: 'ماذا تريد أن تتعلم؟', fr: 'Que voulez-vous apprendre ?' },
    'onboarding.subjectsDesc': { en: 'Select all subjects that interest you', ar: 'اختر جميع المواد التي تهمك', fr: 'Sélectionnez tous les sujets qui vous intéressent' },
    'onboarding.goals': { en: 'What are your goals?', ar: 'ما هي أهدافك؟', fr: 'Quels sont vos objectifs ?' },
    'onboarding.goalsDesc': { en: 'Choose your learning objectives', ar: 'اختر أهداف التعلم الخاصة بك', fr: 'Choisissez vos objectifs d\'apprentissage' },
    'onboarding.style': { en: 'How do you learn best?', ar: 'كيف تتعلم بشكل أفضل؟', fr: 'Comment apprenez-vous le mieux ?' },
    'onboarding.styleDesc': { en: "We'll adapt content to your style", ar: 'سنقوم بتكييف المحتوى حسب أسلوبك', fr: 'Nous adapterons le contenu à votre style' },
    'onboarding.almostThere': { en: 'Almost there!', ar: 'أوشكنا على الانتهاء!', fr: 'Presque fini !' },
    'onboarding.almostThereDesc': { en: 'Just a couple more preferences', ar: 'بضع تفضيلات أخرى فقط', fr: 'Juste quelques préférences de plus' },
    'onboarding.nameQuestion': { en: 'What should we call you?', ar: 'بماذا نناديك؟', fr: 'Comment devons-nous vous appeler ?' },
    'onboarding.namePlaceholder': { en: 'Enter your name', ar: 'أدخل اسمك', fr: 'Entrez votre nom' },
    'onboarding.nameHint': { en: 'This helps us personalize your learning experience', ar: 'هذا يساعدنا في تخصيص تجربتك', fr: 'Cela nous aide à personnaliser votre expérience' },
    'onboarding.experienceLevel': { en: 'Your experience level', ar: 'مستوى خبرتك', fr: 'Votre niveau d\'expérience' },
    'onboarding.weeklyStudyTime': { en: 'Weekly study time', ar: 'وقت الدراسة الأسبوعي', fr: 'Temps d\'étude hebdomadaire' },
    'onboarding.getStarted': { en: 'Get Started', ar: 'ابدأ الآن', fr: 'Commncer' },
    'onboarding.continue': { en: 'Continue', ar: 'متابعة', fr: 'Continuer' },
    'onboarding.back': { en: 'Back', ar: 'رجوع', fr: 'Retour' },

    // AI Tools
    'aiTool.assistant.name': { en: 'AI Study Assistant', ar: 'مساعد الدراسة الذكي', fr: 'Assistant d\'étude IA' },
    'aiTool.assistant.desc': { en: 'Get instant answers to your study questions', ar: 'احصل على إجابات فورية لأسئلتك الدراسية', fr: 'Obtenez des réponses instantanées à vos questions d\'étude' },
    'aiTool.flashcards.name': { en: 'Smart Flashcards', ar: 'بطاقات تعليمية ذكية', fr: 'Flashcards intelligentes' },
    'aiTool.flashcards.desc': { en: 'AI-generated flashcards for efficient learning', ar: 'بطاقات تعليمية مولدة بالذكاء الاصطناعي للتعلم الفعال', fr: 'Flashcards générées par IA pour un apprentissage efficace' },
    'aiTool.quiz.name': { en: 'Practice Quizzes', ar: 'اختبارات تدريبية', fr: 'Quiz d\'entraînement' },
    'aiTool.quiz.desc': { en: 'Adaptive quizzes that match your level', ar: 'اختبارات تكيفية تناسب مستواك', fr: 'Quiz adaptatifs correspondant à votre niveau' },
    'aiTool.summarizer.name': { en: 'AI Summarizer', ar: 'ملخص الذكاء الاصطناعي', fr: 'Résumeur IA' },
    'aiTool.summarizer.desc': { en: 'Get concise summaries of complex topics', ar: 'احصل على ملخصات موجزة لمواضيع معقدة', fr: 'Obtenez des résumés concis de sujets complexes' },

    // Flashcards
    'flashcards.generating': { en: 'Generating personalized flashcards...', ar: 'جاري إنشاء البطاقات التعليمية المخصصة...', fr: 'Génération de flashcards personnalisées...' },
    'flashcards.empty': { en: 'No flashcards yet', ar: 'لا توجد بطاقات تعليمية بعد', fr: 'Pas encore de flashcards' },
    'flashcards.generate': { en: 'Generate Flashcards', ar: 'توليد بطاقات تعليمية', fr: 'Générer des flashcards' },
    'flashcards.title': { en: 'AI-Generated Flashcards for {name}', ar: 'بطاقات تعليمية مخصصة لـ {name}', fr: 'Flashcards IA pour {name}' },
    'flashcards.generateMore': { en: 'Generate More', ar: 'توليد المزيد', fr: 'Générer plus' },
    'flashcards.clickToReveal': { en: 'Click to reveal answer', ar: 'انقر للكشف عن الإجابة', fr: 'Cliquez pour révéler la réponse' },
    'flashcards.previous': { en: 'Previous', ar: 'السابق', fr: 'Précédent' },
    'flashcards.next': { en: 'Next', ar: 'التالي', fr: 'Suivant' },

    // Quiz
    'quiz.generating': { en: 'Generating personalized quiz for {name}...', ar: 'جاري إنشاء اختبار مخصص لـ {name}...', fr: 'Génération de quiz personnalisé pour {name}...' },
    'quiz.error': { en: 'Could not generate quiz', ar: 'تعذر إنشاء الاختبار', fr: 'Impossible de générer le quiz' },
    'quiz.tryAgain': { en: 'Try Again', ar: 'حاول مرة أخرى', fr: 'Réessayer' },
    'quiz.completedTitle': { en: 'Great job, {name}!', ar: 'عمل رائع، {name}!', fr: 'Bon travail, {name} !' },
    'quiz.completedScore': { en: 'You scored {score} out of {total}', ar: 'لقد سجلت {score} من {total}', fr: 'Vous avez obtenu {score} sur {total}' },
    'quiz.tryNew': { en: 'Try New Quiz', ar: 'جرب اختبار جديد', fr: 'Essayer un nouveau quiz' },
    'quiz.title': { en: 'Personalized Quiz', ar: 'اختبار مخصص', fr: 'Quiz personnalisé' },
    'quiz.questionCount': { en: 'Question {current} of {total}', ar: 'سؤال {current} من {total}', fr: 'Question {current} sur {total}' },
    'quiz.nextQuestion': { en: 'Next Question', ar: 'السؤال التالي', fr: 'Question suivante' },
    'quiz.seeResults': { en: 'See Results', ar: 'عرض النتائج', fr: 'Voir les résultats' },

    // Summarizer
    'summarizer.title': { en: 'AI Content Generator', ar: 'مولد المحتوى الذكي', fr: 'Générateur de contenu IA' },
    'summarizer.mode.summarize': { en: 'Summarize', ar: 'تلخيص', fr: 'Résumer' },
    'summarizer.mode.explain': { en: 'Explain', ar: 'شرح', fr: 'Expliquer' },
    'summarizer.mode.practice': { en: 'Practice', ar: 'تدريب', fr: 'Entraînement' },
    'summarizer.personalizedFor': { en: 'Content personalized for {name} ({level} level, {style} learner)', ar: 'محتوى مخصص لـ {name} (مستوى {level}، متعلم بأسلوب {style})', fr: 'Contenu personnalisé pour {name} (niveau {level}, apprenant {style})' },
    'summarizer.placeholder.summary': { en: 'Enter a topic to summarize...', ar: 'أدخل موضوعاً لتلخيصه...', fr: 'Entrez un sujet à résumer...' },
    'summarizer.placeholder.explain': { en: 'Enter a concept to explain...', ar: 'أدخل مفهوماً لشرحه...', fr: 'Entrez un concept à expliquer...' },
    'summarizer.placeholder.practice': { en: 'Enter a subject for practice problems...', ar: 'أدخل موضوعاً لمسائل التدريب...', fr: 'Entrez un sujet pour des problèmes d\'entraînement...' },
    'summarizer.button.generating': { en: 'Generating...', ar: 'جاري التوليد...', fr: 'Génération...' },
    'summarizer.button.generate': { en: 'Generate', ar: 'توليد', fr: 'Générer' },
    'summarizer.resultTitle': { en: 'AI Generated Content', ar: 'محتوى مولد بالذكاء الاصطناعي', fr: 'Contenu généré par IA' },

    // Recommendations
    'recommendations.loading': { en: 'AI is finding the best courses for {name}...', ar: 'الذكاء الاصطناعي يبحث عن أفضل الدورات لـ {name}...', fr: 'L\'IA recherche les meilleurs cours pour {name}...' },
    'recommendations.title': { en: 'AI-Recommended Courses', ar: 'دورات موصى بها من الذكاء الاصطناعي', fr: 'Cours recommandés par l\'IA' },
    'recommendations.subtitle': { en: 'Personalized picks for {name}', ar: 'اختيارات مخصصة لـ {name}', fr: 'Sélections personnalisées pour {name}' },
    'recommendations.getNewPicks': { en: 'Get New Picks', ar: 'احصل على اختيارات جديدة', fr: 'Obtenir de nouvelles sélections' },
    'recommendations.noCourses': { en: 'No courses available to recommend yet', ar: 'لا توجد دورات متاحة للتوصية بها بعد', fr: 'Aucun cours disponible à recommander pour le moment' },
    'recommendations.browseAll': { en: 'Browse All Courses', ar: 'تصفح جميع الدورات', fr: 'Parcourir tous les cours' },
    'recommendations.enrolled': { en: 'Enrolled', ar: 'مسجل', fr: 'Inscrit' },
    'recommendations.viewAll': { en: 'View All {count} Courses', ar: 'عرض جميع الدورات ({count})', fr: 'Voir tous les {count} cours' },
    'recommendations.whyThisCourse': { en: 'Why this course?', ar: 'لماذا هذه الدورة؟', fr: 'Pourquoi ce cours ?' },
    'recommendations.alreadyEnrolled': { en: 'Already Enrolled - Go to Course', ar: 'مسجل بالفعل - الذهاب للدورة', fr: 'Déjà inscrit - Aller au cours' },
    'recommendations.enrollNow': { en: 'Enroll Now', ar: 'سجل الآن', fr: 'S\'inscrire maintenant' },
    'recommendations.unknownTeacher': { en: 'Unknown Teacher', ar: 'معلم غير معروف', fr: 'Professeur inconnu' },

    'tutor.students': { en: 'students', ar: 'طلاب', fr: 'étudiants' },
    'tutor.response': { en: 'response', ar: 'استجابة', fr: 'réponse' },
    'tutor.perHour': { en: 'per hour', ar: 'في الساعة', fr: 'par heure' },

    'filter.priceRange': { en: 'Price Range ($/hour)', ar: 'نطاق السعر ($/ساعة)', fr: 'Fourchette de prix ($/heure)' },
    'filter.min': { en: 'Min', ar: 'أدنى', fr: 'Min' },
    'filter.max': { en: 'Max', ar: 'أقصى', fr: 'Max' },
    'filter.rating': { en: 'Rating', ar: 'التقييم', fr: 'Évaluation' },
    'filter.anyRating': { en: 'Any Rating', ar: 'أي تقييم', fr: 'Toute évaluation' },
    'filter.availability': { en: 'Availability', ar: 'التوافر', fr: 'Disponibilité' },
    'filter.anytime': { en: 'Anytime', ar: 'أي وقت', fr: 'À tout moment' },
    'filter.availableNow': { en: 'Available Now', ar: 'متاح الآن', fr: 'Disponible maintenant' },
    'filter.today': { en: 'Today', ar: 'اليوم', fr: 'Aujourd\'hui' },
    'filter.thisWeek': { en: 'This Week', ar: 'هذا الأسبوع', fr: 'Cette semaine' },

    'aiBanner.title': { en: 'AI-Powered Matching', ar: 'مطابقة مدعومة بالذكاء الاصطناعي', fr: 'Correspondance par IA' },
    'aiBanner.desc': { en: 'Our AI analyzes your learning style and goals to find the perfect tutor match', ar: 'يحلل الذكاء الاصطناعي أسلوب تعلمك وأهدافك للعثور على المعلم المثالي', fr: 'Notre IA analyse votre style d\'apprentissage et vos objectifs pour trouver le tuteur idéal' },
    'aiBanner.button': { en: 'Get AI Recommendations', ar: 'الحصول على توصيات الذكاء الاصطناعي', fr: 'Obtenir des recommandations IA' },

    // AI Chat
    'aiChat.title': {
        en: 'AI Chat Tutor',
        ar: 'مدرس الدردشة الذكي',
        fr: 'Tuteur Chat IA',
    },
    'aiChat.subtitle': {
        en: 'Powered by Gemini AI',
        ar: 'مدعوم بواسطة Gemini AI',
        fr: 'Propulsé par Gemini AI',
    },
    'aiChat.newChat': {
        en: 'New',
        ar: 'جديد',
        fr: 'Nouveau',
    },
    'aiChat.quickPrompts': {
        en: 'Quick Prompts',
        ar: 'مطالبات سريعة',
        fr: 'Invites Rapides',
    },
    'aiChat.recentChats': {
        en: 'Recent Chats',
        ar: 'المحادثات الأخيرة',
        fr: 'Chats Récents',
    },
    'aiChat.noHistory': {
        en: 'No chat history yet',
        ar: 'لا يوجد سجل محادثات بعد',
        fr: 'Pas encore d\'historique',
    },
    'aiChat.capabilities': {
        en: 'AI Capabilities',
        ar: 'قدرات الذكاء الاصطناعي',
        fr: 'Capacités IA',
    },
    'aiChat.cap.explanations': {
        en: 'Step-by-step explanations',
        ar: 'تفسيرات خطوة بخطوة',
        fr: 'Explications étape par étape',
    },
    'aiChat.cap.practice': {
        en: 'Practice problem generation',
        ar: 'توليد مسائل للتدريب',
        fr: 'Génération de problèmes pratiques',
    },
    'aiChat.cap.studyPlan': {
        en: 'Study plan creation',
        ar: 'إنشاء خطة دراسية',
        fr: 'Création de plan d\'étude',
    },
    'aiChat.cap.visualization': {
        en: 'Concept visualization',
        ar: 'تصور المفاهيم',
        fr: 'Visualisation de concepts',
    },
    'aiChat.chat.title': {
        en: 'AI Study Assistant',
        ar: 'مساعد الدراسة الذكي',
        fr: 'Assistant d\'étude IA',
    },
    'aiChat.chat.placeholder': {
        en: "Ask me anything about your studies, homework, or concepts you're learning...",
        ar: 'اسألني أي شيء عن دراستك أو واجباتك أو المفاهيم التي تتعلمها...',
        fr: 'Demandez-moi n\'importe quoi sur vos études, vos devoirs ou les concepts que vous apprenez...',
    },
    // Suggested Prompts (Titles and Prompts)
    'aiChat.prompt.explain.title': {
        en: 'Explain a concept',
        ar: 'اشرح مفهوماً',
        fr: 'Expliquer un concept',
    },
    'aiChat.prompt.explain.content': {
        en: 'Can you explain the concept of neural networks in simple terms?',
        ar: 'هل يمكنك شرح مفهوم الشبكات العصبية بعبارات بسيطة؟',
        fr: 'Pouvez-vous expliquer le concept des réseaux de neurones en termes simples ?',
    },
    'aiChat.prompt.study.title': {
        en: 'Help me study',
        ar: 'ساعدني في الدراسة',
        fr: 'Aidez-moi à étudier',
    },
    'aiChat.prompt.study.content': {
        en: 'Help me create a study plan for my calculus exam next week',
        ar: 'ساعدني في إنشاء خطة دراسية لافتحان التفاضل والتكامل الأسبوع المقبل',
        fr: 'Aidez-moi à créer un plan d\'étude pour mon examen de calcul la semaine prochaine',
    },
    'aiChat.prompt.solve.title': {
        en: 'Solve a problem',
        ar: 'حل مشكلة',
        fr: 'Résoudre un problème',
    },
    'aiChat.prompt.solve.content': {
        en: 'Walk me through how to solve quadratic equations step by step',
        ar: 'اشرح لي كيفية حل المعادلات التربيعية خطوة بخطوة',
        fr: 'Expliquez-moi comment résoudre des équations du second degré étape par étape',
    },
    'aiChat.prompt.practice.title': {
        en: 'Practice questions',
        ar: 'أسئلة تدريب',
        fr: 'Questions pratiques',
    },
    'aiChat.prompt.practice.content': {
        en: 'Give me 5 practice questions on linear algebra matrices with solutions',
        ar: 'أعطني 5 أسئلة تدريبية حول مصفوفات الجبر الخطي مع الحلول',
        fr: 'Donnez-moi 5 questions pratiques sur les matrices d\'algèbre linéaire avec solutions',
    },

    // Career Boost
    'career.title': {
        en: 'Career Boost',
        ar: 'تعزيز المسار المهني',
        fr: 'Boost Carrière',
    },
    'career.tag': {
        en: 'Coming Soon',
        ar: 'قريباً',
        fr: 'Bientôt Disponible',
    },
    'career.heroDesc': {
        en: "AI-powered tools to accelerate your career journey. From resume building to interview prep, we've got you covered.",
        ar: 'أدوات مدعومة بالذكاء الاصطناعي لتسريع رحلتك المهنية. من بناء السيرة الذاتية إلى التحضير للمقابلات، نحن نغطيك.',
        fr: 'Des outils alimentés par l\'IA pour accélérer votre parcours professionnel. De la création de CV à la préparation d\'entretiens, nous sommes là pour vous.',
    },
    'career.getNotified': {
        en: 'Get Notified',
        ar: 'احصل على إشعار',
        fr: 'Être notifié',
    },
    'career.learnMore': {
        en: 'Learn More',
        ar: 'اعرف المزيد',
        fr: 'En savoir plus',
    },
    'career.stat.ai': {
        en: 'AI-Powered',
        ar: 'مدعوم بالذكاء الاصطناعي',
        fr: 'Propulsé par IA',
    },
    'career.stat.aiDesc': {
        en: 'Personalized recommendations',
        ar: 'توصيات شخصية',
        fr: 'Recommandations personnalisées',
    },
    'career.stat.time': {
        en: 'Time Saved',
        ar: 'الوقت الموفر',
        fr: 'Temps gagné',
    },
    'career.stat.timeDesc': {
        en: 'Faster job applications',
        ar: 'طلبات عمل أسرع',
        fr: 'Candidatures plus rapides',
    },
    'career.stat.success': {
        en: 'Success Rate',
        ar: 'معدل النجاح',
        fr: 'Taux de succès',
    },
    'career.stat.successDesc': {
        en: 'Interview success rate',
        ar: 'معدل نجاح المقابلات',
        fr: 'Taux de réussite aux entretiens',
    },
    'career.features.title': {
        en: 'Upcoming Features',
        ar: 'الميزات القادمة',
        fr: 'Fonctionnalités à venir',
    },
    'career.status.inDev': {
        en: 'In Development',
        ar: 'قيد التطوير',
        fr: 'En développement',
    },
    'career.status.comingSoon': {
        en: 'Coming Soon',
        ar: 'قريباً',
        fr: 'Bientôt',
    },
    'career.status.planned': {
        en: 'Planned',
        ar: 'مخطط',
        fr: 'Prévu',
    },
    'career.expected': {
        en: 'Expected:',
        ar: 'المتوقع:',
        fr: 'Prévu :',
    },
    'career.newsletter.title': {
        en: 'Be the first to try Career Boost',
        ar: 'كن أول من يجرب تعزيز المسار المهني',
        fr: 'Soyez le premier à essayer Boost Carrière',
    },
    'career.newsletter.desc': {
        en: 'Sign up for early access and exclusive updates on our AI career tools',
        ar: 'سجل للحصول على وصول مبكر وتحديثات حصرية حول أدوات الذكاء الاصطناعي المهنية لدينا',
        fr: 'Inscrivez-vous pour un accès anticipé et des mises à jour exclusives sur nos outils de carrière IA',
    },
    'career.newsletter.placeholder': {
        en: 'Enter your email',
        ar: 'أدخل بريدك الإلكتروني',
        fr: 'Entrez votre e-mail',
    },
    'career.notifyMe': {
        en: 'Notify Me',
        ar: 'أعلمني',
        fr: 'Avertissez-moi',
    },
    // Features List
    'career.feat.resume.title': {
        en: 'AI Resume Builder',
        ar: 'باني السيرة الذاتية بالذكاء الاصطناعي',
        fr: 'Générateur de CV IA',
    },
    'career.feat.resume.desc': {
        en: 'Create ATS-optimized resumes tailored to your dream jobs with AI assistance',
        ar: 'أنشئ سير ذاتية محسنة لأنظمة تتبع المتقدمين ومصممة خصيصاً لوظائف أحلامك بمساعدة الذكاء الاصطناعي',
        fr: 'Créez des CV optimisés pour les ATS adaptés à vos emplois de rêve avec l\'aide de l\'IA',
    },
    'career.feat.path.title': {
        en: 'Career Path Planner',
        ar: 'مخطط المسار المهني',
        fr: 'Planificateur de carrière',
    },
    'career.feat.path.desc': {
        en: 'AI-powered career roadmaps based on your skills, interests, and market trends',
        ar: 'خرائط طريق مهنية مدعومة بالذكاء الاصطناعي بناءً على مهاراتك واهتماماتك واتجاهات السوق',
        fr: 'Feuilles de route de carrière alimentées par l\'IA basées sur vos compétences, intérêts et tendances du marché',
    },
    'career.feat.match.title': {
        en: 'Job Matching Engine',
        ar: 'محرك مطابقة الوظائف',
        fr: 'Moteur de correspondance d\'emploi',
    },
    'career.feat.match.desc': {
        en: 'Smart job recommendations matching your profile with opportunities',
        ar: 'توصيات وظيفية ذكية تطابق ملفك الشخصي مع الفرص',
        fr: 'Recommandations d\'emploi intelligentes correspondant à votre profil avec des opportunités',
    },
    'career.feat.interview.title': {
        en: 'Interview Prep AI',
        ar: 'التحضير للمقابلات بالذكاء الاصطناعي',
        fr: 'Préparation entretien IA',
    },
    'career.feat.interview.desc': {
        en: 'Practice interviews with AI, get feedback, and improve your responses',
        ar: 'تدرب على المقابلات مع الذكاء الاصطناعي، واحصل على ملاحظات، وحسن إجاباتك',
        fr: 'Entraînez-vous aux entretiens avec l\'IA, obtenez des retours et améliorez vos réponses',
    },
    'career.feat.skills.title': {
        en: 'Skills Gap Analysis',
        ar: 'تحليل الفجوة في المهارات',
        fr: 'Analyse des écarts de compétences',
    },
    'career.feat.skills.desc': {
        en: 'Identify missing skills and get personalized learning recommendations',
        ar: 'تحديد المهارات المفقودة والحصول على توصيات تعليمية مخصصة',
        fr: 'Identifiez les compétences manquantes et obtenez des recommandations d\'apprentissage personnalisées',
    },
    'career.feat.portfolio.title': {
        en: 'Portfolio Showcase',
        ar: 'عرض المحفظة',
        fr: 'Vitrine de portfolio',
    },
    'career.feat.portfolio.desc': {
        en: 'Build and share your professional portfolio with verified credentials',
        ar: 'بناء ومشاركة محفظتك المهنية مع المؤهلات الموثقة',
        fr: 'Créez et partagez votre portfolio professionnel avec des informations d\'identification vérifiées',
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
