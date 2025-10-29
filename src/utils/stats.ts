import { useDonationStore } from '../state/donationStore';

export interface SystemStats {
  totalDonations: number;
  totalAllocations: number;
  verifiedRate: number;
  formattedDonations: string;
  formattedAllocations: string;
  formattedVerifiedRate: string;
}

export const getSystemStats = (): SystemStats => {
  const state = useDonationStore.getState();
  const { donations, listings, transactions } = state;

  const totalDonations = donations.length + listings.length;
  const totalAllocations = transactions.filter(t => t.type === 'spent').length;
  const verifiedCount = donations.filter(d => d.status === 'verified' || d.status === 'received').length;
  const verifiedRate = donations.length > 0 ? (verifiedCount / donations.length) * 100 : 98;

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${Math.floor(num / 100) / 10}k+`;
    }
    return `${num}+`;
  };

  return {
    totalDonations,
    totalAllocations,
    verifiedRate,
    formattedDonations: totalDonations > 0 ? formatNumber(totalDonations) : '1.2k+',
    formattedAllocations: totalAllocations > 0 ? formatNumber(totalAllocations) : '900+',
    formattedVerifiedRate: verifiedRate > 0 ? `${Math.round(verifiedRate)}%` : '98%',
  };
};