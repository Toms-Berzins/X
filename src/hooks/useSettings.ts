import { useState, useEffect } from 'react';
import { ref, get, set, push, getDatabase } from 'firebase/database';
import { app, auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import debounce from 'lodash/debounce';

export interface Material {
  name: string;
  pricePerUnit: number;
  unit: string;
  category?: string;
  description?: string;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface MaterialCategory {
  id: string;
  name: string;
  description?: string;
}

export interface PriceValidation {
  min: number;
  max: number;
  step: number;
}

export interface Settings {
  basePrice: number;
  rushOrderFee: number;
  taxRate: number;
  minimumOrderAmount: number;
  materials: Material[];
  materialCategories: MaterialCategory[];
  validation: {
    basePrice: PriceValidation;
    rushOrderFee: PriceValidation;
    taxRate: PriceValidation;
    minimumOrderAmount: PriceValidation;
  };
  lastUpdated?: string;
  lastUpdatedBy?: string;
}

export interface SettingsHistoryEntry {
  timestamp: string;
  userId: string;
  userEmail: string;
  changes: Partial<Settings>;
  previousValues: Partial<Settings>;
}

const defaultValidation: Record<string, PriceValidation> = {
  basePrice: { min: 0, max: 10000, step: 1 },
  rushOrderFee: { min: 0, max: 1000, step: 1 },
  taxRate: { min: 0, max: 100, step: 0.1 },
  minimumOrderAmount: { min: 0, max: 5000, step: 1 }
};

const defaultSettings: Settings = {
  basePrice: 0,
  rushOrderFee: 0,
  taxRate: 0,
  minimumOrderAmount: 0,
  materials: [],
  materialCategories: [],
  validation: {
    basePrice: defaultValidation.basePrice,
    rushOrderFee: defaultValidation.rushOrderFee,
    taxRate: defaultValidation.taxRate,
    minimumOrderAmount: defaultValidation.minimumOrderAmount
  }
};

// Initialize the Realtime Database
const database = getDatabase(app);

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [history, setHistory] = useState<SettingsHistoryEntry[]>([]);
  const [localChanges, setLocalChanges] = useState<Partial<Settings>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings history
  const loadHistory = async () => {
    try {
      const historyRef = ref(database, 'settingsHistory');
      const snapshot = await get(historyRef);
      if (snapshot.exists()) {
        const historyData = Object.values(snapshot.val()) as SettingsHistoryEntry[];
        setHistory(historyData.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      }
    } catch (err) {
      console.error('Error loading settings history:', err);
    }
  };

  // Save settings history entry
  const saveHistoryEntry = async (changes: Partial<Settings>, previousValues: Partial<Settings>) => {
    if (!auth.currentUser) return;

    const historyEntry: SettingsHistoryEntry = {
      timestamp: new Date().toISOString(),
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email || 'unknown',
      changes,
      previousValues
    };

    try {
      const historyRef = ref(database, 'settingsHistory');
      await push(historyRef, historyEntry);
      await loadHistory();
    } catch (err) {
      console.error('Error saving settings history:', err);
    }
  };

  // Validate settings before update
  const validateSettings = (updates: Partial<Settings>): string[] => {
    const errors: string[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key in defaultValidation) {
        const validation = defaultValidation[key];
        if (typeof value === 'number') {
          if (value < validation.min) errors.push(`${key} cannot be less than ${validation.min}`);
          if (value > validation.max) errors.push(`${key} cannot be more than ${validation.max}`);
        }
      }
    });

    return errors;
  };

  // Debounced update function
  const debouncedUpdate = debounce(async (updates: Partial<Settings>) => {
    try {
      const validationErrors = validateSettings(updates);
      if (validationErrors.length > 0) {
        setError(new Error(validationErrors.join(', ')));
        return;
      }

      const previousValues = Object.keys(updates).reduce((acc, key) => ({
        ...acc,
        [key]: settings[key as keyof Settings]
      }), {});

      const settingsRef = ref(database, 'settings');
      const newSettings: Settings = {
        ...settings,
        ...updates,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: auth.currentUser?.email || undefined
      };

      await set(settingsRef, newSettings);
      await saveHistoryEntry(updates, previousValues);
      
      setSettings(newSettings);
      setLocalChanges({});
      setHasUnsavedChanges(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update settings'));
    }
  }, 1000);

  // Update settings with local state management
  const updateSettings = async (updates: Partial<Settings>) => {
    if (!auth.currentUser) {
      toast.error('Please log in to modify settings');
      throw new Error('User not authenticated');
    }

    if (!isAdmin) {
      toast.error('Only administrators can modify settings');
      throw new Error('Unauthorized access');
    }

    setLocalChanges(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
    debouncedUpdate(updates);
  };

  // Reset settings to default
  const resetSettings = async () => {
    if (!isAdmin) return;
    try {
      const settingsRef = ref(database, 'settings');
      await set(settingsRef, defaultSettings);
      setSettings(defaultSettings);
      setLocalChanges({});
      setHasUnsavedChanges(false);
      toast.success('Settings reset to default values');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reset settings'));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        setError(new Error('User not authenticated'));
        return;
      }

      try {
        const userRef = ref(database, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
        const userRole = userSnapshot.val()?.role;
        setIsAdmin(userRole === 'admin');

        const settingsRef = ref(database, 'settings');
        const snapshot = await get(settingsRef);
        
        if (snapshot.exists()) {
          setSettings(snapshot.val());
        } else if (userRole === 'admin') {
          await set(settingsRef, defaultSettings);
          setSettings(defaultSettings);
        } else {
          setSettings(defaultSettings);
        }

        if (userRole === 'admin') {
          await loadHistory();
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch settings'));
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    settings,
    updateSettings,
    loading,
    error,
    isAdmin,
    history,
    localChanges,
    hasUnsavedChanges,
    resetSettings,
    validation: defaultValidation
  };
}; 