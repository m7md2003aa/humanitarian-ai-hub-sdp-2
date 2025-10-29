import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemListing, CreditTransaction } from '../types/donations';

// Mock data
const mockListings: ItemListing[] = [
  {
    id: '1',
    title: 'Winter Jacket - Size M',
    description: 'Warm winter jacket in excellent condition. Perfect for cold weather.',
    category: 'clothing',
    images: ['https://via.placeholder.com/300x200'],
    credits: 15,
    isAvailable: true,
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    donorId: 'donor1',
  },
  {
    id: '2',
    title: 'Kitchen Supplies Bundle',
    description: 'Variety pack of kitchen utensils and supplies.',
    category: 'other',
    images: ['https://via.placeholder.com/300x200'],
    credits: 8,
    isAvailable: true,
    createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
    donorId: 'donor2',
  },
  {
    id: '3',
    title: 'T-Shirt Bundle',
    description: 'Collection of 5 clean t-shirts in various sizes.',
    category: 'clothing',
    images: ['https://via.placeholder.com/300x200'],
    credits: 12,
    isAvailable: true,
    createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
    donorId: 'donor1',
  },
  {
    id: '4',
    title: 'School Supplies Set',
    description: 'Complete set of school supplies including notebooks and pens.',
    category: 'other',
    images: ['https://via.placeholder.com/300x200'],
    credits: 20,
    isAvailable: true,
    createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
    businessId: 'business1',
  },
  {
    id: '5',
    title: 'Kids Clothing Bundle',
    description: 'Set of children\'s clothes in various sizes for ages 5-8.',
    category: 'clothing',
    images: ['https://via.placeholder.com/300x200'],
    credits: 18,
    isAvailable: true,
    createdAt: new Date(Date.now() - 86400000 * 4), // 4 days ago
    donorId: 'donor2',
  },
];

interface MockDataStore {
  isInitialized: boolean;
  initializeMockData: () => void;
}

export const useMockDataStore = create<MockDataStore>()(
  persist(
    (set, get) => ({
      isInitialized: false,
      
      initializeMockData: () => {
        if (get().isInitialized) return;
        
        // This will be called to populate initial data
        set({ isInitialized: true });
      },
    }),
    {
      name: 'mock-data-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Function to get mock listings - called by donation store
export const getMockListings = (): ItemListing[] => mockListings;

// Function to generate mock credit transactions for a beneficiary
export const generateMockTransactions = (beneficiaryId: string): CreditTransaction[] => [
  {
    id: '1',
    beneficiaryId,
    amount: 50,
    type: 'earned',
    description: 'Welcome bonus credits',
    createdAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
  },
  {
    id: '2',
    beneficiaryId,
    amount: 30,
    type: 'earned',
    description: 'Community participation bonus',
    createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
  },
  {
    id: '3',
    beneficiaryId,
    amount: 15,
    type: 'spent',
    itemId: '1',
    description: 'Claimed: Winter Jacket - Size M',
    createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
  },
  {
    id: '4',
    beneficiaryId,
    amount: 25,
    type: 'earned',
    description: 'Monthly allocation',
    createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
  },
];