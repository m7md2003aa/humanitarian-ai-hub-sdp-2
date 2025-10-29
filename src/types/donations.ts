export type DonationStatus = 'uploaded' | 'verified' | 'listed' | 'allocated' | 'received';
export type ItemCategory = 'clothing' | 'other';
export type ClothType =
  | 'T-Shirt'
  | 'Shirt'
  | 'Pants'
  | 'Jeans'
  | 'Jacket'
  | 'Coat'
  | 'Dress'
  | 'Skirt'
  | 'Sweater'
  | 'Hoodie'
  | 'Shorts'
  | 'Shoes'
  | 'Socks'
  | 'Underwear'
  | 'Accessories'
  | 'Other';

export interface Donation {
  id: string;
  donorId: string;
  title: string;
  description: string;
  category: ItemCategory;
  clothType?: ClothType; // Type of clothing item
  size?: string; // Size of the item
  color?: string; // Primary color
  images: string[];
  status: DonationStatus;
  value: number; // Credit value
  beneficiaryId?: string;
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
  allocatedAt?: Date;
  receivedAt?: Date;
  adminNotes?: string;
  aiConfidence?: number; // AI classification confidence
}

export interface ItemListing {
  id: string;
  businessId?: string;
  donorId?: string;
  title: string;
  description: string;
  category: ItemCategory;
  clothType?: ClothType; // Type of clothing item
  size?: string; // Size of the item
  color?: string; // Primary color
  images: string[];
  price?: number; // For business discounted items
  credits: number; // Credit cost for beneficiaries
  isAvailable: boolean;
  createdAt: Date;
  location?: string;
}

export interface CreditTransaction {
  id: string;
  beneficiaryId: string;
  amount: number;
  type: 'earned' | 'spent' | 'adjusted';
  itemId?: string;
  description: string;
  createdAt: Date;
}