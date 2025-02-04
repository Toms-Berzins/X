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
import { Dashboard } from './components/admin/Dashboard';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useUserRole } from './hooks/useUserRole';
import { AdminLogin } from './components/admin/AdminLogin';

// Protected Route component for admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const { isAdmin, loading } = useUserRole();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes with layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/quote" element={<Quote />} />
            </Route>

            {/* Auth routes without layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes without layout */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App; 