import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useTheme } from '@/components/ThemeProvider';
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
  Building2,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

interface MenuItem {
  name: string;
  icon: LucideIcon;
  path: string;
  badge?: number | string;
  section?: string;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Calendar', icon: Calendar, path: '/dashboard/calendar', badge: 2 },
  { name: 'Messages', icon: MessageSquare, path: '/dashboard/messages', badge: 5 },
  {
    name: 'Academic',
    section: 'Academic',
    icon: GraduationCap,
    path: '/dashboard/academic'
  },
  { name: 'Courses', icon: BookOpen, path: '/dashboard/courses' },
  { name: 'Students', icon: Users, path: '/dashboard/students' },
  { name: 'Department', icon: Building2, path: '/dashboard/department' },
  {
    name: 'Financial',
    section: 'Management',
    icon: DollarSign,
    path: '/dashboard/financial'
  },
  { name: 'Notifications', icon: Bell, path: '/dashboard/notifications', badge: 'New' },
  {
    name: 'Help Center',
    section: 'Support',
    icon: HelpCircle,
    path: '/dashboard/help'
  },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export function Sidebar({ isCollapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  let currentSection = '';

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 z-40 h-screen transition-all duration-300',
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
        isCollapsed ? 'w-[72px]' : 'w-[280px]'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo and Collapse Button */}
        <div className="h-16 flex items-center px-3 border-b border-gray-200 dark:border-gray-800">
          <Logo collapsed={isCollapsed} />
          <div className="flex-1" />
          <button
            onClick={() => onCollapse(!isCollapsed)}
            className={clsx(
              'w-8 h-8',
              'flex items-center justify-center',
              'text-gray-500 dark:text-gray-400',
              'hover:text-gray-900 dark:hover:text-gray-100',
              'focus:outline-none',
              'transition-transform duration-200',
              isCollapsed && 'rotate-180'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu with Modern Scrollbar */}
        <nav className={clsx(
          "flex-1",
          isCollapsed
            ? "overflow-hidden"
            : "overflow-y-auto py-3"
        )}>
          <div className={clsx(
            "px-3",
            isCollapsed ? "space-y-4" : "space-y-1"
          )}>
            {/* Primary Menu Items (Always Visible) */}
            {menuItems.slice(0, 5).map((item, index) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={index}
                  href={item.path}
                  className={clsx(
                    'group flex items-center h-10 gap-x-3 px-2 rounded-lg',
                    'transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  )}
                >
                  <div className={clsx(
                    'flex items-center justify-center transition-all duration-200',
                    isCollapsed ? 'w-10 h-10' : 'w-6 h-6',
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                  )}>
                    <item.icon className="w-full h-full" />
                  </div>
                  <span className={clsx(
                    'whitespace-nowrap font-medium transition-all duration-200',
                    isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                  )}>
                    {item.name}
                  </span>
                  {item.badge && !isCollapsed && (
                    <span className={clsx(
                      'ml-auto px-2 py-0.5 rounded-full text-xs font-semibold min-w-[20px] text-center',
                      typeof item.badge === 'number'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                    )}>
                      {item.badge}
                    </span>
                  )}
                  {item.badge && isCollapsed && (
                    <span className={clsx(
                      'absolute top-0.5 right-0.5',
                      'w-2 h-2 rounded-full',
                      typeof item.badge === 'number'
                        ? 'bg-blue-400 dark:bg-blue-500'
                        : 'bg-pink-400 dark:bg-pink-500'
                    )} />
                  )}
                </Link>
              );
            })}

            {/* Secondary Menu Items (Hidden when Collapsed) */}
            {!isCollapsed && menuItems.slice(5).map((item, index) => {
              const isActive = pathname === item.path;
              const showSection = item.section && currentSection !== item.section;
              currentSection = item.section || currentSection;

              return (
                <div key={index + 5}>
                  {showSection && (
                    <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-6 mb-2 px-2">
                      {item.section}
                    </div>
                  )}
                  <Link
                    href={item.path}
                    className={clsx(
                      'group flex items-center h-10 gap-x-3 px-2 rounded-lg',
                      'transition-all duration-200',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    )}
                  >
                    <div className={clsx(
                      'flex items-center justify-center transition-all duration-200',
                      'w-6 h-6',
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                    )}>
                      <item.icon className="w-full h-full" />
                    </div>
                    <span className="whitespace-nowrap font-medium">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className={clsx(
                        'ml-auto px-2 py-0.5 rounded-full text-xs font-semibold min-w-[20px] text-center',
                        typeof item.badge === 'number'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <button
            onClick={toggleTheme}
            className={clsx(
              'group flex items-center h-10 gap-x-3 px-2 rounded-lg w-full',
              'transition-all duration-200',
              'hover:bg-gray-50 dark:hover:bg-gray-800',
              'text-gray-700 dark:text-gray-300'
            )}
          >
            <div className={clsx(
              'flex items-center justify-center transition-all duration-200',
              isCollapsed ? 'w-10 h-10' : 'w-6 h-6',
              'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-200'
            )}>
              {theme === 'light' ? (
                <Moon className="w-full h-full" />
              ) : (
                <Sun className="w-full h-full" />
              )}
            </div>
            <span className={clsx(
              'whitespace-nowrap font-medium transition-all duration-200',
              isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            )}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className={clsx(
              'group flex items-center h-10 gap-x-3 px-2 rounded-lg w-full',
              'transition-all duration-200',
              'hover:bg-gray-50 dark:hover:bg-gray-800',
              'text-gray-700 dark:text-gray-300'
            )}
          >
            <div className={clsx(
              'flex items-center justify-center transition-all duration-200',
              isCollapsed ? 'w-10 h-10' : 'w-6 h-6',
              'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-200'
            )}>
              <LogOut className="w-full h-full" />
            </div>
            <span className={clsx(
              'whitespace-nowrap font-medium transition-all duration-200',
              isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            )}>
              Sign out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

Sidebar.displayName = 'Sidebar'; 