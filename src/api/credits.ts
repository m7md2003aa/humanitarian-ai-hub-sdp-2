import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Credit Management API
 * Single source of truth: Supabase database
 * All credit operations go through this module
 */

export interface CreditBalance {
  userId: string;
  credits: number;
  lastUpdated: Date;
}

/**
 * Check if a string is a valid UUID format
 */
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Fetch current credit balance from Supabase
 * Falls back to mock data if Supabase unavailable or network error
 */
export async function fetchCreditBalance(userId: string): Promise<number> {
  // Check if user ID is valid UUID - if not, it's a mock user
  if (!isValidUUID(userId)) {
    console.log('Mock user detected (non-UUID), using local credits only');
    return 80; // Mock credits for local testing
  }

  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning mock credits');
    return 80; // Mock value for testing
  }

  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
    });

    const fetchPromise = supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (error) {
      console.error('Error fetching credits:', error);
      // Return mock value on error for better UX
      return 80;
    }

    return data?.credits || 0;
  } catch (error: any) {
    console.error('Exception fetching credits:', error);
    // Network error - return mock value so app doesn't break
    if (error.message?.includes('Network request failed') || error.message?.includes('timeout')) {
      console.warn('Network unavailable - using mock credits (80)');
      return 80;
    }
    return 80; // Fallback to mock value
  }
}

/**
 * Update credit balance in Supabase
 */
export async function updateCreditBalance(
  userId: string, 
  newBalance: number
): Promise<boolean> {
  // Check if user ID is valid UUID - if not, it's a mock user
  if (!isValidUUID(userId)) {
    console.log('Mock user detected (non-UUID), skipping Supabase update');
    return true; // Return success for mock users (they use local storage)
  }

  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, mock update');
    return true;
  }

  try {
    const { error } = await supabase
      .from('users')
      .update({ credits: newBalance })
      .eq('id', userId);

    if (error) {
      console.error('Error updating credits:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating credits:', error);
    return false;
  }
}

/**
 * Add credits to a user (earn)
 */
export async function addCredits(
  userId: string, 
  amount: number
): Promise<number> {
  const currentBalance = await fetchCreditBalance(userId);
  const newBalance = currentBalance + amount;
  
  const success = await updateCreditBalance(userId, newBalance);
  return success ? newBalance : currentBalance;
}

/**
 * Subtract credits from a user (spend)
 */
export async function subtractCredits(
  userId: string, 
  amount: number
): Promise<{ success: boolean; newBalance: number }> {
  const currentBalance = await fetchCreditBalance(userId);
  
  if (currentBalance < amount) {
    return { success: false, newBalance: currentBalance };
  }
  
  const newBalance = currentBalance - amount;
  const success = await updateCreditBalance(userId, newBalance);
  
  return { 
    success, 
    newBalance: success ? newBalance : currentBalance 
  };
}

/**
 * Fetch all users with their credit balances (Admin)
 */
export async function fetchAllUserCredits(): Promise<CreditBalance[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning mock data');
    return [
      { userId: 'mock1', credits: 80, lastUpdated: new Date() },
      { userId: 'mock2', credits: 50, lastUpdated: new Date() },
    ];
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, credits, updated_at')
      .eq('role', 'beneficiary')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching all user credits:', error);
      return [];
    }

    return (data || []).map(user => ({
      userId: user.id,
      credits: user.credits || 0,
      lastUpdated: new Date(user.updated_at),
    }));
  } catch (error) {
    console.error('Exception fetching all user credits:', error);
    return [];
  }
}

/**
 * Admin: Set credit balance for any user
 */
export async function adminSetCredits(
  userId: string, 
  newBalance: number
): Promise<boolean> {
  return await updateCreditBalance(userId, newBalance);
}

/**
 * Subscribe to credit changes for a user (real-time)
 */
export function subscribeToCredits(
  userId: string,
  callback: (credits: number) => void
): (() => void) | null {
  // Check if user ID is valid UUID - if not, it's a mock user
  if (!isValidUUID(userId)) {
    console.log('Mock user detected (non-UUID), skipping real-time subscription');
    return null; // No subscription for mock users
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const channel = supabase
    .channel(`credits:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        const newCredits = payload.new.credits || 0;
        callback(newCredits);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}
