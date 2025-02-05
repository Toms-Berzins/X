import { useQuotes } from '../../hooks/useQuotes';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { useProfileManagement } from '../../hooks/profile/useProfileManagement';
import { ProfileModal } from './profile/ProfileModal';
import { QuoteList } from './quotes/QuoteList';
import type { Quote, User } from '../../types/User';
import type { QuoteData } from '../../types/Quote';

// Convert QuoteData to Quote type with all required fields
const convertToQuote = (quote: QuoteData, index: number, currentUser: any): Quote => ({
  ...quote,
  orderNumber: `Q${String(index + 1).padStart(6, '0')}`,
  trackingNumber: '',
  userId: quote.userId || currentUser?.uid || '',
  updatedAt: quote.updatedAt || quote.createdAt,
  contactInfo: {
    name: quote.contactInfo?.name || currentUser?.displayName || '',
    email: quote.contactInfo?.email || currentUser?.email || '',
    phone: quote.contactInfo?.phone || '',
    notes: quote.contactInfo?.notes || ''
  }
});

export const UserDashboard = () => {
  const { quotes, loading, error } = useQuotes();
  const { currentUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const { handleProfileSubmit, handleCredentialsSubmit, isUpdating } = useProfileManagement();
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  // Convert QuoteData to Quote type
  const enhancedQuotes: Quote[] = quotes.map((quote, index) => 
    convertToQuote(quote, index, currentUser)
  );

  // Convert Firebase User to our User type
  const user: User | null = currentUser ? {
    uid: currentUser.uid,
    email: currentUser.email || '',
    displayName: currentUser.displayName || '',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } : null;

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Quotes</h1>
        <button
          onClick={() => setIsProfileOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Profile Settings
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading quotes. Please try again later.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <QuoteList 
          quotes={enhancedQuotes}
          selectedQuote={selectedQuote}
          onSelectQuote={setSelectedQuote}
        />
      )}

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onProfileSubmit={handleProfileSubmit}
        onCredentialsSubmit={handleCredentialsSubmit}
        isUpdating={isUpdating}
        currentUser={user}
      />
    </div>
  );
}; 