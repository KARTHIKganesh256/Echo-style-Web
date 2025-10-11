-- Supabase Database Schema for Echo Style Web - FIXED VERSION
-- Run these commands in your Supabase SQL Editor

-- First, let's check if products table exists and get its structure
-- If products table doesn't exist, create it with proper UUID structure

-- 1. Create products table if it doesn't exist (with UUID primary key)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  season TEXT,
  hue TEXT,
  chroma TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create skin_care_analyses table
CREATE TABLE IF NOT EXISTS skin_care_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  basic_info JSONB NOT NULL,
  skin_type JSONB NOT NULL,
  skin_concerns JSONB NOT NULL,
  lifestyle JSONB NOT NULL,
  analysis JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create saved_products table (FIXED - using UUID)
CREATE TABLE IF NOT EXISTS saved_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 5. Create analysis_history table
CREATE TABLE IF NOT EXISTS analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL, -- 'skin_tone' or 'skin_care'
  analysis_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_care_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies

-- Products Policies (public read access)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Skin Care Analyses Policies
CREATE POLICY "Users can view own skin care analyses" ON skin_care_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skin care analyses" ON skin_care_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skin care analyses" ON skin_care_analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skin care analyses" ON skin_care_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Saved Products Policies
CREATE POLICY "Users can view own saved products" ON saved_products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved products" ON saved_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved products" ON saved_products
  FOR DELETE USING (auth.uid() = user_id);

-- Analysis History Policies
CREATE POLICY "Users can view own analysis history" ON analysis_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis history" ON analysis_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skin_care_analyses_user_id ON skin_care_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_products_user_id ON saved_products(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_type ON analysis_history(analysis_type);
CREATE INDEX IF NOT EXISTS idx_products_season ON products(season);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- 9. Create functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 11. Insert sample products if products table is empty
INSERT INTO products (name, category, season, hue, chroma, price, image_url) VALUES
('Classic Red Lipstick', 'Makeup', 'Winter', 'Red', 'High', 25.99, 'https://example.com/red-lipstick.jpg'),
('Soft Pink Blush', 'Makeup', 'Spring', 'Pink', 'Medium', 18.50, 'https://example.com/pink-blush.jpg'),
('Warm Bronze Eyeshadow', 'Makeup', 'Autumn', 'Brown', 'Medium', 22.00, 'https://example.com/bronze-eyeshadow.jpg'),
('Cool Blue Eyeliner', 'Makeup', 'Summer', 'Blue', 'High', 15.75, 'https://example.com/blue-eyeliner.jpg')
ON CONFLICT DO NOTHING;
