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
    <div className="min-h-screen flex flex-col">
      {/* Theme Toggle Button */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={clsx(
          "fixed top-4 right-4 p-2.5 rounded-full z-50",
          "bg-white/20 backdrop-blur-md shadow-lg",
          "dark:bg-gray-900/30",
          "text-gray-700 dark:text-gray-300",
          "border border-gray-200/50 dark:border-gray-700/50",
          "transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        )}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.button>

      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-pink-950/30" />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl dark:mix-blend-overlay opacity-50 animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl dark:mix-blend-overlay opacity-50 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl dark:mix-blend-overlay opacity-50 animate-blob animation-delay-4000" />
        </div>
        
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 dark:opacity-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          {/* Logo */}
          <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-pink-600 shadow-lg shadow-blue-500/20 dark:shadow-pink-600/20 p-0.5">
              <div className="w-full h-full flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 backdrop-blur-sm">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">U</span>
              </div>
            </div>
          </div>
          
          {/* Auth Card */}
          <motion.div 
            className={clsx(
              "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl",
              "rounded-2xl border border-gray-200/50 dark:border-gray-800/50",
              "shadow-xl shadow-blue-500/5 dark:shadow-pink-800/5",
              "p-8 sm:p-10",
              "transition-colors duration-300"
            )}
          >
            <div className="mb-8 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={clsx(
                  "text-3xl font-bold",
                  "bg-gradient-to-r from-blue-600 to-pink-600",
                  "dark:from-blue-400 dark:to-pink-400",
                  "bg-clip-text text-transparent"
                )}
              >
                {title}
              </motion.h1>
              {subtitle && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-2 text-gray-600 dark:text-gray-400"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 