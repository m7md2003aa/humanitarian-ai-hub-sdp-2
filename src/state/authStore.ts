import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../types/user';
import { supabase, isSupabaseConfigured } from '../api/supabase';
import { useUsersStore } from './usersStore';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  updateCredits: (credits: number) => void;
  setLoading: (loading: boolean) => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Check if using test account - force mock auth for testing
          const isTestAccount = email.includes('@test.com') || 
                               email.includes('test@') ||
                               email.includes('demo@') ||
                               email.includes('@demo.com');
          
          if (isTestAccount) {
            console.log('Using mock auth for test account:', email);
            return await mockLogin(email, password, set);
          }

          // Check if Supabase is configured
          if (!isSupabaseConfigured()) {
            // Fallback to mock authentication
            console.warn('Supabase not configured, using mock auth');
            return await mockLogin(email, password, set);
          }

          // Real Supabase authentication
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authError) {
            console.log('Auth error:', authError.message);
            set({ isLoading: false });
            return false;
          }

          if (!authData.user) {
            set({ isLoading: false });
            return false;
          }

          // Fetch user profile from our users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (userError) {
            console.log('User profile error:', userError.message);
            // If we can't fetch profile, use basic auth data
            const user: User = {
              id: authData.user.id,
              email: authData.user.email!,
              name: authData.user.user_metadata?.name || 'User',
              role: authData.user.user_metadata?.role || 'donor',
              createdAt: new Date(authData.user.created_at!),
              credits: authData.user.user_metadata?.role === 'beneficiary' ? 100 : 0,
            };
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          // Add user to users store
          useUsersStore.getState().addUser(user);
          
          return true;
          }

          const user: User = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            createdAt: new Date(userData.created_at),
            credits: userData.credits,
            businessVerified: userData.business_status === 'approved',
            profileImage: userData.avatar_url,
          };

          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          // Add user to users store
          useUsersStore.getState().addUser(user);
          
          return true;
        } catch (error: any) {
          console.log('Login error:', error?.message || 'Unknown error');
          set({ isLoading: false });
          return false;
        }
      },

      register: async (email: string, password: string, name: string, role: string) => {
        set({ isLoading: true });
        
        try {
          // Check if using test account - force mock auth for testing
          const isTestAccount = email.includes('@test.com') || 
                               email.includes('test@') ||
                               email.includes('demo@') ||
                               email.includes('@demo.com');
          
          if (isTestAccount) {
            console.log('Using mock auth for test account:', email);
            return await mockRegister(email, password, name, role, set);
          }

          // Check if Supabase is configured
          if (!isSupabaseConfigured()) {
            // Fallback to mock registration
            console.warn('Supabase not configured, using mock auth');
            return await mockRegister(email, password, name, role, set);
          }

          // Real Supabase authentication
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                role,
              },
            },
          });

          if (authError) {
            console.log('Registration error:', authError.message);
            set({ isLoading: false });
            return false;
          }

          if (!authData.user) {
            set({ isLoading: false });
            return false;
          }

          // Create user with metadata from sign up
          const user: User = {
            id: authData.user.id,
            email: authData.user.email!,
            name,
            role: role as any,
            createdAt: new Date(),
            credits: role === 'beneficiary' ? 100 : 0,
            businessVerified: role === 'business' ? false : undefined,
          };

          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return true;
        } catch (error: any) {
          console.log('Registration error:', error?.message || 'Unknown error');
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          if (isSupabaseConfigured()) {
            await supabase.auth.signOut();
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { ...currentUser, ...updates } 
          });
        }
      },

      updateCredits: (credits: number) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { ...currentUser, credits } 
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkSession: async () => {
        try {
          if (!isSupabaseConfigured()) {
            return;
          }

          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Fetch user profile
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userData) {
          const user: User = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            createdAt: new Date(userData.created_at),
            credits: userData.credits,
            businessVerified: userData.business_status === 'approved',
            profileImage: userData.avatar_url,
          };

              set({ 
                user, 
                isAuthenticated: true 
              });
            }
          }
        } catch (error) {
          console.error('Session check error:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Mock authentication functions (fallback when Supabase not configured)
async function mockLogin(email: string, _password: string, set: any): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockUser: User = {
    id: Math.random().toString(36).substring(2, 11),
    email,
    name: email.split('@')[0],
    role: email.includes('admin') ? 'admin' : 
          email.includes('business') ? 'business' :
          email.includes('beneficiary') ? 'beneficiary' : 'donor',
    createdAt: new Date(),
    credits: email.includes('beneficiary') ? 100 : undefined,
    businessVerified: email.includes('business') ? true : undefined,
  };

  set({ 
    user: mockUser, 
    isAuthenticated: true, 
    isLoading: false 
  });
  
  // Add user to users store
  useUsersStore.getState().addUser(mockUser);
  
  return true;
}

async function mockRegister(email: string, _password: string, name: string, role: string, set: any): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newUser: User = {
    id: Math.random().toString(36).substring(2, 11),
    email,
    name,
    role: role as any,
    createdAt: new Date(),
    credits: role === 'beneficiary' ? 100 : 0,
    businessVerified: role === 'business' ? false : undefined,
  };

  set({ 
    user: newUser, 
    isAuthenticated: true, 
    isLoading: false 
  });
  
  // Add user to users store
  useUsersStore.getState().addUser(newUser);
  
  return true;
}