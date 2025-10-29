import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'donor' | 'beneficiary' | 'business' | 'admin';
  avatar_url?: string;
  credits?: number;
  business_status?: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  title: string;
  description?: string;
  category: 'clothes' | 'other';
  status: 'uploaded' | 'verified' | 'listed' | 'allocated' | 'received' | 'rejected';
  image_urls: string[];
  estimated_credits?: number;
  ai_classification?: {
    category: string;
    confidence: number;
    suggestions?: string[];
  };
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  verified_at?: string;
  allocated_to?: string;
  received_at?: string;
}

export interface Claim {
  id: string;
  beneficiary_id: string;
  donation_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  credits_used: number;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  fulfilled_at?: string;
}

export interface BusinessItem {
  id: string;
  business_id: string;
  title: string;
  description?: string;
  category: 'clothes' | 'other';
  type: 'donation' | 'discounted';
  status: 'active' | 'in_review' | 'archived';
  image_urls: string[];
  discount_percentage?: number;
  original_price?: number;
  discounted_price?: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'earned' | 'spent' | 'adjusted' | 'bonus';
  reason: string;
  related_donation_id?: string;
  related_claim_id?: string;
  created_at: string;
}

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
