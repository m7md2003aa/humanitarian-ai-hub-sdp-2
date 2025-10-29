export type UserRole = 'donor' | 'beneficiary' | 'business' | 'admin';
export type AccountStatus = 'active' | 'suspended';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  createdAt: Date;
  credits?: number; // For beneficiaries
  businessVerified?: boolean; // For businesses
  accountStatus?: AccountStatus; // For admin management
  suspendedAt?: Date; // When account was suspended
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}