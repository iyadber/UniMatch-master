import { InputHTMLAttributes, forwardRef, useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, icon, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Handle password visibility toggle
    const isPasswordType = type === 'password';
    const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="space-y-1.5">
        <label
          className={clsx(
            "block text-sm font-medium transition-colors duration-200",
            isFocused
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-700 dark:text-gray-300"
          )}
        >
          {label}
        </label>
        <div className="relative group">

          {/* Input field with icon */}
          <div className="relative flex items-center">
            {icon && (
              <div className={clsx(
                "absolute left-3 flex items-center justify-center pointer-events-none",
                "text-gray-400 dark:text-gray-500",
                isFocused ? "text-gray-900 dark:text-gray-100" : ""
              )}>
                {icon}
              </div>
            )}

            <input
              ref={ref}
              type={inputType}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={clsx(
                'w-full transition-all duration-200',
                'bg-white dark:bg-gray-950',
                'border',
                'text-gray-900 dark:text-gray-100',
                'placeholder-gray-400 dark:placeholder-gray-600',
                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                icon ? 'pl-10' : 'px-4',
                isPasswordType ? 'pr-10' : 'pr-4',
                'py-2.5',
                'rounded-lg',
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                  : isFocused
                    ? 'border-blue-600 focus:border-blue-600 focus:ring-blue-600/10 dark:border-blue-500 dark:focus:border-blue-500'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700',
                className
              )}
              {...props}
            />

            {/* Password Toggle Button */}
            {isPasswordType && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={clsx(
                  "absolute right-3 z-20 p-1 rounded-full",
                  "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300",
                  "transition-colors duration-200 focus:outline-none"
                )}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center mt-1">
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
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';