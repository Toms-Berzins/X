import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { AdminDashboard } from '@/components/admin/Dashboard';
import { UserDashboard } from '@/components/user/Dashboard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const { isAdmin, loading: roleLoading, error } = useUserRole();

  // Show loading spinner while either auth or role is loading
  if (authLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if no user
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Show error state if role check failed
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
        <p className="text-gray-600 text-center mb-4">{error.message}</p>
        <p className="text-gray-500 text-sm">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardPage; 