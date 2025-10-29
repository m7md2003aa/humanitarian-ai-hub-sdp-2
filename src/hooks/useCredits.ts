import { useState, useEffect, useCallback } from 'react';
import { 
  fetchCreditBalance, 
  addCredits, 
  subtractCredits,
  subscribeToCredits,
  fetchAllUserCredits,
  CreditBalance,
} from '../api/credits';
import { useAuthStore } from '../state/authStore';

/**
 * Hook to fetch and sync credit balance from Supabase (single source of truth)
 * Auto-refreshes on mount and subscribes to real-time updates
 * Falls back gracefully on network errors
 */
export function useCreditBalance(userId?: string) {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const updateCredits = useAuthStore(state => state.updateCredits);

  // Fetch credits from Supabase
  const refreshCredits = useCallback(async () => {
    if (!userId) {
      setCredits(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsOffline(false);
      const balance = await fetchCreditBalance(userId);
      setCredits(balance);
      
      // Sync to auth store
      updateCredits(balance);
    } catch (err: any) {
      console.error('Error fetching credits:', err);
      const errorMessage = err.message || 'Failed to fetch credits';
      setError(errorMessage);
      
      // Check if it's a network error
      if (errorMessage.includes('Network request failed') || errorMessage.includes('timeout')) {
        console.warn('Network error - app running in offline mode');
        setIsOffline(true);
        // Use mock credits for offline mode
        setCredits(80);
        updateCredits(80);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, updateCredits]);

  // Initial fetch
  useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToCredits(userId, (newCredits) => {
      setCredits(newCredits);
      updateCredits(newCredits);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, updateCredits]);

  return {
    credits,
    isLoading,
    error,
    isOffline,
    refreshCredits, // Manual refresh function
  };
}

/**
 * Hook for credit operations (earn, spend)
 */
export function useCreditOperations(userId?: string) {
  const { refreshCredits } = useCreditBalance(userId);

  const earnCredits = useCallback(async (amount: number) => {
    if (!userId) return { success: false, newBalance: 0 };

    try {
      const newBalance = await addCredits(userId, amount);
      await refreshCredits(); // Refresh from Supabase
      return { success: true, newBalance };
    } catch (error) {
      console.error('Error earning credits:', error);
      return { success: false, newBalance: 0 };
    }
  }, [userId, refreshCredits]);

  const spendCredits = useCallback(async (amount: number) => {
    if (!userId) return { success: false, newBalance: 0 };

    try {
      const result = await subtractCredits(userId, amount);
      if (result.success) {
        await refreshCredits(); // Refresh from Supabase
      }
      return result;
    } catch (error) {
      console.error('Error spending credits:', error);
      return { success: false, newBalance: 0 };
    }
  }, [userId, refreshCredits]);

  return {
    earnCredits,
    spendCredits,
  };
}

/**
 * Admin hook to fetch all users' credits
 */
export function useAllUserCredits() {
  const [userCredits, setUserCredits] = useState<CreditBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAllCredits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const credits = await fetchAllUserCredits();
      setUserCredits(credits);
    } catch (err: any) {
      console.error('Error fetching all user credits:', err);
      setError(err.message || 'Failed to fetch user credits');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    refreshAllCredits();
  }, [refreshAllCredits]);

  // Auto-refresh every 10 seconds for admin view
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAllCredits();
    }, 10000);

    return () => clearInterval(interval);
  }, [refreshAllCredits]);

  return {
    userCredits,
    isLoading,
    error,
    refreshAllCredits,
  };
}
