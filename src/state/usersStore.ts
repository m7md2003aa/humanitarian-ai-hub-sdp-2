import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';

interface UsersStore {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  removeUser: (userId: string) => void;
  getUserById: (userId: string) => User | undefined;
  getAllUsers: () => User[];
}

export const useUsersStore = create<UsersStore>()(
  persist(
    (set, get) => ({
      users: [],

      addUser: (user: User) => {
        set((state) => {
          // Check if user already exists
          const exists = state.users.some(u => u.id === user.id);
          if (exists) {
            // Update existing user
            return {
              users: state.users.map(u => u.id === user.id ? user : u)
            };
          }
          // Add new user
          return {
            users: [...state.users, user]
          };
        });
      },

      updateUser: (userId: string, updates: Partial<User>) => {
        set((state) => ({
          users: state.users.map(user =>
            user.id === userId
              ? { ...user, ...updates }
              : user
          )
        }));
      },

      removeUser: (userId: string) => {
        set((state) => ({
          users: state.users.filter(user => user.id !== userId)
        }));
      },

      getUserById: (userId: string) => {
        return get().users.find(user => user.id === userId);
      },

      getAllUsers: () => {
        return get().users;
      },
    }),
    {
      name: 'users-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
