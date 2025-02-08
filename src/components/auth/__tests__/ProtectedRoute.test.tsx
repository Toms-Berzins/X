import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { AuthContext } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

// Mock dependencies
jest.mock('react-toastify');
const mockToast = toast as jest.Mocked<typeof toast>;

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

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state when authentication is in progress', () => {
    renderWithAuth(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>,
      { loading: true }
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    renderWithAuth(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(mockToast.error).toHaveBeenCalledWith('Please log in to access this page');
  });

  it('allows access to authenticated users', () => {
    renderWithAuth(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>,
      {
        currentUser: { uid: '1', email: 'test@example.com' }
      }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('prevents access to admin routes for non-admin users', () => {
    renderWithAuth(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(mockToast.error).toHaveBeenCalledWith('You do not have permission to access this page');
  });

  it('allows access to admin routes for admin users', () => {
    renderWithAuth(
      <MemoryRouter>
        <ProtectedRoute requiredRole="admin">
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>,
      {
        currentUser: { uid: '1', email: 'test@example.com', role: 'admin' }
      }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
}); 