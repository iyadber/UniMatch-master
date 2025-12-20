import { Bell, Search, Menu, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import clsx from 'clsx';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

export function Header({ onMenuClick, isSidebarCollapsed }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();

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
  const userRole = session?.user?.role || 'User';

  return (
    <header 
      className={clsx(
        "h-16 border-b border-gray-200 dark:border-gray-800",
        "bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl",
        "fixed top-0 right-0 z-30 transition-all duration-300",
        isSidebarCollapsed ? 'left-20' : 'left-64',
        'lg:left-20 lg:left-64'
      )}
    >
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          
          {/* Enhanced Search Bar */}
          <div className={clsx(
            "relative transition-all duration-300",
            isSearchFocused ? "w-full max-w-2xl" : "w-full max-w-md"
          )}>
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search anything..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={clsx(
                "w-full pl-10 pr-4 py-2",
                "bg-gray-50 dark:bg-gray-800",
                "border border-gray-200 dark:border-gray-700",
                "rounded-lg",
                "text-gray-900 dark:text-gray-100",
                "placeholder-gray-500 dark:placeholder-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                "transition-all duration-300"
              )}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 focus:outline-none group"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {session?.user?.name || 'Guest User'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {userRole}
                </div>
              </div>
              <div className={clsx(
                "w-8 h-8 rounded-lg",
                "bg-gradient-to-r from-pink-600 to-blue-600",
                "flex items-center justify-center",
                "text-white font-medium text-sm",
                "transition-transform duration-200",
                "group-hover:scale-105"
              )}>
                {userInitials}
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className={clsx(
                "absolute right-0 mt-2 w-48",
                "bg-white dark:bg-gray-800",
                "rounded-lg shadow-lg",
                "border border-gray-200 dark:border-gray-700",
                "py-1",
                "animate-in fade-in slide-in"
              )}>
                <Link 
                  href="/dashboard/profile"
                  className={clsx(
                    "flex items-center px-4 py-2",
                    "text-gray-700 dark:text-gray-300",
                    "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className={clsx(
                    "flex items-center w-full px-4 py-2",
                    "text-gray-700 dark:text-gray-300",
                    "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

Header.displayName = 'Header'; 