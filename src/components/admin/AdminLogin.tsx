import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, db } from '../../config/firebase';
import type { UserRole } from '../../types/User';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userRef = ref(db, `users/${userCredential.user.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      const userRole = userData?.role as UserRole;

      if (userRole !== 'admin') {
        await auth.signOut();
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in. Please check your credentials.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <Link 
            to="/" 
            className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            PowderPro
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 rounded-xl shadow-2xl p-10"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mx-auto h-12 w-12 text-primary-600 dark:text-primary-400 mb-4"
            >
              <ShieldCheck className="h-12 w-12" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight"
            >
              Admin Login
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-base text-gray-600 dark:text-gray-400"
            >
              Sign in to access admin dashboard
            </motion.p>
          </div>

          {error && (
            <motion.div
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
            </motion.div>
          )}

          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
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
                    placeholder="Enter admin email"
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
                    placeholder="Enter admin password"
                  />
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white
                  ${loading 
                    ? 'bg-primary-400 dark:bg-primary-500 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  } transition-all duration-200 shadow-sm hover:shadow-lg`}
              >
                {loading && <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                {loading ? 'Signing in...' : 'Sign in to Admin'}
              </button>
            </div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
}; 