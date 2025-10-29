import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

interface SettingsState {
  language: Language;
  theme: Theme;
  lastRole: string | null;
  notificationsEnabled: boolean;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  setLastRole: (role: string | null) => void;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'light',
      lastRole: null,
      notificationsEnabled: true,

      toggleLanguage: () => {
        set((state) => ({
          language: state.language === 'en' ? 'ar' : 'en',
        }));
      },
      
      setLanguage: (language) => set({ language }),
      
      setTheme: (theme) => set({ theme }),

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },

      setLastRole: (role) => {
        set({ lastRole: role });
      },
      
      toggleNotifications: () => {
        set((state) => ({
          notificationsEnabled: !state.notificationsEnabled,
        }));
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);