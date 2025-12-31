'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthCard } from '@/components/ui/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    if (searchParams.get('registered')) {
      setSuccess(t('auth.registrationSuccess'));
    }
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Basic validation
    if (!email.trim()) {
      setError(t('auth.emailRequired'));
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError(t('auth.passwordRequired'));
      setIsLoading(false);
      return;
    }

    try {
      // Proceed with NextAuth login
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

      const result = await signIn('credentials', {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError(t('auth.invalidCredentials'));
        } else {
          setError(result.error);
        }
      } else {
        // Use router.push with the callbackUrl directly
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof Error) {
        setError(`${t('auth.authError')} ${error.message}`);
      } else {
        setError(t('auth.unexpectedError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <AuthCard
        title={t('auth.welcomeBack')}
        subtitle={t('auth.signInSubtitle')}
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
              className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/20 flex items-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 flex-shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 text-sm border border-green-200 dark:border-green-900/20 flex items-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 flex-shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </motion.div>
          )}

          <Input
            label={t('auth.emailLabel')}
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            icon={<Mail className="w-5 h-5" />}
          />

          <Input
            label={t('auth.passwordLabel')}
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            icon={<Lock className="w-5 h-5" />}
          />

          <div className="flex items-center justify-between">
            <div></div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {isLoading ? t('auth.signingIn') : t('auth.signIn')}
          </Button>

          <div className="relative flex items-center justify-center mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative px-4 bg-white dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400">
              {t('auth.orContinueWith')}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <Button
              variant="secondary"
              type="button"
              className="flex items-center justify-center gap-2"
              onClick={() => signIn('google', { callbackUrl: searchParams.get('callbackUrl') || '/dashboard' })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              <span>{t('auth.signInGoogle')}</span>
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            {t('auth.noAccount')}{' '}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
            >
              {t('auth.signUp')}
            </Link>
          </p>
        </motion.form>
      </AuthCard>
    </ThemeProvider>
  );
} 