import { useNavigate } from 'react-router-dom';
import { useQuotes } from '../../hooks/useQuotes';
import { useUserRole } from '../../hooks/useUserRole';
import { useState, useEffect } from 'react';
import { OrderTracking } from '../quote/OrderTracking';
import React from 'react';
import { formatCurrency, formatDimension } from '../../pages/Quote';
import { useProfileManagement } from '../../hooks/profile/useProfileManagement';
import { ProfileModal } from './profile/ProfileModal';
import { QuoteList } from './quotes/QuoteList';
import type { User, Quote } from '../../types/User';
import type { QuoteData } from '../../types/Quote';

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { quotes, loading: quotesLoading, error: quotesError, fetchQuotes } = useQuotes();
  const { role } = useUserRole();
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const profileManagement = useProfileManagement();

  // Fetch only the current user's quotes on mount
  useEffect(() => {
    if (profileManagement.currentUser) {
      fetchQuotes(profileManagement.currentUser.uid);
    }
  }, [fetchQuotes, profileManagement.currentUser]);

  // Convert QuoteData to Quote type
  const userQuotes: Quote[] = quotes.map(quote => ({
    ...quote,
    orderNumber: quote.id.slice(-6), // Use last 6 characters of ID as order number
    status: quote.status as Quote['status'], // Cast the status to the more specific type
    trackingNumber: '', // Add default tracking number
    userId: quote.userId || profileManagement.currentUser?.uid || '', // Use current user's ID if not set
    contactInfo: {
      name: quote.contactInfo?.name || '',
      email: quote.contactInfo?.email || '',
      phone: quote.contactInfo?.phone || '',
      notes: quote.contactInfo?.notes || '',
    },
    promoCode: quote.promoCode || '', // Ensure promoCode is set
    updatedAt: quote.updatedAt || quote.createdAt, // Use createdAt as fallback for updatedAt
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'in_preparation':
        return 'bg-purple-100 text-purple-800';
      case 'coating':
        return 'bg-indigo-100 text-indigo-800';
      case 'curing':
        return 'bg-cyan-100 text-cyan-800';
      case 'quality_check':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your quote is being reviewed by our team.';
      case 'approved':
        return 'Your quote has been approved! We will contact you soon to proceed.';
      case 'rejected':
        return 'Your quote was not approved. Please contact us for more information.';
      case 'completed':
        return 'Your order has been completed. Thank you for your business!';
      default:
        return '';
    }
  };

  if (quotesLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">My Dashboard</h1>
            <button
              onClick={() => profileManagement.setIsProfileOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          </div>

          <ProfileModal
            isOpen={profileManagement.isProfileOpen}
            onClose={() => profileManagement.setIsProfileOpen(false)}
            activeTab={profileManagement.activeTab}
            setActiveTab={profileManagement.setActiveTab}
            onProfileSubmit={profileManagement.handleProfileSubmit}
            onCredentialsSubmit={profileManagement.handleCredentialsSubmit}
            isUpdating={profileManagement.isUpdating}
            currentUser={profileManagement.currentUser as unknown as User}
          />

          {quotesError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {quotesError.message || 'Failed to load quotes'}
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">My Quotes</h2>
              </div>

              {userQuotes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any quotes yet.</p>
                  <button
                    onClick={() => navigate('/quote')}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Get Your First Quote
                  </button>
                </div>
              ) : (
                <QuoteList
                  quotes={userQuotes}
                  selectedQuote={selectedQuote}
                  onSelectQuote={setSelectedQuote}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 