'use client';

import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useTheme } from '@/components/ThemeProvider';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  GraduationCap,
  Users,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  Bell,
  BookOpen,
  Search,
  ChevronDown,
  Brain,
  Sparkles,
  Rocket,
  TrendingUp,
  DollarSign,
  Star,
  BarChart3,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface NavigationProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isMobile?: boolean;
}

interface MenuItem {
  name: string;
  icon: LucideIcon;
  path: string;
  badge?: number | string;
  section?: string;
  comingSoon?: boolean;
  hiddenForRoles?: string[];
}

// Main navigation items
const mainMenuItems: MenuItem[] = [
  { name: 'nav.dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'nav.aiLearningHub', icon: Brain, path: '/dashboard/learning-hub', hiddenForRoles: ['teacher'] },
  { name: 'nav.findPhDTutor', icon: GraduationCap, path: '/dashboard/find-tutor', hiddenForRoles: ['teacher'] },
  { name: 'nav.aiChatTutor', icon: Sparkles, path: '/dashboard/ai-chat' },
  { name: 'nav.calendar', icon: Calendar, path: '/dashboard/schedule', badge: 2 },
  { name: 'nav.messages', icon: MessageSquare, path: '/dashboard/messages', badge: 5 },
  { name: 'nav.courses', icon: BookOpen, path: '/dashboard/courses', hiddenForRoles: ['teacher'] },
];

// Student-specific menu items
const studentMenuItems: MenuItem[] = [
  { name: 'student.myModules', icon: BookOpen, path: '/dashboard/student', section: 'nav.section.student' },
  { name: 'student.myPerformance', icon: TrendingUp, path: '/dashboard/student#performance' },
  { name: 'student.recommendedTutors', icon: Users, path: '/dashboard/student#tutors' },
];

// Tutor-specific menu items
const tutorMenuItems: MenuItem[] = [
  { name: 'tutor.myBookings', icon: Calendar, path: '/dashboard/tutor', section: 'nav.section.tutor' },
  { name: 'tutor.myRating', icon: Star, path: '/dashboard/tutor#rating' },
];

// Admin-specific menu items
const adminMenuItems: MenuItem[] = [
  { name: 'admin.students', icon: Users, path: '/dashboard/admin?tab=students', section: 'nav.section.admin' },
  { name: 'admin.tutors', icon: GraduationCap, path: '/dashboard/admin?tab=tutors' },
  { name: 'admin.platformAnalytics', icon: TrendingUp, path: '/dashboard/admin?tab=analytics' },
  { name: 'admin.aiSettings', icon: Brain, path: '/dashboard/admin?tab=ai-settings' },
];

const settingsItems: MenuItem[] = [
  { name: 'nav.settings', icon: Settings, path: '/dashboard/settings', section: 'nav.section.other' },
];

export function Navigation({ isCollapsed, onCollapse }: NavigationProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const { t, dir } = useLanguage();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Get user role
  const userRole = session?.user?.role || 'student';

  // Get role-specific menu items
  const getRoleMenuItems = () => {
    switch (userRole) {
      case 'teacher':
        return tutorMenuItems;
      case 'admin':
        return adminMenuItems;
      default:
        return studentMenuItems;
    }
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = session?.user?.name ? getInitials(session.user.name) : '??';

  // Check if content is scrollable and handle scroll
  useEffect(() => {
    const checkScroll = () => {
      if (navRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = navRef.current;
        setCanScroll(scrollHeight > clientHeight);
        setIsAtBottom(Math.ceil(scrollTop + clientHeight) >= scrollHeight);
        setScrollPosition(scrollTop);
      }
    };

    const nav = navRef.current;
    if (nav) {
      nav.addEventListener('scroll', checkScroll);
      checkScroll();
    }

    window.addEventListener('resize', checkScroll);
    return () => {
      if (nav) {
        nav.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [isCollapsed]);

  const MenuItem = ({ item, isActive }: { item: MenuItem; isActive: boolean }) => (
    <Link
      href={item.path}
      className={clsx(
        'flex items-center h-12 px-4 rounded-xl relative overflow-hidden',
        'transition-all duration-200 group',
        'hover:bg-gray-50 dark:hover:bg-gray-800/60',
        isActive
          ? 'bg-gradient-to-r from-blue-50/80 to-pink-50/80 dark:from-blue-900/20 dark:to-pink-900/20 text-blue-600 dark:text-blue-400 font-medium'
          : 'text-gray-700 dark:text-gray-300',
        isCollapsed ? 'justify-center' : '',
        item.comingSoon && 'opacity-60'
      )}
      onMouseEnter={() => setHoveredItem(item.path)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      {/* Background glow effect on hover */}
      {(hoveredItem === item.path || isActive) && (
        <div className={clsx(
          'absolute inset-0 bg-gradient-to-r from-blue-500/5 to-pink-500/5 dark:from-blue-500/10 dark:to-pink-500/10',
          'opacity-0 group-hover:opacity-100',
          isActive ? 'opacity-100' : '',
          'transition-opacity duration-300 rounded-xl'
        )} />
      )}

      <div className={clsx(
        'flex items-center justify-center shrink-0 relative z-10',
        'w-6 h-6',
        isActive
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-500 dark:text-gray-400',
        'group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
      )}>
        <item.icon className="w-full h-full" />
      </div>

      {!isCollapsed && (
        <span className={clsx(
          dir === 'rtl' ? "mr-3" : "ml-3",
          "font-medium tracking-wide relative z-10 flex-1",
          "transition-all duration-200 group-hover:translate-x-0.5",
          isActive ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300",
          "group-hover:text-blue-700 dark:group-hover:text-blue-400"
        )}>
          {t(item.name)}
        </span>
      )}

      {item.comingSoon && !isCollapsed && (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          {t('common.soon')}
        </span>
      )}

      {item.badge && !isCollapsed && !item.comingSoon && (
        <span className={clsx(
          typeof item.badge === 'string' ? "ml-auto" : (dir === 'rtl' ? "mr-auto" : "ml-auto"),
          'px-2.5 py-1 rounded-full text-xs font-medium relative z-10',
          typeof item.badge === 'number'
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
        )}>
          {item.badge}
        </span>
      )}

      {item.badge && isCollapsed && (
        <span className={clsx(
          dir === 'rtl' ? 'absolute top-2 left-2 z-10' : 'absolute top-2 right-2 z-10',
          'w-2.5 h-2.5 rounded-full',
          typeof item.badge === 'number'
            ? 'bg-blue-500'
            : 'bg-gradient-to-r from-pink-500 to-purple-500'
        )} />
      )}
    </Link>
  );

  return (
    <div className={clsx("fixed inset-y-0 z-40 flex", dir === 'rtl' ? "right-0" : "left-0")}>
      {/* Sidebar */}
      <aside
        className={clsx(
          'h-screen transition-all duration-300 flex-shrink-0',
          'bg-white dark:bg-gray-900/95 backdrop-blur-sm',
          dir === 'rtl' ? 'border-l border-gray-100 dark:border-gray-800/50' : 'border-r border-gray-100 dark:border-gray-800/50',
          'shadow-sm shadow-gray-100/50 dark:shadow-none',
          isCollapsed ? 'w-[80px]' : 'w-[280px]'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={clsx(
            "h-16 flex items-center justify-center",
            "border-b border-gray-100 dark:border-gray-800/50",
            "bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/80"
          )}>
            <Logo collapsed={isCollapsed} />
          </div>

          {/* Navigation Menu */}
          <nav className={clsx(
            "flex-1 relative px-3 py-4",
            isCollapsed ? "overflow-hidden" : "overflow-y-auto scrollbar-none"
          )} ref={navRef}>
            <div className="space-y-1">
              {/* Main Menu Items */}
              {mainMenuItems
                .filter(item => !item.hiddenForRoles?.includes(userRole))
                .map((item, index) => {
                  const isActive = pathname === item.path;
                  return (
                    <MenuItem key={index} item={item} isActive={isActive} />
                  );
                })}

              {/* Divider */}
              {!isCollapsed && (
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-3" />
              )}

              {/* Role-specific Menu Items */}
              {!isCollapsed && getRoleMenuItems().map((item, index) => {
                const isActive = pathname === item.path || pathname.includes(item.path.split('?')[0]);
                const showSection = item.section;

                return (
                  <div key={`role-${index}`}>
                    {showSection && index === 0 && (
                      <div className={clsx(
                        "text-xs font-semibold uppercase tracking-wider",
                        "mt-4 mb-3 px-4",
                        "bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent"
                      )}>
                        {t(item.section as string)}
                      </div>
                    )}
                    <MenuItem item={item} isActive={isActive} />
                  </div>
                );
              })}

              {/* Divider */}
              {!isCollapsed && (
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-3" />
              )}

              {/* Settings */}
              {settingsItems.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <MenuItem key={`settings-${index}`} item={item} isActive={isActive} />
                );
              })}
            </div>

            {/* Scroll indicator */}
            {!isCollapsed && canScroll && !isAtBottom && (
              <div
                style={{ transform: `translateY(${scrollPosition}px)` }}
                className={clsx(
                  "absolute bottom-0 left-0 right-0 h-12",
                  "bg-gradient-to-t from-white dark:from-gray-900 to-transparent",
                  "flex items-center justify-center",
                  "pointer-events-none",
                  "transition-transform duration-75"
                )}
              >
                <ChevronDown className={clsx(
                  "w-5 h-5 text-gray-400 dark:text-gray-500",
                  "animate-bounce"
                )} />
              </div>
            )}
          </nav>

          {/* Bottom Actions */}
          <div className={clsx(
            "p-3 border-t border-gray-100 dark:border-gray-800/50",
            "bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/80"
          )}>
            {/* Language Switcher */}
            <LanguageSwitcher isCollapsed={isCollapsed} />

            <button
              onClick={toggleTheme}
              className={clsx(
                'flex items-center h-12 px-4 rounded-xl w-full mt-1',
                'transition-all duration-200 group',
                'hover:bg-gray-50 dark:hover:bg-gray-800/60',
                'text-gray-700 dark:text-gray-300',
                isCollapsed ? 'justify-center' : ''
              )}
            >
              <div className={clsx(
                'flex items-center justify-center shrink-0',
                'w-6 h-6',
                'text-yellow-500 dark:text-blue-400',
                'group-hover:rotate-12 transition-transform duration-300'
              )}>
                {theme === 'light' ? (
                  <Moon className="w-full h-full" />
                ) : (
                  <Sun className="w-full h-full" />
                )}
              </div>
              {!isCollapsed && (
                <span className={clsx("font-medium tracking-wide", dir === 'rtl' ? "mr-3" : "ml-3")}>
                  {theme === 'light' ? t('common.darkMode') : t('common.lightMode')}
                </span>
              )}
            </button>

            {!isCollapsed && (
              <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-10 h-10 rounded-lg",
                    "bg-gradient-to-r from-blue-600 to-pink-600",
                    "flex items-center justify-center",
                    "text-white font-medium ring-2 ring-white dark:ring-gray-800"
                  )}>
                    {userInitials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                      {session?.user?.name || t('common.guestUser')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {userRole}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className={clsx(
                    "flex items-center w-full mt-3 px-3 py-2 rounded-lg",
                    "bg-white/70 dark:bg-gray-800/30 backdrop-blur-sm",
                    "text-gray-700 dark:text-gray-300 text-sm font-medium",
                    "hover:bg-white dark:hover:bg-gray-800/50 transition-colors"
                  )}
                >
                  <LogOut className={clsx("w-4 h-4", dir === 'rtl' ? "ml-2" : "mr-2")} />
                  <span>{t('common.signOut')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Header */}
      <div className={clsx(
        "fixed top-0 z-30 transition-all duration-300",
        dir === 'rtl' ? 'left-0' : 'right-0',
        dir === 'rtl'
          ? (isCollapsed ? 'right-[80px]' : 'right-[280px]')
          : (isCollapsed ? 'left-[80px]' : 'left-[280px]'),
      )}>
        <header className={clsx(
          "h-16 border-b border-gray-100 dark:border-gray-800/50",
          "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl",
          "shadow-sm shadow-gray-100/50 dark:shadow-none"
        )}>
          <div className="h-full flex items-center justify-between px-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Collapse Button */}
              <button
                onClick={() => onCollapse(!isCollapsed)}
                className={clsx(
                  'w-10 h-10 flex items-center justify-center',
                  'text-gray-500 dark:text-gray-400',
                  'rounded-lg',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'transition-all duration-200'
                )}
              >
                <ChevronLeft className={clsx(
                  "w-5 h-5 transition-transform duration-200",
                  dir === 'rtl'
                    ? (isCollapsed ? "" : "rotate-180")
                    : (isCollapsed ? "rotate-180" : "")
                )} />
              </button>

              {/* Search Bar */}
              <div className={clsx(
                "relative transition-all duration-300",
                isSearchFocused ? "w-full max-w-2xl" : "w-full max-w-md"
              )}>
                <Search className={clsx(
                  "w-5 h-5 absolute top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500",
                  dir === 'rtl' ? "right-3" : "left-3"
                )} />
                <input
                  type="text"
                  placeholder={t('common.search')}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={clsx(
                    "w-full py-2.5",
                    dir === 'rtl' ? "pr-10 pl-4" : "pl-10 pr-4",
                    "bg-gray-50 dark:bg-gray-800/70",
                    "border border-gray-200 dark:border-gray-700/50",
                    "rounded-xl",
                    "text-gray-900 dark:text-gray-100",
                    "placeholder-gray-500 dark:placeholder-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                    "transition-all duration-300"
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className={clsx(
                "w-10 h-10 flex items-center justify-center rounded-lg relative",
                "text-gray-500 dark:text-gray-400",
                "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              )}>
                <Bell className="w-5 h-5" />
                <span className={clsx(
                  dir === 'rtl' ? "absolute top-2 left-2" : "absolute top-2 right-2",
                  "w-2.5 h-2.5 rounded-full",
                  "bg-gradient-to-r from-pink-500 to-purple-500",
                  "ring-2 ring-white dark:ring-gray-900"
                )} />
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 focus:outline-none"
                >
                  <div className={clsx("hidden sm:block", dir === 'rtl' ? "text-left" : "text-right")}>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {session?.user?.name || t('common.guestUser')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {userRole}
                    </div>
                  </div>
                  <div className={clsx(
                    "w-10 h-10 rounded-lg",
                    "bg-gradient-to-r from-blue-600 to-pink-600",
                    "flex items-center justify-center",
                    "text-white font-medium",
                    "ring-2 ring-white dark:ring-gray-900"
                  )}>
                    {userInitials}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className={clsx(
                    "absolute mt-2 w-56",
                    dir === 'rtl' ? "left-0" : "right-0",
                    "bg-white dark:bg-gray-800",
                    "rounded-xl shadow-lg",
                    "border border-gray-100 dark:border-gray-700/50",
                    "py-2 px-1",
                    "animate-in fade-in slide-in duration-200"
                  )}>
                    <Link
                      href="/dashboard/profile"
                      className={clsx(
                        "flex items-center px-4 py-3 rounded-lg mx-1",
                        "text-gray-700 dark:text-gray-300",
                        "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      )}
                    >
                      <Settings className={clsx("w-4 h-4", dir === 'rtl' ? "ml-3" : "mr-3")} />
                      <span>{t('nav.profileSettings')}</span>
                    </Link>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-1 mx-3" />
                    <button
                      onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                      className={clsx(
                        "flex items-center w-full px-4 py-3 rounded-lg mx-1",
                        "text-gray-700 dark:text-gray-300",
                        "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      )}
                    >
                      <LogOut className={clsx("w-4 h-4", dir === 'rtl' ? "ml-3" : "mr-3")} />
                      <span>{t('common.signOut')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}

Navigation.displayName = 'Navigation';