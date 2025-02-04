import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { useUserRole } from '../../hooks/useUserRole';

export const VerifyEmail = () => {
  const { currentUser, isEmailVerified } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    // Redirect if user is verified or is an admin
    if (isEmailVerified || isAdmin) {
      navigate(from);
    }
  }, [isEmailVerified, isAdmin, navigate, from]);

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
  if (isAdmin || isEmailVerified) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please check your email ({currentUser?.email}) for a verification link.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Sending...' : 'Resend verification email'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already verified? Try{' '}
            <button
              onClick={() => window.location.reload()}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              refreshing the page
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}; 