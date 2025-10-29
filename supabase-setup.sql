-- ============================================
-- SUPABASE DATABASE SETUP FOR DONATION APP
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Go to: Supabase Dashboard → SQL Editor → New Query
-- Paste this entire script and click "Run"
-- ============================================

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('clothing', 'other')),
  cloth_type TEXT,
  size TEXT,
  color TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'verified', 'listed', 'allocated', 'received')),
  value INTEGER DEFAULT 10,
  beneficiary_id TEXT,
  admin_notes TEXT,
  ai_confidence DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  allocated_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id TEXT,
  business_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('clothing', 'other')),
  cloth_type TEXT,
  size TEXT,
  color TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  credits INTEGER NOT NULL DEFAULT 10,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_is_available ON listings(is_available);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Donations are viewable by everyone" ON donations;
DROP POLICY IF EXISTS "Authenticated users can insert donations" ON donations;
DROP POLICY IF EXISTS "Authenticated users can update donations" ON donations;
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;
DROP POLICY IF EXISTS "Authenticated users can insert listings" ON listings;
DROP POLICY IF EXISTS "Authenticated users can update listings" ON listings;

-- DONATIONS POLICIES

-- Policy: Anyone can view donations (needed for guest users)
CREATE POLICY "Donations are viewable by everyone"
  ON donations FOR SELECT
  USING (true);

-- Policy: Anyone can insert donations (for development/testing)
-- In production, you might want to restrict this to authenticated users only
CREATE POLICY "Authenticated users can insert donations"
  ON donations FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can update donations (for admin functions)
-- In production, you might want to restrict this to admin users only
CREATE POLICY "Authenticated users can update donations"
  ON donations FOR UPDATE
  USING (true);

-- LISTINGS POLICIES

-- Policy: Anyone can view available listings
CREATE POLICY "Listings are viewable by everyone"
  ON listings FOR SELECT
  USING (true);

-- Policy: Anyone can insert listings (for admin approval creating listings)
CREATE POLICY "Authenticated users can insert listings"
  ON listings FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can update listings (for claiming items)
CREATE POLICY "Authenticated users can update listings"
  ON listings FOR UPDATE
  USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE donations;
ALTER PUBLICATION supabase_realtime ADD TABLE listings;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify tables were created:

-- Check donations table
SELECT COUNT(*) as donation_count FROM donations;

-- Check listings table
SELECT COUNT(*) as listing_count FROM listings;

-- Check indexes
SELECT tablename, indexname FROM pg_indexes
WHERE schemaname = 'public'
AND (tablename = 'donations' OR tablename = 'listings');

-- ============================================
-- SUCCESS!
-- ============================================
-- If no errors, your database is ready!
-- Next step: Update the app code to use these tables
