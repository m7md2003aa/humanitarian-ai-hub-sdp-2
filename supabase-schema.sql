-- Humanitarian AI Hub - Supabase Database Schema
-- Run these SQL commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('donor', 'beneficiary', 'business', 'admin')),
  avatar_url TEXT,
  credits INTEGER DEFAULT 0,
  business_status TEXT CHECK (business_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DONATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('clothes', 'other')),
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'verified', 'listed', 'allocated', 'received', 'rejected')),
  image_urls TEXT[] DEFAULT '{}',
  estimated_credits INTEGER,
  ai_classification JSONB,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  allocated_to UUID REFERENCES public.users(id),
  received_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- CLAIMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beneficiary_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  donation_id UUID NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'fulfilled')),
  credits_used INTEGER NOT NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fulfilled_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- BUSINESS ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.business_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('clothes', 'other')),
  type TEXT NOT NULL CHECK (type IN ('donation', 'discounted')),
  status TEXT NOT NULL DEFAULT 'in_review' CHECK (status IN ('active', 'in_review', 'archived')),
  image_urls TEXT[] DEFAULT '{}',
  discount_percentage INTEGER,
  original_price NUMERIC(10, 2),
  discounted_price NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREDIT TRANSACTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'adjusted', 'bonus')),
  reason TEXT NOT NULL,
  related_donation_id UUID REFERENCES public.donations(id),
  related_claim_id UUID REFERENCES public.claims(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES for better query performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_allocated_to ON public.donations(allocated_to);
CREATE INDEX IF NOT EXISTS idx_claims_beneficiary_id ON public.claims(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_claims_donation_id ON public.claims(donation_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON public.claims(status);
CREATE INDEX IF NOT EXISTS idx_business_items_business_id ON public.business_items(business_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Donations table policies
CREATE POLICY "Donors can view their own donations" ON public.donations
  FOR SELECT USING (donor_id = auth.uid());

CREATE POLICY "Donors can insert their own donations" ON public.donations
  FOR INSERT WITH CHECK (donor_id = auth.uid());

CREATE POLICY "Donors can update their own donations" ON public.donations
  FOR UPDATE USING (donor_id = auth.uid());

CREATE POLICY "Beneficiaries can view listed donations" ON public.donations
  FOR SELECT USING (status IN ('listed', 'allocated'));

CREATE POLICY "Admins can view all donations" ON public.donations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Claims table policies
CREATE POLICY "Beneficiaries can view their own claims" ON public.claims
  FOR SELECT USING (beneficiary_id = auth.uid());

CREATE POLICY "Beneficiaries can create claims" ON public.claims
  FOR INSERT WITH CHECK (beneficiary_id = auth.uid());

CREATE POLICY "Admins can view all claims" ON public.claims
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Business items table policies
CREATE POLICY "Businesses can manage their own items" ON public.business_items
  FOR ALL USING (business_id = auth.uid());

CREATE POLICY "All users can view active business items" ON public.business_items
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can view all business items" ON public.business_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Credit transactions table policies
CREATE POLICY "Users can view their own transactions" ON public.credit_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all transactions" ON public.credit_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_items_updated_at BEFORE UPDATE ON public.business_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'donor'),
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'donor') = 'beneficiary' THEN 100
      ELSE 0
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user credits
CREATE OR REPLACE FUNCTION public.update_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET credits = credits + NEW.amount
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update credits on transaction
CREATE TRIGGER on_credit_transaction AFTER INSERT ON public.credit_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_user_credits();
