import { ReactNode } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Theme Toggle Button */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={clsx(
          "fixed top-6 right-6 p-2 rounded-full z-50",
          "bg-white dark:bg-gray-900 shadow-sm hover:shadow-md",
          "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
          "border border-gray-200 dark:border-gray-800",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        )}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.button>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <span className="text-xl font-bold text-white">U</span>
            </div>
          </div>

          {/* Auth Card */}
          <div className={clsx(
            "bg-white dark:bg-gray-900",
            "rounded-2xl border border-gray-200 dark:border-gray-800",
            "shadow-xl shadow-gray-200/50 dark:shadow-none",
            "p-8 sm:p-10",
            "transition-all duration-300"
          )}>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>

            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 