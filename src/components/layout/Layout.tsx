import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../shared/ThemeToggle';
import { Transition } from '@headlessui/react';

// Create reusable motion components
const MotionDiv = motion.create('div');
const MotionNav = motion.create('nav');

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser: user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 shadow-lg' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <Link 
                to="/" 
                className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                PowderPro
              </Link>
            </MotionDiv>

            {/* Desktop Navigation */}
            <MotionNav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-8"
            >
              <NavLink to="/services">Services</NavLink>
              <NavLink to="/gallery">Gallery</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>

              <div className="flex items-center space-x-4 ml-4 border-l pl-4 border-gray-200 dark:border-gray-700">
                <ThemeToggle />
                {user ? (
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="flex items-center space-x-3"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.displayName || 'User'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </span>
                      </div>
                      <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </MotionNav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <ThemeToggle />
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open menu</span>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <Transition
          show={isMobileMenuOpen}
          enter="transition duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1 px-4">
              <MobileNavLink to="/services">Services</MobileNavLink>
              <MobileNavLink to="/gallery">Gallery</MobileNavLink>
              <MobileNavLink to="/about">About</MobileNavLink>
              <MobileNavLink to="/contact">Contact</MobileNavLink>
            </div>
            {user && (
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div className="px-4 space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.displayName || 'User'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Transition>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white dark:bg-gray-900 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                PowderPro
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Professional powder coating services for all your needs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/services" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h3>
              <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                <li>123 Powder Street</li>
                <li>Coating City, ST 12345</li>
                <li>Phone: (555) 123-4567</li>
                <li>Email: info@powderpro.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} PowderPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors ${
        isActive ? 'text-primary-600 dark:text-primary-400' : ''
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
};

const MobileNavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
        isActive
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </Link>
  );
}; 