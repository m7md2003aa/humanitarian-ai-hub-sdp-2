import { supabase } from './supabase';
import { Donation, ItemListing } from '../types/donations';

// ==================== DONATIONS ====================

export const fetchAllDonations = async (): Promise<Donation[]> => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      return [];
    }

    // Convert snake_case to camelCase and parse dates
    return (data || []).map(d => ({
      id: d.id,
      donorId: d.donor_id,
      title: d.title,
      description: d.description || '',
      category: d.category,
      clothType: d.cloth_type,
      size: d.size,
      color: d.color,
      images: d.images || [],
      status: d.status,
      value: d.value || 10,
      beneficiaryId: d.beneficiary_id,
      createdAt: new Date(d.created_at),
      updatedAt: new Date(d.updated_at),
      verifiedAt: d.verified_at ? new Date(d.verified_at) : undefined,
      allocatedAt: d.allocated_at ? new Date(d.allocated_at) : undefined,
      receivedAt: d.received_at ? new Date(d.received_at) : undefined,
      adminNotes: d.admin_notes,
      aiConfidence: d.ai_confidence,
    }));
  } catch (error) {
    console.error('Exception fetching donations:', error);
    return [];
  }
};

export const createDonation = async (donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Donation | null> => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .insert({
        donor_id: donation.donorId,
        title: donation.title,
        description: donation.description,
        category: donation.category,
        cloth_type: donation.clothType,
        size: donation.size,
        color: donation.color,
        images: donation.images,
        status: donation.status,
        value: donation.value,
        admin_notes: donation.adminNotes,
        ai_confidence: donation.aiConfidence,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating donation:', error);
      return null;
    }

    console.log('✅ Donation created in Supabase:', data.id);

    return {
      id: data.id,
      donorId: data.donor_id,
      title: data.title,
      description: data.description || '',
      category: data.category,
      clothType: data.cloth_type,
      size: data.size,
      color: data.color,
      images: data.images || [],
      status: data.status,
      value: data.value || 10,
      beneficiaryId: data.beneficiary_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      verifiedAt: data.verified_at ? new Date(data.verified_at) : undefined,
      allocatedAt: data.allocated_at ? new Date(data.allocated_at) : undefined,
      receivedAt: data.received_at ? new Date(data.received_at) : undefined,
      adminNotes: data.admin_notes,
      aiConfidence: data.ai_confidence,
    };
  } catch (error) {
    console.error('Exception creating donation:', error);
    return null;
  }
};

export const updateDonationInDatabase = async (
  id: string,
  updates: Partial<{
    status: string;
    adminNotes: string;
    verifiedAt: Date;
    category: string;
  }>
): Promise<boolean> => {
  try {
    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.status) dbUpdates.status = updates.status;
    if (updates.adminNotes) dbUpdates.admin_notes = updates.adminNotes;
    if (updates.verifiedAt) dbUpdates.verified_at = updates.verifiedAt.toISOString();
    if (updates.category) dbUpdates.category = updates.category;

    const { error } = await supabase
      .from('donations')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating donation:', error);
      return false;
    }

    console.log('✅ Donation updated in Supabase:', id);
    return true;
  } catch (error) {
    console.error('Exception updating donation:', error);
    return false;
  }
};

// ==================== LISTINGS ====================

export const fetchAllListings = async (): Promise<ItemListing[]> => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
      return [];
    }

    return (data || []).map(l => ({
      id: l.id,
      donorId: l.donor_id,
      businessId: l.business_id,
      title: l.title,
      description: l.description || '',
      category: l.category,
      clothType: l.cloth_type,
      size: l.size,
      color: l.color,
      images: l.images || [],
      credits: l.credits || 10,
      isAvailable: l.is_available !== false,
      createdAt: new Date(l.created_at),
      location: l.location,
    }));
  } catch (error) {
    console.error('Exception fetching listings:', error);
    return [];
  }
};

export const createListing = async (listing: Omit<ItemListing, 'id' | 'createdAt'>): Promise<ItemListing | null> => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .insert({
        donor_id: listing.donorId,
        business_id: listing.businessId,
        title: listing.title,
        description: listing.description,
        category: listing.category,
        cloth_type: listing.clothType,
        size: listing.size,
        color: listing.color,
        images: listing.images,
        credits: listing.credits,
        is_available: listing.isAvailable,
        location: listing.location,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating listing:', error);
      return null;
    }

    console.log('✅ Listing created in Supabase:', data.id);

    return {
      id: data.id,
      donorId: data.donor_id,
      businessId: data.business_id,
      title: data.title,
      description: data.description || '',
      category: data.category,
      clothType: data.cloth_type,
      size: data.size,
      color: data.color,
      images: data.images || [],
      credits: data.credits || 10,
      isAvailable: data.is_available !== false,
      createdAt: new Date(data.created_at),
      location: data.location,
    };
  } catch (error) {
    console.error('Exception creating listing:', error);
    return null;
  }
};

export const updateListingAvailability = async (id: string, isAvailable: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('listings')
      .update({ is_available: isAvailable })
      .eq('id', id);

    if (error) {
      console.error('Error updating listing:', error);
      return false;
    }

    console.log('✅ Listing availability updated:', id, isAvailable);
    return true;
  } catch (error) {
    console.error('Exception updating listing:', error);
    return false;
  }
};

// ==================== REAL-TIME SUBSCRIPTIONS ====================

export const subscribeToDonations = (callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('donations-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'donations' },
      callback
    )
    .subscribe();

  return subscription;
};

export const subscribeToListings = (callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('listings-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'listings' },
      callback
    )
    .subscribe();

  return subscription;
};
