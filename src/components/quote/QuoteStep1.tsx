import React, { useState, useEffect, useContext } from 'react';
import { Button } from '../shared/Button';
import { Link } from 'react-router-dom';
import type { QuoteItem, QuoteData } from '../../types/Quote';
import { MinusCircle, PlusCircle, Settings, AlertCircle, Sparkles, X } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { motion } from 'framer-motion';
import { 
  errorMessageClasses,
  getSelectClasses,
  labelClasses,
  optionClasses,
  getQuantityInputClasses,
  quantityButtonClasses,
  inputGroupClasses
} from '@/utils/formValidation';
import { toast } from 'react-hot-toast';
import { AuthContext } from '@/contexts/AuthContext';

interface QuoteStep1Props {
  quoteData: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
}

const itemTypes = [
  { id: 'small-parts', name: 'Small Parts', basePrice: 25 },
  { id: 'medium-parts', name: 'Medium Parts', basePrice: 50 },
  { id: 'large-parts', name: 'Large Parts', basePrice: 100 },
  { id: 'custom', name: 'Custom Size', basePrice: 150 },
];

const sizes = [
  'Up to 6"',
  '6" - 12"',
  '12" - 24"',
  '24" - 36"',
  '36"+'
];

export const QuoteStep1: React.FC<QuoteStep1Props> = ({ quoteData, onUpdate }) => {
  const { currentUser } = useContext(AuthContext);
  const { userProfile, loading: profileLoading } = useUserProfile(currentUser?.uid);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    size?: string;
    quantity?: string;
  }>({});
  const [touched, setTouched] = useState<{
    name: boolean;
    size: boolean;
    quantity: boolean;
  }>({
    name: false,
    size: false,
    quantity: false,
  });

  const [newItem, setNewItem] = useState<Partial<QuoteItem>>({
    name: '',
    size: '',
    quantity: 1,
    price: 0,
  });

  const [showNoItemsError, setShowNoItemsError] = useState(false);
  const [showAddItemError, setShowAddItemError] = useState(false);
  const [showBulkDiscount, setShowBulkDiscount] = useState(true);

  // Check if user profile is incomplete
  useEffect(() => {
    if (!profileLoading && userProfile) {
      const hasIncompleteProfile = !userProfile.name || !userProfile.email || !userProfile.phone;
      setShowProfileAlert(hasIncompleteProfile);
    }
  }, [userProfile, profileLoading]);

  // Handle editing when component mounts or editingItemIndex changes
  useEffect(() => {
    if (typeof quoteData.editingItemIndex === 'number') {
      const itemToEdit = quoteData.items[quoteData.editingItemIndex];
      if (itemToEdit) {
        setNewItem({
          name: itemToEdit.name,
          size: itemToEdit.size,
          quantity: itemToEdit.quantity,
          price: itemToEdit.price,
        });
      }
    }
  }, [quoteData.editingItemIndex, quoteData.items]);

  // Add effect to watch quoteData.items changes
  useEffect(() => {
    if (quoteData.items.length > 0) {
      setShowNoItemsError(false);
      onUpdate({ showNoItemsError: false });
    }
  }, [quoteData.items]);

  // Add effect to watch quoteData.showNoItemsError changes
  useEffect(() => {
    if (quoteData.showNoItemsError) {
      setShowNoItemsError(true);
    }
  }, [quoteData.showNoItemsError]);

  // Add effect for error timeout
  useEffect(() => {
    if (showAddItemError) {
      const timer = setTimeout(() => {
        setShowAddItemError(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAddItemError]);

  // Enhanced validation function with more specific rules
  const validateField = (field: keyof typeof errors, value: any) => {
    switch (field) {
      case 'name':
        if (!value) return 'Please select an item type';
        if (!itemTypes.find(item => item.id === value)) return 'Invalid item type selected';
        return '';
      case 'size':
        if (!value) return 'Please select a size';
        if (!sizes.includes(value)) return 'Invalid size selected';
        return '';
      case 'quantity':
        if (!value) return 'Quantity is required';
        if (typeof value !== 'number') return 'Quantity must be a number';
        if (value < 1) return 'Quantity must be at least 1';
        if (value > 1000) return 'Maximum quantity is 1000';
        if (!Number.isInteger(value)) return 'Quantity must be a whole number';
        return '';
      default:
        return '';
    }
  };

  // Add real-time validation
  const handleFieldChange = (field: keyof typeof errors, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
    
    // Only show errors if the field has been touched
    if (touched[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: validateField(field, value),
      }));
    }

    // Calculate price when name or size changes
    if (field === 'name' || field === 'size') {
      const selectedType = itemTypes.find(item => item.id === value);
      if (selectedType) {
        const sizeMultiplier = sizes.indexOf(newItem.size as string) + 1;
        const basePrice = selectedType.basePrice * sizeMultiplier;
        setNewItem(prev => ({ ...prev, price: basePrice }));
      }
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {
      name: validateField('name', newItem.name),
      size: validateField('size', newItem.size),
      quantity: validateField('quantity', newItem.quantity),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // Handle field blur
  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, newItem[field]),
    }));
  };

  // Enhanced form submission
  const handleAddItem = async () => {
    // Mark all fields as touched
    setTouched({
      name: true,
      size: true,
      quantity: true,
    });

    // Validate all fields
    if (!validateForm()) {
      // Show error toast or feedback
      toast.error('Please correct the errors before adding the item');
      return;
    }

    try {
      // If editing, update the item
      if (typeof quoteData.editingItemIndex === 'number') {
        const updatedItems = [...quoteData.items];
        updatedItems[quoteData.editingItemIndex] = newItem as QuoteItem;
        
        onUpdate({
          items: updatedItems,
          editingItemIndex: null,
          total: calculateTotal(updatedItems),
        });

        toast.success('Item updated successfully');
      } else {
        // Add new item
        const updatedItems = [...(quoteData.items || []), newItem as QuoteItem];
        
        onUpdate({
          items: updatedItems,
          editingItemIndex: null,
          total: calculateTotal(updatedItems),
        });

        toast.success('Item added successfully');
      }

      // Reset form
      setNewItem({
        name: '',
        size: '',
        quantity: 1,
        price: 0,
      });
      setErrors({});
      setTouched({
        name: false,
        size: false,
        quantity: false,
      });
    } catch (error) {
      toast.error('Failed to add item. Please try again.');
      console.error('Error adding item:', error);
    }
  };

  const calculateTotal = (items: QuoteItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Fix the getSelectClasses calls
  const getSelectClassesWithError = (hasError: boolean) => 
    getSelectClasses(hasError, true);

  // Fix the getQuantityInputClasses calls
  const getQuantityInputClassesWithError = (hasError: boolean) =>
    getQuantityInputClasses(hasError, true);

  return (
    <div className="space-y-6">
      {/* Profile Alert */}
      {showProfileAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Complete Your Profile
              </h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                Please complete your profile information to streamline the quote process.
              </p>
              <div className="mt-3">
                <Link
                  to="/dashboard/settings"
                  className="inline-flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200"
                >
                  <Settings className="h-4 w-4" />
                  Go to Profile Settings
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* No Items Error Alert */}
      {(showNoItemsError || quoteData.showNoItemsError) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                No Items Added
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                Please add at least one item to your quote before proceeding to the next step.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Item Error Alert */}
      {showAddItemError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                Missing Required Fields
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                Please fill in all required fields before adding an item.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bulk Discount Info */}
      {showBulkDiscount && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Sparkles className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Bulk Order Discounts Available
              </h3>
              <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                Get special discounts on bulk orders:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-emerald-700 dark:text-emerald-400">
                <li>• 5% off for orders of 10+ items</li>
                <li>• 10% off for orders of 25+ items</li>
                <li>• 15% off for orders of 50+ items</li>
              </ul>
            </div>
            <button 
              onClick={() => setShowBulkDiscount(false)}
              className="flex-shrink-0 text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Add New Item Form */}
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="itemType" className={labelClasses}>
            Item Type *
          </label>
          <select
            id="itemType"
            value={newItem.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={getSelectClassesWithError(touched.name && !!errors.name)}
          >
            <option value="">Select an item type</option>
            {itemTypes.map((type) => (
              <option key={type.id} value={type.id} className={optionClasses}>
                {type.name}
              </option>
            ))}
          </select>
          {touched.name && errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={errorMessageClasses}
            >
              {errors.name}
            </motion.p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="size" className={labelClasses}>
            Size *
          </label>
          <select
            id="size"
            value={newItem.size || ''}
            onChange={(e) => handleFieldChange('size', e.target.value)}
            onBlur={() => handleBlur('size')}
            className={getSelectClassesWithError(touched.size && !!errors.size)}
            disabled={!newItem.name}
          >
            <option value="">Select a size</option>
            {sizes.map((size) => (
              <option key={size} value={size} className={optionClasses}>
                {size}
              </option>
            ))}
          </select>
          {touched.size && errors.size && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={errorMessageClasses}
            >
              {errors.size}
            </motion.p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="quantity" className={labelClasses}>
            Quantity *
          </label>
          <div className={inputGroupClasses}>
            <button
              type="button"
              onClick={() => handleFieldChange('quantity', Math.max(1, (newItem.quantity || 1) - 1))}
              className={quantityButtonClasses}
              disabled={!newItem.name || !newItem.size}
            >
              <MinusCircle className="h-4 w-4" />
            </button>
            <input
              type="number"
              id="quantity"
              value={newItem.quantity || ''}
              onChange={(e) => handleFieldChange('quantity', parseInt(e.target.value) || '')}
              onBlur={() => handleBlur('quantity')}
              className={getQuantityInputClassesWithError(touched.quantity && !!errors.quantity)}
              min="1"
              max="1000"
              disabled={!newItem.name || !newItem.size}
            />
            <button
              type="button"
              onClick={() => handleFieldChange('quantity', Math.min(1000, (newItem.quantity || 1) + 1))}
              className={quantityButtonClasses}
              disabled={!newItem.name || !newItem.size}
            >
              <PlusCircle className="h-4 w-4" />
            </button>
          </div>
          {touched.quantity && errors.quantity && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={errorMessageClasses}
            >
              {errors.quantity}
            </motion.p>
          )}
        </div>

        {(newItem.price || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-500 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-300">
                Estimated Price: ${((newItem.price || 0) * (newItem.quantity || 1)).toFixed(2)}
              </span>
            </div>
          </motion.div>
        )}

        <div className="flex justify-end space-x-4">
          {quoteData.editingItemIndex !== null && (
            <Button
              variant="secondary"
              onClick={() => {
                onUpdate({ editingItemIndex: null });
                setNewItem({
                  name: '',
                  size: '',
                  quantity: 1,
                  price: 0,
                });
                setErrors({});
                setTouched({
                  name: false,
                  size: false,
                  quantity: false,
                });
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleAddItem}
            disabled={!newItem.name || !newItem.size || !newItem.quantity}
          >
            {quoteData.editingItemIndex !== null ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </div>

      {/* Items Summary */}
      {quoteData.items.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Added Items ({quoteData.items.length})
          </h3>
          <div className="space-y-2">
            {quoteData.items.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    ({item.size})
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 