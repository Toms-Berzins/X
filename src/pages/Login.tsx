import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { SocialAuth } from '../components/auth/SocialAuth';

// Create reusable motion components
const MotionDiv = motion.create('div');
const MotionForm = motion.create('form');

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, login } = useContext(AuthContext);
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setIsLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <MotionDiv 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 rounded-xl shadow-2xl p-10"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sign in to access your account
            </p>
          </div>

          <div className="text-center">
            <MotionDiv 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base text-gray-600 dark:text-gray-400"
            >
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
              >
                Sign up
              </Link>
            </MotionDiv>
          </div>

          {error && (
            <MotionDiv
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-md bg-red-50 dark:bg-red-900/50 p-4"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              </div>
            </MotionDiv>
          )}

          <MotionForm 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit} 
            className="mt-8 space-y-6"
          >
            <div className="space-y-6 rounded-md">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                    dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
                    transition-all duration-200"
                    placeholder="Enter your email"
                  />
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                    dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
                    transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white
                  ${isLoading 
                    ? 'bg-primary-400 dark:bg-primary-500 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  } transition-all duration-200 shadow-sm hover:shadow-lg`}
              >
                {isLoading && <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </MotionForm>

          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <SocialAuth />
            </div>
          </MotionDiv>
        </MotionDiv>
      </MotionDiv>
    </div>
  );
};

export default LoginPage; 