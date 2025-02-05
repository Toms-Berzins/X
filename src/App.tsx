import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Gallery } from './pages/Gallery';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Quote } from './pages/Quote';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { VerifyEmail } from './components/auth/VerifyEmail';
import { AdminDashboard } from './components/admin/Dashboard';
import { UserDashboard } from './components/user/Dashboard';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { useUserRole } from './hooks/useUserRole';
import { AdminLogin } from './components/admin/AdminLogin';
import { EditQuotePage } from './components/admin/pages/EditQuotePage';

// Combined Dashboard component that renders based on user role
const CombinedDashboard = () => {
  const { isAdmin, loading } = useUserRole();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router {...router}>
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/quote" element={<Quote />} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

              {/* Protected dashboard route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <CombinedDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/quotes/:id/edit"
                element={
                  <ProtectedRoute adminOnly>
                    <EditQuotePage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App; 