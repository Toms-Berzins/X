import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import { Quotes } from './pages/Quotes';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import { QuoteForm } from './components/quote/QuoteForm';
import { QuoteDetail } from './components/quote/QuoteDetail';
import { QuoteEdit } from './components/quote/QuoteEdit';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { VerifyEmail } from './components/auth/VerifyEmail';
import { AdminDashboard } from './components/admin/Dashboard';
import { UserDashboard } from './components/user/Dashboard';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { useUserRole } from './hooks/useUserRole';
import { AdminLogin } from './components/admin/AdminLogin';
import { Loading } from './components/shared/Loading';

// Wrapper components to handle URL params
const QuoteDetailWrapper = () => {
  const { id } = useParams();
  return <QuoteDetail id={id!} />;
};

const QuoteEditWrapper = () => {
  const { id } = useParams();
  return <QuoteEdit id={id!} />;
};

// Combined Dashboard component that renders based on user role
const CombinedDashboard = () => {
  const { isAdmin, loading } = useUserRole();
  
  if (loading) {
    return <Loading size="lg" label="Loading dashboard..." />;
  }
  
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <CombinedDashboard />
        </ProtectedRoute>
      } />
      
      {/* Unified Quotes Routes */}
      <Route path="/quotes" element={
        <ProtectedRoute>
          <Quotes />
        </ProtectedRoute>
      } />
      <Route path="/quotes/new" element={
        <ProtectedRoute>
          <QuoteForm />
        </ProtectedRoute>
      } />
      <Route path="/quotes/:id" element={
        <ProtectedRoute>
          <QuoteDetailWrapper />
        </ProtectedRoute>
      } />
      <Route path="/quotes/:id/edit" element={
        <ProtectedRoute adminOnly>
          <QuoteEditWrapper />
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}; 