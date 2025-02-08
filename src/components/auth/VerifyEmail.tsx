import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { AuthContext } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

export const VerifyEmail: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    // Redirect if user is verified or is an admin
    if (currentUser?.emailVerified || isAdmin) {
      navigate(from);
    }
  }, [currentUser?.emailVerified, isAdmin, navigate, from]);

  const handleResendVerification = async () => {
    if (!currentUser) return;

    try {
      setError('');
      setMessage('');
      setLoading(true);
      await sendEmailVerification(currentUser);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking admin status
  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Don't render anything if user is admin or verified (will redirect)
  if (isAdmin || currentUser?.emailVerified) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please verify your email address to continue.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {message}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>
      </div>
    </div>
  );
}; 