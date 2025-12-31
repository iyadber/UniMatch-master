'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Navigation } from '@/components/layout/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import { Inter } from 'next/font/google';
import clsx from 'clsx';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { status } = useSession();

  const { t, dir } = useLanguage();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div
        dir={dir}
        className={clsx(
          inter.className,
          'min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'
        )}>
        <Navigation
          isCollapsed={isSidebarCollapsed}
          onCollapse={setIsSidebarCollapsed}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <main className={clsx(
          'pt-16 transition-all duration-300',
          dir === 'rtl'
            ? (isSidebarCollapsed ? 'lg:pr-[72px]' : 'lg:pr-[280px]')
            : (isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[280px]')
        )}>
          <div className="px-4 py-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
} 