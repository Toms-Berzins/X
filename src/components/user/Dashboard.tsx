import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfileManagement } from '../../hooks/profile/useProfileManagement';
import { ProfileModal } from './profile/ProfileModal';
import { QuoteList } from '../quote/QuoteList';
import { Button } from '../shared/Button';
import type { User } from '../../types/User';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext';
import type { Quote } from '../../types/Quote';

// Create reusable motion components
const MotionDiv = motion.create('div');

export const UserDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const { handleProfileSubmit, handleCredentialsSubmit, isUpdating } = useProfileManagement();
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const quotes: Quote[] = [
    {
      id: "quote-123456",
      createdAt: "2023-10-10T14:00:00Z",
      total: 500,
      discount: 10,
      status: "approved" as Quote["status"],
      items: [
        { id: "item-1", type: "Widget", name: "Widget", size: "Medium", basePrice: 100, quantity: 2, price: 100 }
      ],
      coating: { type: "Gloss", color: "Red", finish: "Smooth" },
      additionalServices: { sandblasting: true, priming: false, rushOrder: false },
      userId: "user-001",
      orderNumber: "ORD-123456",
      contactInfo: { email: "contact@example.com", name: "Default Contact", phone: "000-000-0000" },
      images: [],
    },
    {
      id: "quote-654321",
      createdAt: "2023-10-12T16:00:00Z",
      total: 750,
      discount: 0,
      status: "in_preparation" as Quote["status"],
      items: [
        { id: "item-2", type: "Gadget", name: "Gadget", size: "Large", basePrice: 250, quantity: 3, price: 250 }
      ],
      coating: { type: "Matte", color: "Blue", finish: "Rough" },
      additionalServices: { sandblasting: false, priming: true, rushOrder: true },
      userId: "user-001",
      orderNumber: "ORD-654321",
      contactInfo: { email: "contact@example.com", name: "Default Contact", phone: "000-000-0000" },
      images: [],
    }
  ];

  // Convert Firebase User to our User type
  const user: User | null = currentUser ? {
    uid: currentUser.uid,
    email: currentUser.email || '',
    displayName: currentUser.displayName || '',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.displayName || 'User'}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">View and manage your quotes</p>
          </div>
          <div className="flex gap-4">
            <Link to="/quote">
              <Button 
                variant="primary"
                className="shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get New Quote
              </Button>
            </Link>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 
                hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Profile Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </MotionDiv>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MotionDiv 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-3"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Quotes</h2>
            <MotionDiv initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
              <QuoteList
                quotes={quotes}
                selectedQuote={selectedQuote}
                onSelectQuote={setSelectedQuote}
                variant="user"
              />
            </MotionDiv>
          </div>
        </MotionDiv>
      </div>

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