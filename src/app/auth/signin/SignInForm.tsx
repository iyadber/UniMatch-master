'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthCard } from '@/components/ui/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Mail, Lock, CheckSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered')) {
      setSuccess('Registration successful! Please sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }
    
    if (!password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }
    
    try {
      // Test authentication directly first for debugging
      const testResponse = await fetch('/api/test-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const testResult = await testResponse.json();
      console.log('Direct auth test result:', testResult);
      
      // Proceed with NextAuth login
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      console.log('Attempting sign-in with callbackUrl:', callbackUrl);
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      console.log('Sign-in result:', result);

      if (result?.error) {
        console.log("Authentication error details:", result);
        if (result.error === 'CredentialsSignin') {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(result.error);
        }
      } else {
        console.log('Authentication successful, redirecting to:', callbackUrl);
        
        // Use router.push with the callbackUrl directly without converting to absolute URL
        router.push(callbackUrl);
        
        // Fallback to window.location after a short delay if router.push doesn't work
        setTimeout(() => {
          if (window.location.pathname !== new URL(callbackUrl, window.location.origin).pathname) {
            window.location.href = callbackUrl;
          }
        }, 500);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof Error) {
        setError(`Authentication error: ${error.message}`);
      } else {
        setError('An unexpected error occurred during sign in. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <AuthCard
        title="Welcome Back!"
        subtitle="Sign in to your UniMatch account"
      >
        <motion.form 
          className="space-y-6" 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-800/30 backdrop-blur-sm flex items-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-green-50/80 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm border border-green-100 dark:border-green-800/30 backdrop-blur-sm flex items-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </motion.div>
          )}
          
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            icon={<Mail className="w-5 h-5" />}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            icon={<Lock className="w-5 h-5" />}
          />
          
          <div className="flex items-center justify-between">
            <label className="flex items-center group cursor-pointer">
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200 ${
                  rememberMe 
                    ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                }`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && <CheckSquare className="w-4 h-4 text-white" />}
              </div>
              <span 
                className="ml-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-200"
                onClick={() => setRememberMe(!rememberMe)}
              >
                Remember me
              </span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            isLoading={isLoading}
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="relative flex items-center justify-center mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative px-4 bg-white dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400">
              Or continue with
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button 
              variant="secondary" 
              type="button"
              className="flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              <span>Google</span>
            </Button>
            <Button 
              variant="secondary" 
              type="button"
              className="flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-5 h-5">
                <path fill="#1877F2" d="M15 8a7 7 0 0 0-7-7 7 7 0 0 0-1.094 13.915v-4.892H5.13V8h1.777V6.458c0-1.754 1.045-2.724 2.644-2.724.766 0 1.567.137 1.567.137v1.723h-.883c-.87 0-1.14.54-1.14 1.093V8h1.941l-.31 2.023H9.094v4.892A7.001 7.001 0 0 0 15 8z"/>
                <path fill="#ffffff" d="M10.725 10.023 11.035 8H9.094V6.687c0-.553.27-1.093 1.14-1.093h.883V3.87s-.801-.137-1.567-.137c-1.6 0-2.644.97-2.644 2.724V8H5.13v2.023h1.777v4.892a7.037 7.037 0 0 0 2.188 0v-4.892h1.63z"/>
              </svg>
              <span>Facebook</span>
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </motion.form>
      </AuthCard>
    </ThemeProvider>
  );
} 