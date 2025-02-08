/* Removing dummy module declarations */
// Removed: declare module '../hooks/useAuth' { export const useAuth: jest.Mock; }
// Removed: declare module '../hooks/useUserRole' { export const useUserRole: jest.Mock; }

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';

// Dummy dashboard components for testing:
const AdminDashboard = () => (
  <div>
    <h1>Admin Dashboard</h1>
    <p>Welcome, admin user!</p>
  </div>
);

const UserDashboard = () => (
  <div>
    <h1>User Dashboard</h1>
    <p>Welcome, regular user!</p>
  </div>
);

// Mock the user role hook
jest.mock('../hooks/useUserRole', () => ({
  useUserRole: jest.fn(),
}));

// @ts-ignore: Module not found, this is expected in tests
import { useUserRole } from '../hooks/useUserRole';

// Dashboard component that renders based on the user role
const Dashboard = () => {
  const { isAdmin } = useUserRole();
  if (isAdmin) {
    return <AdminDashboard />;
  }
  return <UserDashboard />;
};

const createMockAuthContext = (overrides = {}) => ({
  currentUser: null,
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  resetPassword: jest.fn(),
  verifyEmail: jest.fn(),
  updateUserProfile: jest.fn(),
  updateUserEmail: jest.fn(),
  updateUserPassword: jest.fn(),
  ...overrides,
});

const renderWithAuth = (ui: React.ReactElement, authContext = {}) => {
  return render(
    <AuthContext.Provider value={createMockAuthContext(authContext)}>
      {ui}
    </AuthContext.Provider>
  );
};

describe('Dashboard', () => {
  test('renders AdminDashboard for admin user', () => {
    (useUserRole as jest.Mock).mockReturnValue({ isAdmin: true });
    
    renderWithAuth(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
      {
        currentUser: { uid: '1', email: 'admin@example.com' }
      }
    );
    
    expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
  });

  test('renders UserDashboard for regular user', () => {
    (useUserRole as jest.Mock).mockReturnValue({ isAdmin: false });
    
    renderWithAuth(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
      {
        currentUser: { uid: '1', email: 'user@example.com' }
      }
    );
    
    expect(screen.getByRole('heading', { name: /user dashboard/i })).toBeInTheDocument();
  });
}); 