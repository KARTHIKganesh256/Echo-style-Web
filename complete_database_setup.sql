-- =====================================================
-- EchoStyle Complete Database Setup for Supabase
-- =====================================================
-- Run this entire script in Supabase SQL Editor
-- This will create all necessary tables and data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2),
  image_url TEXT,
  description TEXT,
  season TEXT,
  undertone TEXT,
  hue TEXT,
  chroma TEXT,
  value TEXT,
  tags TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. SKIN CARE ANALYSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS skin_care_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  basic_info JSONB,
  skin_type TEXT,
  skin_concerns TEXT[],
  lifestyle JSONB,
  analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ANALYSIS HISTORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS analysis_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. SAVED PRODUCTS TABLE (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- =====================================================
-- 5. USER PROFILES TABLE (Extended User Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT,
  bio TEXT,
  skin_tone TEXT,
  undertone TEXT,
  season TEXT,
  preferences JSONB DEFAULT '{}',
  subscription_status TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. SEASONAL PALETTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS seasonal_palettes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  season TEXT NOT NULL,
  undertone TEXT NOT NULL,
  primary_colors JSONB,
  secondary_colors JSONB,
  accent_colors JSONB,
  best_makeup_shades JSONB,
  avoid_colors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_care_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_palettes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Products: Public read access
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

-- Skin Care Analyses: Users can manage their own data
CREATE POLICY "Users can view their own skin analyses" ON skin_care_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skin analyses" ON skin_care_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skin analyses" ON skin_care_analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skin analyses" ON skin_care_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Analysis History: Users can manage their own data
CREATE POLICY "Users can view their own analysis history" ON analysis_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analysis history" ON analysis_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Saved Products: Users can manage their own saved products
CREATE POLICY "Users can view their own saved products" ON saved_products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved products" ON saved_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved products" ON saved_products
  FOR DELETE USING (auth.uid() = user_id);

-- User Profiles: Users can manage their own profiles
CREATE POLICY "Users can view their own profiles" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles" ON user_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Seasonal Palettes: Public read access
CREATE POLICY "Anyone can view seasonal palettes" ON seasonal_palettes
  FOR SELECT USING (true);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_season ON products(season);
CREATE INDEX IF NOT EXISTS idx_products_undertone ON products(undertone);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);

-- Skin care analyses indexes
CREATE INDEX IF NOT EXISTS idx_skin_care_analyses_user_id ON skin_care_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_skin_care_analyses_created_at ON skin_care_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_skin_care_analyses_skin_type ON skin_care_analyses(skin_type);

-- Analysis history indexes
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history(created_at);
CREATE INDEX IF NOT EXISTS idx_analysis_history_type ON analysis_history(analysis_type);

-- Saved products indexes
CREATE INDEX IF NOT EXISTS idx_saved_products_user_id ON saved_products(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_products_product_id ON saved_products(product_id);
CREATE INDEX IF NOT EXISTS idx_saved_products_saved_at ON saved_products(saved_at);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_season ON user_profiles(season);

-- Seasonal palettes indexes
CREATE INDEX IF NOT EXISTS idx_seasonal_palettes_season ON seasonal_palettes(season);
CREATE INDEX IF NOT EXISTS idx_seasonal_palettes_undertone ON seasonal_palettes(undertone);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skin_care_analyses_updated_at 
  BEFORE UPDATE ON skin_care_analyses 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert sample products
INSERT INTO products (name, brand, category, price, image_url, description, season, undertone, hue, chroma, value, tags, rating) VALUES
('Coral Blush', 'Beauty Co', 'Makeup', 24.99, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', 'Warm coral blush perfect for spring complexions', 'Spring', 'Warm', 'Orange', 'Medium', 'Light', ARRAY['blush', 'coral', 'spring', 'warm'], 4.5),
('Cool Pink Lipstick', 'Makeup Pro', 'Makeup', 19.99, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', 'Cool-toned pink lipstick for summer vibes', 'Summer', 'Cool', 'Pink', 'Medium', 'Medium', ARRAY['lipstick', 'pink', 'summer', 'cool'], 4.2),
('Warm Bronze Eyeshadow', 'Glam Beauty', 'Makeup', 32.99, 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400', 'Rich bronze eyeshadow for autumn warmth', 'Autumn', 'Warm', 'Brown', 'High', 'Dark', ARRAY['eyeshadow', 'bronze', 'autumn', 'warm'], 4.7),
('Deep Berry Lipstick', 'Lux Cosmetics', 'Makeup', 28.99, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', 'Deep berry lipstick for winter elegance', 'Winter', 'Cool', 'Purple', 'High', 'Dark', ARRAY['lipstick', 'berry', 'winter', 'cool'], 4.6),
('Peachy Foundation', 'Skin Perfect', 'Foundation', 45.99, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 'Light peach foundation for warm undertones', 'Spring', 'Warm', 'Peach', 'Low', 'Light', ARRAY['foundation', 'peach', 'spring', 'warm'], 4.3),
('Cool Concealer', 'Cover All', 'Foundation', 22.99, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 'Cool-toned concealer for brightening', 'Summer', 'Cool', 'Beige', 'Low', 'Light', ARRAY['concealer', 'cool', 'summer', 'brightening'], 4.1),
('Golden Highlighter', 'Glow Beauty', 'Makeup', 29.99, 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400', 'Golden shimmer highlighter for spring glow', 'Spring', 'Warm', 'Gold', 'High', 'Light', ARRAY['highlighter', 'gold', 'spring', 'shimmer'], 4.8),
('Rose Blush', 'Pink Paradise', 'Makeup', 26.99, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', 'Soft rose blush for summer freshness', 'Summer', 'Cool', 'Pink', 'Medium', 'Light', ARRAY['blush', 'rose', 'summer', 'cool'], 4.4),
('Terracotta Bronzer', 'Sun Kissed', 'Makeup', 34.99, 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400', 'Warm terracotta bronzer for autumn depth', 'Autumn', 'Warm', 'Orange', 'High', 'Medium', ARRAY['bronzer', 'terracotta', 'autumn', 'warm'], 4.6),
('Plum Eyeshadow', 'Deep Colors', 'Makeup', 31.99, 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400', 'Rich plum eyeshadow for winter drama', 'Winter', 'Cool', 'Purple', 'High', 'Dark', ARRAY['eyeshadow', 'plum', 'winter', 'cool'], 4.5);

-- Insert seasonal palettes
INSERT INTO seasonal_palettes (season, undertone, primary_colors, secondary_colors, accent_colors, best_makeup_shades, avoid_colors) VALUES
('Spring', 'Warm', '["Peach", "Coral", "Warm Pink"]', '["Golden Yellow", "Light Orange"]', '["Turquoise", "Apple Green"]', '["Coral blush", "Peach lipstick", "Gold eyeshadow"]', '["Black", "Navy", "Cool Grey"]'),
('Summer', 'Cool', '["Soft Pink", "Lavender", "Sky Blue"]', '["Cool Grey", "Powder Blue"]', '["Rose", "Mint Green"]', '["Pink blush", "Mauve lipstick", "Silver eyeshadow"]', '["Orange", "Warm Brown", "Gold"]'),
('Autumn', 'Warm', '["Rust", "Terracotta", "Olive"]', '["Warm Brown", "Burnt Orange"]', '["Deep Teal", "Mustard"]', '["Bronze blush", "Copper lipstick", "Brown eyeshadow"]', '["Bright Pink", "Cool Blue", "Silver"]'),
('Winter', 'Cool', '["Burgundy", "Navy", "True White"]', '["Black", "Cool Red"]', '["Royal Purple", "Emerald"]', '["Berry blush", "Red lipstick", "Plum eyeshadow"]', '["Orange", "Warm Beige", "Gold"]');

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ EchoStyle database setup completed successfully!';
    RAISE NOTICE '📊 Tables created: products, skin_care_analyses, analysis_history, saved_products, user_profiles, seasonal_palettes';
    RAISE NOTICE '🔐 Row Level Security enabled on all tables';
    RAISE NOTICE '📈 Indexes created for optimal performance';
    RAISE NOTICE '🎨 Sample data inserted: 10 products, 4 seasonal palettes';
    RAISE NOTICE '🚀 Your EchoStyle application is ready to use!';
END $$;








