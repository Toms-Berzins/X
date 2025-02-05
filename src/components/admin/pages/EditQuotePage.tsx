import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditQuoteForm } from '../components/EditQuoteForm';
import { useQuotes } from '@/hooks/useQuotes';
import { useQuoteOperations } from '@/hooks/useQuoteOperations';
import { toast } from 'react-hot-toast';
import type { Quote } from '@/types/User';
import type { EditFormType } from '../types/DashboardTypes';

export const EditQuotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quotes } = useQuotes();
  const { updateQuote } = useQuoteOperations();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [editForm, setEditForm] = useState<EditFormType | null>(null);

  useEffect(() => {
    if (id && quotes.length > 0) {
      const foundQuote = quotes.find(q => q.id === id);
      if (foundQuote) {
        // Since QuoteData extends BaseQuote, we can safely cast it to Quote
        const quoteWithoutImages: Quote = {
          id: foundQuote.id,
          userId: foundQuote.userId,
          orderNumber: foundQuote.orderNumber,
          status: foundQuote.status,
          items: foundQuote.items,
          coating: foundQuote.coating,
          additionalServices: foundQuote.additionalServices,
          contactInfo: foundQuote.contactInfo,
          total: foundQuote.total,
          discount: foundQuote.discount,
          createdAt: foundQuote.createdAt,
          updatedAt: foundQuote.updatedAt,
          updatedBy: foundQuote.updatedBy
        };

        setQuote(quoteWithoutImages);
        setEditForm({
          orderNumber: quoteWithoutImages.orderNumber,
          items: quoteWithoutImages.items,
          coating: quoteWithoutImages.coating,
          additionalServices: quoteWithoutImages.additionalServices,
          contactInfo: quoteWithoutImages.contactInfo,
          total: quoteWithoutImages.total,
          subtotal: quoteWithoutImages.total + (quoteWithoutImages.discount || 0),
          discount: quoteWithoutImages.discount
        });
      } else {
        toast.error('Quote not found');
        navigate('/dashboard');
      }
    }
  }, [id, quotes, navigate]);

  const handleEditFormChange = (field: string, value: any) => {
    if (!editForm) return;

    const fields = field.split('.');
    if (fields.length === 1) {
      setEditForm(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [field]: value
        };
      });
    } else {
      const [parent, child] = fields;
      setEditForm(prev => {
        if (!prev) return prev;
        const parentValue = prev[parent as keyof EditFormType];
        if (typeof parentValue !== 'object' || parentValue === null) return prev;
        return {
          ...prev,
          [parent]: {
            ...parentValue,
            [child]: value
          }
        };
      });
    }
  };

  const handleEdit = async (quoteId: string) => {
    if (!editForm) return;

    try {
      const updateData = {
        orderNumber: editForm.orderNumber,
        items: editForm.items,
        coating: editForm.coating,
        additionalServices: editForm.additionalServices,
        contactInfo: editForm.contactInfo,
        total: editForm.total,
        discount: editForm.discount,
        updatedAt: new Date().toISOString()
      };
      await updateQuote(quoteId, updateData);
      toast.success('Quote updated successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to update quote');
      console.error('Error updating quote:', error);
    }
  };

  const handleProgressUpdate = async (quoteId: string, newStatus: Quote['status']) => {
    try {
      await updateQuote(quoteId, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  if (!quote || !editForm) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EditQuoteForm
        quote={quote}
        editForm={editForm}
        handleEditFormChange={handleEditFormChange}
        handleEdit={handleEdit}
        onCancel={() => navigate('/dashboard')}
        handleProgressUpdate={handleProgressUpdate}
      />
    </div>
  );
}; 