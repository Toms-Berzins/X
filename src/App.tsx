import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Gallery } from './pages/Gallery';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/admin/Dashboard';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

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
            </Route>

            {/* Auth routes without layout */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes without layout */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App; 