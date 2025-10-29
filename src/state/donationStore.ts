import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Donation, ItemListing, CreditTransaction, DonationStatus } from '../types/donations';
import { useAuthStore } from './authStore';

// Simple mock data - no external dependencies
const mockListings: ItemListing[] = [
  {
    id: '1',
    title: 'Winter Jacket - Size M',
    description: 'Warm winter jacket in excellent condition.',
    category: 'clothing',
    images: ['https://via.placeholder.com/300x200'],
    credits: 15,
    isAvailable: true,
    createdAt: new Date(),
    donorId: 'donor1',
  },
  {
    id: '2',
    title: 'Kitchen Supplies Bundle',
    description: 'Set of kitchen utensils and supplies.',
    category: 'other',
    images: ['https://via.placeholder.com/300x200'],
    credits: 8,
    isAvailable: true,
    createdAt: new Date(),
    donorId: 'donor2',
  },
];

interface DonationStore {
  donations: Donation[];
  listings: ItemListing[];
  transactions: CreditTransaction[];
  initializedUsers: string[];

  addDonation: (donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDonationStatus: (id: string, status: DonationStatus, adminNotes?: string) => void;
  updateDonationValue: (id: string, value: number) => void;
  removeDonationImage: (id: string, imageUri: string) => void;
  deleteDonation: (id: string) => void;
  addListing: (listing: Omit<ItemListing, 'id' | 'createdAt'>) => void;
  updateListingCredits: (id: string, credits: number) => void;
  removeListingImage: (id: string, imageUri: string) => void;
  deleteListing: (id: string) => void;
  purchaseItem: (listingId: string, businessId: string) => void;
  addTransaction: (transaction: Omit<CreditTransaction, 'id' | 'createdAt'>) => void;
  initializeUserCredits: (userId: string) => void;
  claimItem: (beneficiaryId: string, listingId: string) => boolean;
  getUserCredits: (userId: string) => number;
}

export const useDonationStore = create<DonationStore>()(
  persist(
    (set, get) => ({
  donations: [],
  listings: mockListings,
  transactions: [],
  initializedUsers: [],

  addDonation: (donationData) => {
    const newDonation: Donation = {
      ...donationData,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set(state => ({
      donations: [...state.donations, newDonation]
    }));
  },

  updateDonationStatus: (id, status, adminNotes) => {
    set(state => ({
      donations: state.donations.map(donation =>
        donation.id === id
          ? {
              ...donation,
              status,
              updatedAt: new Date(),
              adminNotes,
              verifiedAt: status === 'verified' ? new Date() : donation.verifiedAt,
              allocatedAt: status === 'allocated' ? new Date() : donation.allocatedAt,
              receivedAt: status === 'received' ? new Date() : donation.receivedAt,
            }
          : donation
      )
    }));
  },

  updateDonationValue: (id, value) => {
    set(state => ({
      donations: state.donations.map(donation =>
        donation.id === id
          ? {
              ...donation,
              value,
              updatedAt: new Date(),
            }
          : donation
      )
    }));
  },

  removeDonationImage: (id, imageUri) => {
    set(state => ({
      donations: state.donations.map(donation =>
        donation.id === id
          ? {
              ...donation,
              images: donation.images.filter(img => img !== imageUri),
              updatedAt: new Date(),
            }
          : donation
      )
    }));
  },

  deleteDonation: (id) => {
    set(state => ({
      donations: state.donations.filter(donation => donation.id !== id)
    }));
  },

  addListing: (listingData) => {
    const newListing: ItemListing = {
      ...listingData,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
    };

    set(state => ({
      listings: [...state.listings, newListing]
    }));
  },

  updateListingCredits: (id, credits) => {
    set(state => ({
      listings: state.listings.map(listing =>
        listing.id === id
          ? {
              ...listing,
              credits,
            }
          : listing
      )
    }));
  },

  removeListingImage: (id, imageUri) => {
    set(state => ({
      listings: state.listings.map(listing =>
        listing.id === id
          ? {
              ...listing,
              images: listing.images.filter(img => img !== imageUri),
            }
          : listing
      )
    }));
  },

  deleteListing: (id) => {
    set(state => ({
      listings: state.listings.filter(listing => listing.id !== id)
    }));
  },

  purchaseItem: (listingId, businessId) => {
    set(state => ({
      listings: state.listings.map(listing =>
        listing.id === listingId
          ? { ...listing, isAvailable: false, businessId }
          : listing
      )
    }));
  },

  addTransaction: (transactionData) => {
    const newTransaction: CreditTransaction = {
      ...transactionData,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
    };
    
    set(state => ({
      transactions: [...state.transactions, newTransaction]
    }));
  },

  initializeUserCredits: (userId) => {
    const { initializedUsers } = get();
    if (!initializedUsers.includes(userId)) {
      // Simple mock transactions
      const mockTransactions = [
        {
          beneficiaryId: userId,
          amount: 50,
          type: 'earned' as const,
          description: 'Welcome bonus credits',
        },
        {
          beneficiaryId: userId,
          amount: 30,
          type: 'earned' as const,
          description: 'Community participation bonus',
        },
      ];

      mockTransactions.forEach(transactionData => {
        get().addTransaction(transactionData);
      });

      set(state => ({
        initializedUsers: [...state.initializedUsers, userId]
      }));
    }
  },

  claimItem: (beneficiaryId, listingId) => {
    const { listings, transactions } = get();
    const listing = listings.find(l => l.id === listingId);
    if (!listing || !listing.isAvailable) return false;
    
    // Calculate user credits
    const userCredits = get().getUserCredits(beneficiaryId);
    
    if (userCredits < listing.credits) return false;
    
    // Deduct credits
    get().addTransaction({
      beneficiaryId,
      amount: listing.credits,
      type: 'spent',
      itemId: listingId,
      description: `Claimed: ${listing.title}`,
    });
    
    // Mark listing as unavailable
    set(state => ({
      listings: state.listings.map(l =>
        l.id === listingId ? { ...l, isAvailable: false } : l
      )
    }));
    
    return true;
  },

  getUserCredits: (userId) => {
    const { transactions } = get();
    const userTransactions = transactions.filter(t => t.beneficiaryId === userId);
    return userTransactions.reduce((total, transaction) => {
      return transaction.type === 'spent' ? total - transaction.amount : total + transaction.amount;
    }, 0);
  },
}),
{
  name: 'donation-storage',
  storage: createJSONStorage(() => AsyncStorage),
}
)
);

// Custom hook to get reactive credit balance
export const useUserCredits = (userId: string | undefined) => {
  const transactions = useDonationStore(state => state.transactions);
  const getUserCredits = useDonationStore(state => state.getUserCredits);
  
  if (!userId) return 0;
  
  // This will recalculate whenever transactions change
  return getUserCredits(userId);
};

// Custom hook to sync credits to auth store
export const useSyncCredits = (userId: string | undefined) => {
  const credits = useUserCredits(userId);
  const updateCredits = useAuthStore(state => state.updateCredits);
  
  // Sync credits to auth store whenever they change
  useEffect(() => {
    if (userId && credits !== undefined) {
      updateCredits(credits);
    }
  }, [credits, userId, updateCredits]);
  
  return credits;
};