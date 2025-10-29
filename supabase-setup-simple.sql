-- ============================================
-- SUPABASE DATABASE SETUP FOR DONATION APP
-- SIMPLIFIED VERSION (No Storage Checks)
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Go to: Supabase Dashboard → SQL Editor → New Query
-- Paste this entire script and click "Run"
-- ============================================

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS donations CASCADE;

-- Create donations table
CREATE TABLE donations (
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
CREATE TABLE listings (
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
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX idx_listings_is_available ON listings(is_available);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- DONATIONS POLICIES (Allow everything for development)
CREATE POLICY "Enable all operations for donations"
  ON donations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- LISTINGS POLICIES (Allow everything for development)
CREATE POLICY "Enable all operations for listings"
  ON listings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable realtime for both tables (try/catch approach)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE donations;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE listings;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if tables were created successfully
SELECT 'donations' as table_name, COUNT(*) as row_count FROM donations
UNION ALL
SELECT 'listings' as table_name, COUNT(*) as row_count FROM listings;

-- Check table structure
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name IN ('donations', 'listings')
ORDER BY table_name, ordinal_position;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT
  '✅ DATABASE SETUP COMPLETE!' as status,
  'Tables created: donations, listings' as message,
  'You can now use the app with Supabase sync' as next_step;
