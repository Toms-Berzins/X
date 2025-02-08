import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuoteStep1 } from '../QuoteStep1';
import { AuthContext } from '@/contexts/AuthContext';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { toast } from 'react-hot-toast';
import type { 
  QuoteData, 
  QuoteStatus, 
  QuoteCoating,
  QuoteAdditionalServices 
} from '../../../types/Quote';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

// Mock dependencies
jest.mock('../../../hooks/useUserProfile');
jest.mock('react-hot-toast');

const mockUseUserProfile = useUserProfile as jest.MockedFunction<typeof useUserProfile>;
const mockToast = toast as jest.Mocked<typeof toast>;

const createMockAuthContext = (overrides = {}) => ({
  currentUser: {
    uid: '1',
    email: 'test@example.com',
    emailVerified: false,
    isAnonymous: false,
    metadata: {
      creationTime: Date.now().toString(),
      lastSignInTime: Date.now().toString(),
    },
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: jest.fn(),
    getIdToken: jest.fn(),
    getIdTokenResult: jest.fn(),
    reload: jest.fn(),
    toJSON: jest.fn(),
    displayName: null,
    phoneNumber: null,
    photoURL: null,
    providerId: 'firebase',
  },
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

const createMockUserProfile = (overrides = {}): UserProfile => ({
  name: 'Test User',
  email: 'test@example.com',
  phone: '1234567890',
  createdAt: new Date().toISOString(),
  ...overrides,
});

const createMockQuoteData = (overrides = {}): QuoteData => ({
  id: '1',
  userId: '1',
  orderNumber: 'Q123',
  status: 'pending' as QuoteStatus,
  items: [],
  total: 0,
  editingItemIndex: null,
  showNoItemsError: false,
  createdAt: new Date().toISOString(),
  coating: {
    type: 'standard',
    color: 'black',
    finish: 'matte',
  },
  additionalServices: {
    sandblasting: false,
    priming: false,
  } as QuoteAdditionalServices,
  contactInfo: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
  },
  discount: 0,
  images: [],
  ...overrides,
});

describe('QuoteStep1', () => {
  const mockQuoteData = createMockQuoteData();
  const mockOnUpdate = jest.fn();
  const mockAuthContext = createMockAuthContext();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUserProfile.mockReturnValue({
      userProfile: createMockUserProfile(),
      loading: false,
      error: null,
      refreshProfile: jest.fn().mockResolvedValue(undefined),
    });
  });

  const renderWithAuth = (ui: React.ReactElement) => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        {ui}
      </AuthContext.Provider>
    );
  };

  it('renders the form with all required fields', () => {
    renderWithAuth(<QuoteStep1 quoteData={mockQuoteData} onUpdate={mockOnUpdate} />);

    expect(screen.getByLabelText(/Item Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument();
  });

  it('shows profile alert when user profile is incomplete', () => {
    mockUseUserProfile.mockReturnValue({
      userProfile: createMockUserProfile({
        name: '',
        email: '',
        phone: '',
      }),
      loading: false,
      error: null,
      refreshProfile: jest.fn().mockResolvedValue(undefined),
    });

    renderWithAuth(<QuoteStep1 quoteData={mockQuoteData} onUpdate={mockOnUpdate} />);

    expect(screen.getByText(/Complete Your Profile/i)).toBeInTheDocument();
  });

  it('validates required fields before adding item', async () => {
    renderWithAuth(<QuoteStep1 quoteData={mockQuoteData} onUpdate={mockOnUpdate} />);

    const addButton = screen.getByRole('button', { name: /Add Item/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Please select an item type/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select a size/i)).toBeInTheDocument();
      expect(mockToast.error).toHaveBeenCalledWith('Please correct the errors before adding the item');
    });

    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('successfully adds an item when all fields are valid', async () => {
    renderWithAuth(<QuoteStep1 quoteData={mockQuoteData} onUpdate={mockOnUpdate} />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Item Type/i), {
      target: { value: 'small-parts' },
    });
    fireEvent.change(screen.getByLabelText(/Size/i), {
      target: { value: 'Up to 6"' },
    });
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: '5' },
    });

    // Submit the form
    const addButton = screen.getByRole('button', { name: /Add Item/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Item added successfully');
      expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            name: 'small-parts',
            size: 'Up to 6"',
            quantity: 5,
          }),
        ]),
      }));
    });
  });

  it('updates an existing item when in edit mode', async () => {
    const editingQuoteData = createMockQuoteData({
      items: [{
        name: 'small-parts',
        size: 'Up to 6"',
        quantity: 1,
        price: 25,
      }],
      editingItemIndex: 0,
    });

    renderWithAuth(<QuoteStep1 quoteData={editingQuoteData} onUpdate={mockOnUpdate} />);

    // Modify the quantity
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: '10' },
    });

    // Update the item
    const updateButton = screen.getByRole('button', { name: /Update Item/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Item updated successfully');
      expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            name: 'small-parts',
            size: 'Up to 6"',
            quantity: 10,
          }),
        ]),
        editingItemIndex: null,
      }));
    });
  });

  it('shows bulk discount message when applicable', () => {
    const quoteDataWithItems = createMockQuoteData({
      items: Array(5).fill({
        name: 'small-parts',
        size: 'Up to 6"',
        quantity: 10,
        price: 25,
      }),
    });

    renderWithAuth(<QuoteStep1 quoteData={quoteDataWithItems} onUpdate={mockOnUpdate} />);

    expect(screen.getByText(/bulk discount/i)).toBeInTheDocument();
  });

  it('validates quantity limits', async () => {
    renderWithAuth(<QuoteStep1 quoteData={mockQuoteData} onUpdate={mockOnUpdate} />);

    // Try to set quantity above maximum
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: '1001' },
    });
    fireEvent.blur(screen.getByLabelText(/Quantity/i));

    expect(screen.getByText(/Maximum quantity is 1000/i)).toBeInTheDocument();

    // Try to set quantity below minimum
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: '0' },
    });
    fireEvent.blur(screen.getByLabelText(/Quantity/i));

    expect(screen.getByText(/Quantity must be at least 1/i)).toBeInTheDocument();
  });

  it('calculates and displays the estimated price', () => {
    renderWithAuth(<QuoteStep1 quoteData={mockQuoteData} onUpdate={mockOnUpdate} />);

    // Select item type and size
    fireEvent.change(screen.getByLabelText(/Item Type/i), {
      target: { value: 'small-parts' },
    });
    fireEvent.change(screen.getByLabelText(/Size/i), {
      target: { value: 'Up to 6"' },
    });
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: '5' },
    });

    expect(screen.getByText(/Estimated Price: \$125\.00/i)).toBeInTheDocument();
  });
}); 