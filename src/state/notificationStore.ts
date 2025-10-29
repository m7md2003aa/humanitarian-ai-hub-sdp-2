import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'donation_approved' | 'donation_rejected' | 'item_available' | 'credits_added' | 'item_claimed' | 'system';
  isRead: boolean;
  createdAt: Date;
  actionData?: any;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  clearNotifications: (userId: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: Math.random().toString(36).substring(2, 11),
          isRead: false,
          createdAt: new Date(),
        };
        
        set(state => ({
          notifications: [newNotification, ...state.notifications]
        }));
      },

      markAsRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        }));
      },

      markAllAsRead: (userId) => {
        set(state => ({
          notifications: state.notifications.map(notification =>
            notification.userId === userId
              ? { ...notification, isRead: true }
              : notification
          )
        }));
      },

      clearNotifications: (userId) => {
        set(state => ({
          notifications: state.notifications.filter(
            notification => notification.userId !== userId
          )
        }));
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper function to send notifications when actions occur
export const sendNotification = (
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  actionData?: any
) => {
  const { addNotification } = useNotificationStore.getState();
  addNotification({
    userId,
    type,
    title,
    message,
    actionData,
  });
};