import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  OAuthProvider,
  AuthProvider as FirebaseAuthProvider
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface SocialAuthProps {
  redirectTo?: string;
}

export const SocialAuth: React.FC<SocialAuthProps> = ({ redirectTo = '/dashboard' }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSocialSignIn = async (provider: FirebaseAuthProvider) => {
    try {
      setError('');
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    handleSocialSignIn(provider);
  };

  const handleFacebookSignIn = () => {
    const provider = new FacebookAuthProvider();
    handleSocialSignIn(provider);
  };

  const handleAppleSignIn = () => {
    const provider = new OAuthProvider('apple.com');
    handleSocialSignIn(provider);
  };

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Sign in with Google</span>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
        </button>

        <button
          onClick={handleFacebookSignIn}
          disabled={loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Sign in with Facebook</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <button
          onClick={handleAppleSignIn}
          disabled={loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Sign in with Apple</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.053 8.815c1.272-.059 2.354.96 2.354.96s-1.287 1.787-1.272 3.574c.029 2.858 2.523 3.831 2.523 3.831s-1.757 4.819-4.138 4.819c-1.082 0-1.92-.733-3.047-.733-1.157 0-2.138.748-3.047.748-2.203.044-5.426-4.674-5.426-8.441 0-3.709 2.328-5.668 4.482-5.668 1.405 0 2.513.944 3.047.944.505 0 1.625-.959 3.047-.959.951 0 2.231.425 2.477 1.925zm-.147-3.771c-.683.831-1.803 1.468-2.9 1.382-.147-1.113.41-2.284 1.049-3.028.713-.831 1.947-1.468 2.945-1.382.118 1.113-.44 2.284-1.094 3.028z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}; 