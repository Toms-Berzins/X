import { useAuth } from '../../contexts/AuthContext';
import { useQuotes } from '../../hooks/useQuotes';
import { useUserRole } from '../../hooks/useUserRole';
import { useQuoteOperations } from '../../hooks/useQuoteOperations';
import { useState } from 'react';
import { Quote } from '../../types/User';
import { EditFormType } from './types/DashboardTypes';
import { QuoteTable } from './components/QuoteTable';
import { DeleteModal } from './components/DeleteModal';

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const { quotes, loading: quotesLoading, error: quotesError } = useQuotes(false);
  const { role, loading: roleLoading, error: roleError, isAdmin } = useUserRole();
  const { updateQuote, deleteQuote, loading: operationLoading, error: operationError } = useQuoteOperations();
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [editingQuote, setEditingQuote] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [editForm, setEditForm] = useState<EditFormType | null>(null);
  const [deleteModalQuote, setDeleteModalQuote] = useState<Quote | null>(null);

  const handleStatusUpdate = async (quoteId: string, newStatus: 'approved' | 'rejected' | 'completed') => {
    try {
      await updateQuote(quoteId, { status: newStatus });
      if (newStatus === 'approved') {
        setTrackingNumber('');
      }
    } catch (error) {
      console.error('Failed to update quote status:', error);
    }
  };

  const handleTrackingUpdate = async (quoteId: string, trackingNumber: string) => {
    try {
      await updateQuote(quoteId, { trackingNumber });
      alert('Tracking number updated successfully');
    } catch (error) {
      console.error('Failed to update tracking number:', error);
    }
  };

  const handleEditClick = (quote: Quote) => {
    if (editingQuote === quote.id) {
      // If already editing this quote, close it
      setSelectedQuote(null);
      setEditingQuote(null);
      setEditForm(null);
      return;
    }

    // Otherwise, open it for editing
    setSelectedQuote(quote.id);
    setEditingQuote(quote.id);
    setEditForm({
      orderNumber: quote.orderNumber,
      items: [...quote.items],
      coating: {
        type: quote.coating.type,
        color: quote.coating.color,
        finish: quote.coating.finish,
        priceMultiplier: quote.coating.priceMultiplier
      },
      additionalServices: {
        sandblasting: quote.additionalServices.sandblasting,
        priming: quote.additionalServices.priming,
        rushOrder: quote.additionalServices.rushOrder
      },
      contactInfo: {
        name: quote.contactInfo.name,
        email: quote.contactInfo.email,
        phone: quote.contactInfo.phone,
        notes: quote.contactInfo.notes
      },
      subtotal: quote.subtotal,
      discount: quote.discount,
      total: quote.total
    });
  };

  const handleEditFormChange = (field: string, value: any) => {
    setEditForm(prev => {
      if (!prev) return prev;
      
      if (field.includes('.')) {
        const [section, key] = field.split('.');
        const sectionKey = section as keyof EditFormType;
        const currentSection = prev[sectionKey];
        
        if (typeof currentSection === 'object' && currentSection !== null) {
          return {
            ...prev,
            [section]: {
              ...currentSection,
              [key]: value
            }
          };
        }
        return prev;
      }
      
      if (field === 'items') {
        return {
          ...prev,
          items: value,
          subtotal: calculateSubtotal(value),
          total: calculateTotal(value, prev.discount)
        };
      }
      
      return { ...prev, [field]: value };
    });
  };

  const calculateSubtotal = (items: EditFormType['items']) => {
    return items.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
  };

  const calculateTotal = (items: EditFormType['items'], discount: number) => {
    const subtotal = calculateSubtotal(items);
    return subtotal * (1 - discount / 100);
  };

  const handleEdit = async (quoteId: string) => {
    try {
      if (!editForm) return;
      
      // Validate required fields
      if (!editForm.orderNumber?.trim()) {
        throw new Error('Order number is required');
      }
      
      if (!editForm.items?.length) {
        throw new Error('At least one item is required');
      }
      
      // Validate each item
      editForm.items.forEach((item, index) => {
        if (!item.type?.trim()) throw new Error(`Item ${index + 1} type is required`);
        if (!item.size?.trim()) throw new Error(`Item ${index + 1} size is required`);
        if (!item.quantity || item.quantity < 1) throw new Error(`Item ${index + 1} must have a valid quantity`);
        if (typeof item.basePrice !== 'number' || item.basePrice < 0) throw new Error(`Item ${index + 1} must have a valid base price`);
      });
      
      // Validate coating
      if (!editForm.coating?.type?.trim()) throw new Error('Coating type is required');
      if (!editForm.coating?.color?.trim()) throw new Error('Coating color is required');
      if (!editForm.coating?.finish?.trim()) throw new Error('Coating finish is required');
      if (typeof editForm.coating?.priceMultiplier !== 'number' || editForm.coating.priceMultiplier <= 0) {
        throw new Error('Coating price multiplier must be a positive number');
      }
      
      // Validate contact info
      if (!editForm.contactInfo?.name?.trim()) throw new Error('Contact name is required');
      if (!editForm.contactInfo?.email?.trim()) throw new Error('Contact email is required');
      if (!editForm.contactInfo?.phone?.trim()) throw new Error('Contact phone is required');
      
      // Validate pricing
      if (typeof editForm.subtotal !== 'number' || editForm.subtotal < 0) throw new Error('Subtotal must be a non-negative number');
      if (typeof editForm.discount !== 'number' || editForm.discount < 0 || editForm.discount > 100) {
        throw new Error('Discount must be between 0 and 100');
      }
      if (typeof editForm.total !== 'number' || editForm.total < 0) throw new Error('Total must be a non-negative number');
      
      await updateQuote(quoteId, {
        orderNumber: editForm.orderNumber.trim(),
        items: editForm.items.map(item => ({
          ...item,
          type: item.type.trim(),
          size: item.size.trim()
        })),
        coating: {
          ...editForm.coating,
          type: editForm.coating.type.trim(),
          color: editForm.coating.color.trim(),
          finish: editForm.coating.finish.trim()
        },
        additionalServices: editForm.additionalServices,
        contactInfo: {
          ...editForm.contactInfo,
          name: editForm.contactInfo.name.trim(),
          email: editForm.contactInfo.email.trim(),
          phone: editForm.contactInfo.phone.trim(),
          notes: editForm.contactInfo.notes?.trim() || ''
        },
        subtotal: editForm.subtotal,
        discount: editForm.discount,
        total: editForm.total
      });
      
      setEditingQuote(null);
      setEditForm(null);
    } catch (error) {
      console.error('Failed to update quote:', error);
      alert(error instanceof Error ? error.message : 'Failed to update quote');
    }
  };

  const handleDeleteClick = (quote: Quote) => {
    setDeleteModalQuote(quote);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalQuote) return;
    
    try {
      await deleteQuote(deleteModalQuote.id);
      setDeleteModalQuote(null);
    } catch (error) {
      console.error('Failed to delete quote:', error);
    }
  };

  const handleProgressUpdate = async (quoteId: string, newStatus: Quote['status']) => {
    try {
      await updateQuote(quoteId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update quote status:', error);
    }
  };

  if (roleLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {quotesError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {quotesError}
            </div>
          )}
          
          {operationError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {operationError}
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Quote Management</h2>
              
              {quotesLoading ? (
                <div className="text-center py-4">Loading quotes...</div>
              ) : (
                <QuoteTable
                  quotes={quotes}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                  selectedQuote={selectedQuote}
                  setSelectedQuote={setSelectedQuote}
                  editingQuote={editingQuote}
                  editForm={editForm}
                  handleEditFormChange={handleEditFormChange}
                  handleEdit={handleEdit}
                  handleProgressUpdate={handleProgressUpdate}
                  handleStatusUpdate={handleStatusUpdate}
                  handleTrackingUpdate={handleTrackingUpdate}
                  trackingNumber={trackingNumber}
                  setTrackingNumber={setTrackingNumber}
                  operationLoading={operationLoading}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <DeleteModal
        quote={deleteModalQuote}
        onClose={() => setDeleteModalQuote(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}; 