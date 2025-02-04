import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { QuoteData } from '../../pages/Quote';
import { useAuth } from '../../contexts/AuthContext';

interface QuoteStep4Props {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
  onBack: () => void;
}

export const QuoteStep4: React.FC<QuoteStep4Props> = ({
  quoteData,
  onUpdate,
  onBack,
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically send the quote data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit quote:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in or create an account to submit your quote request.
            Your quote details will be saved.
          </p>
          <div className="space-y-4">
            <Link
              to="/login"
              state={{ from: '/quote' }}
              className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              state={{ from: '/quote' }}
              className="block w-full bg-white text-gray-900 px-6 py-3 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Your quote details will be preserved when you return after signing in.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 48 48"
        >
          <circle
            className="opacity-25"
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M16.707 22.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l12-12a1 1 0 10-1.414-1.414L22 27.586l-5.293-5.293z"
          />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Quote Submitted!</h2>
        <p className="mt-2 text-gray-600">
          We'll review your quote and get back to you within 24 hours.
        </p>
        <p className="mt-1 text-gray-600">
          A confirmation email has been sent to {formData.email}
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            View Quote in Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review & Submit</h2>
        <p className="text-gray-600 mb-6">
          Please review your quote details and provide your contact information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Any special requirements or questions?"
            />
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              I agree to the terms and conditions
            </label>
            <p className="text-gray-500">
              By submitting this quote, you agree to our{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="bg-white text-gray-700 px-6 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
          >
            {loading ? 'Submitting...' : 'Submit Quote'}
          </button>
        </div>
      </form>
    </div>
  );
}; 