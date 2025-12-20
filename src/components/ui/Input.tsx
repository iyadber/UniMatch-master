import { InputHTMLAttributes, forwardRef, useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const isValueFilled = props.value && String(props.value).length > 0;

    return (
      <div className="space-y-2">
        <label 
          className={clsx(
            "block text-sm font-medium transition-colors duration-200",
            isFocused 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-700 dark:text-gray-300"
          )}
        >
          {label}
        </label>
        <div className={clsx(
          "relative rounded-xl group overflow-hidden",
          "transition-all duration-300",
          isFocused ? "ring-2 ring-blue-500/30 dark:ring-blue-500/20" : ""
        )}>
          {/* Background glow effect */}
          <AnimatePresence>
            {isFocused && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10"
              />
            )}
          </AnimatePresence>

          {/* Input field with icon */}
          <div className="relative flex items-center">
            {icon && (
              <div className={clsx(
                "absolute left-3 flex items-center justify-center",
                "text-gray-400 dark:text-gray-500",
                isFocused ? "text-blue-500 dark:text-blue-400" : ""
              )}>
                {icon}
              </div>
            )}
            
            <input
              ref={ref}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={clsx(
                'w-full transition-all duration-200 relative z-10',
                'bg-white dark:bg-gray-900/70 backdrop-blur-md',
                'border border-gray-200 dark:border-gray-700',
                'text-gray-900 dark:text-gray-100',
                'placeholder-gray-400/80 dark:placeholder-gray-500/80',
                'focus:outline-none',
                icon ? 'pl-10 pr-4' : 'px-4',
                'py-3',
                'rounded-xl',
                error
                  ? 'border-red-500/50 dark:border-red-500/50 focus:border-red-500 dark:focus:border-red-500'
                  : isFocused 
                    ? 'border-blue-500/50 dark:border-blue-500/30' 
                    : 'border-gray-200 dark:border-gray-700',
                isValueFilled && !error ? 'border-green-500/30 dark:border-green-500/20' : '',
                className
              )}
              {...props}
            />
          </div>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-600 dark:text-red-400 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className="w-4 h-4 mr-1.5 flex-shrink-0"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" 
                  clipRule="evenodd" 
                />
              </svg>
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input'; 