import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserRole } from '../../hooks/useUserRole';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
}

export const ProtectedRoute = ({ children, requireVerification = true }: ProtectedRouteProps) => {
  const { currentUser, loading, isEmailVerified } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // Skip email verification for admin users and social auth users
  if (requireVerification && !isEmailVerified && !isAdmin && !currentUser.providerData[0]?.providerId.includes('google')) {
    return <Navigate to="/verify-email" state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}; 