import Link from 'next/link';
import clsx from 'clsx';

interface LogoProps {
  collapsed?: boolean;
}

export function Logo({ collapsed }: LogoProps) {
  return (
    <Link 
      href="/dashboard" 
      className={clsx(
        "flex items-center",
        collapsed ? "justify-center" : "space-x-3",
        "transition-all duration-300 transform hover:scale-105"
      )}
    >
      <div className={clsx(
        "flex items-center justify-center transition-all duration-300",
        "bg-gradient-to-r from-blue-600 to-pink-600",
        "shadow-md shadow-blue-500/10 dark:shadow-pink-500/10",
        "rounded-xl overflow-hidden",
        "border-2 border-white/80 dark:border-gray-800/80",
        collapsed ? "w-12 h-12" : "w-10 h-10"
      )}>
        <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-sm opacity-50"></div>
        <span className={clsx(
          "font-bold text-white transition-all duration-300 relative z-10",
          "bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 dark:from-white dark:to-pink-100",
          "drop-shadow-sm",
          collapsed ? "text-2xl" : "text-xl"
        )}>U</span>
      </div>
      {!collapsed && (
        <span className={clsx(
          "text-xl font-bold transition-all duration-300",
          "bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent",
          "drop-shadow-sm",
          "relative"
        )}>
          UniMatch
          <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/50 to-pink-500/50 rounded-full"></div>
        </span>
      )}
    </Link>
  );
} 