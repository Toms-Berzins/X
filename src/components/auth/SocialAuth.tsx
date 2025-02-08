import { useState } from 'react';
import { 
  signInWithPopup,
  GoogleAuthProvider, 
  FacebookAuthProvider,
  OAuthProvider,
  AuthProvider as FirebaseAuthProvider
} from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { ref, get, set } from 'firebase/database';

interface SocialAuthProps {
  redirectTo?: string;
}

export const SocialAuth: React.FC<SocialAuthProps> = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: FirebaseAuthProvider, providerName: string) => {
    try {
      setError('');
      setLoading(true);
      setActiveProvider(providerName);
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in database
      const userRef = ref(db, `users/${result.user.uid}`);
      const userSnapshot = await get(userRef);
      
      // If user doesn't exist, initialize their data
      if (!userSnapshot.exists()) {
        await set(userRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      // Auth state change will be handled by parent component
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setError('Please enable popups for this website to use social login');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Don't show error for user-cancelled operations
        return;
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email address but different sign-in credentials. Please sign in using the original method.');
      } else {
        setError(err.message || 'Failed to sign in');
      }
      console.error('Social sign-in error:', err);
    } finally {
      setLoading(false);
      setActiveProvider(null);
    }
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    handleSocialSignIn(provider, 'google');
  };

  const handleFacebookSignIn = () => {
    const provider = new FacebookAuthProvider();
    provider.addScope('email');
    handleSocialSignIn(provider, 'facebook');
  };

  const handleAppleSignIn = () => {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    handleSocialSignIn(provider, 'apple');
  };

  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative animate-fade-in" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError('')}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="relative flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign in with Google"
        >
          <svg className={`w-5 h-5 transition-opacity duration-200 ${activeProvider === 'google' ? 'opacity-0' : 'opacity-100'}`} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          {activeProvider === 'google' && <LoadingSpinner />}
        </button>

        <button
          onClick={handleFacebookSignIn}
          disabled={loading}
          className="relative flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign in with Facebook"
        >
          <svg className={`w-6 h-6 transition-opacity duration-200 ${activeProvider === 'facebook' ? 'opacity-0' : 'opacity-100'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 12a8 8 0 10-9.25 7.903v-5.59H8.719V12h2.031v-1.762c0-2.005 1.194-3.112 3.022-3.112.875 0 1.79.156 1.79.156V9.25h-1.008c-.994 0-1.304.617-1.304 1.25V12h2.219l-.355 2.313H13.25v5.59A8.002 8.002 0 0020 12" />
          </svg>
          {activeProvider === 'facebook' && <LoadingSpinner />}
        </button>

        <button
          onClick={handleAppleSignIn}
          disabled={loading}
          className="relative flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign in with Apple"
        >
          <svg className={`w-5 h-5 transition-opacity duration-200 ${activeProvider === 'apple' ? 'opacity-0' : 'opacity-100'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
          </svg>
          {activeProvider === 'apple' && <LoadingSpinner />}
        </button>
      </div>
    </div>
  );
}; 