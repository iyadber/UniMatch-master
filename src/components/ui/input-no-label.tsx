import { InputHTMLAttributes } from 'react';

type InputNoLabelProps = InputHTMLAttributes<HTMLInputElement>;

export function InputNoLabel(props: InputNoLabelProps) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2.5 rounded-lg transition-colors duration-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
    />
  );
} 