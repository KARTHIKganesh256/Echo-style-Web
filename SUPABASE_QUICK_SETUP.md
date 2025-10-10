# 🚀 Quick Products Setup for Supabase

Your app is ready but needs products in the database. Follow these **3 simple steps**:

## Step 1: Go to Supabase SQL Editor

1. **Visit**: https://app.supabase.com/project/fcujblneuxjtvxxafyne
2. **Click**: "SQL Editor" in the left sidebar
3. **Click**: "New Query"

## Step 2: Create Products Table

Copy and paste this code, then click **"Run"**:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  price NUMERIC,
  image_url TEXT,
  description TEXT,
  season TEXT,
  undertone TEXT,
  hue TEXT,
  chroma TEXT,
  value TEXT,
  tags TEXT[],
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read products
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT TO authenticated, anon USING (true);
```

## Step 3: Add Sample Products

After creating the table, run this code to add products:

```sql
-- Insert sample products (Prices in Indian Rupees ₹)
INSERT INTO products (name, brand, category, price, description, season, undertone, hue, chroma, value, tags, image_url) VALUES

-- Spring Products
('Coral Blush', 'Beauty Co', 'Makeup', 1999, 'Perfect coral blush for warm spring tones', 'Spring', 'Warm', 'Orange', 'Medium', 'Light', ARRAY['blush', 'coral', 'warm'], 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop'),
('Peach Lipstick', 'Glam Beauty', 'Makeup', 1499, 'Soft peach lipstick for spring complexions', 'Spring', 'Warm', 'Orange', 'Medium', 'Light', ARRAY['lipstick', 'peach', 'warm'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'),
('Light Green Eyeshadow', 'Makeup Pro', 'Makeup', 1799, 'Fresh light green eyeshadow', 'Spring', 'Warm', 'Green', 'Medium', 'Light', ARRAY['eyeshadow', 'green', 'light'], 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop'),
('Spring Blouse', 'Style Co', 'Clothing', 3999, 'Light floral blouse for spring', 'Spring', 'Warm', 'Green', 'Medium', 'Light', ARRAY['blouse', 'floral', 'spring'], 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop'),

-- Summer Products
('Cool Pink Blush', 'Beauty Co', 'Makeup', 2199, 'Cool pink blush for summer tones', 'Summer', 'Cool', 'Pink', 'Medium', 'Light', ARRAY['blush', 'pink', 'cool'], 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop'),
('Berry Lipstick', 'Glam Beauty', 'Makeup', 1599, 'Cool berry lipstick for summer', 'Summer', 'Cool', 'Purple', 'High', 'Medium', ARRAY['lipstick', 'berry', 'cool'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'),
('Blue Eyeshadow', 'Makeup Pro', 'Makeup', 1899, 'Cool blue eyeshadow palette', 'Summer', 'Cool', 'Blue', 'Medium', 'Medium', ARRAY['eyeshadow', 'blue', 'cool'], 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop'),
('Summer Dress', 'Style Co', 'Clothing', 6499, 'Cool pastel dress for summer', 'Summer', 'Cool', 'Blue', 'Medium', 'Light', ARRAY['dress', 'pastel', 'summer'], 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop'),

-- Autumn Products
('Bronze Blush', 'Beauty Co', 'Makeup', 2399, 'Rich bronze blush for autumn tones', 'Autumn', 'Warm', 'Brown', 'High', 'Medium', ARRAY['blush', 'bronze', 'warm'], 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop'),
('Burnt Orange Lipstick', 'Glam Beauty', 'Makeup', 1799, 'Deep burnt orange for autumn', 'Autumn', 'Warm', 'Orange', 'High', 'Dark', ARRAY['lipstick', 'orange', 'warm'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'),
('Golden Eyeshadow', 'Makeup Pro', 'Makeup', 2099, 'Rich golden eyeshadow palette', 'Autumn', 'Warm', 'Yellow', 'High', 'Medium', ARRAY['eyeshadow', 'gold', 'warm'], 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop'),
('Autumn Sweater', 'Style Co', 'Clothing', 5499, 'Warm autumn sweater', 'Autumn', 'Warm', 'Orange', 'High', 'Medium', ARRAY['sweater', 'warm', 'autumn'], 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop'),

-- Winter Products
('Deep Berry Blush', 'Beauty Co', 'Makeup', 2499, 'Deep berry blush for winter tones', 'Winter', 'Cool', 'Purple', 'High', 'Dark', ARRAY['blush', 'berry', 'cool'], 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop'),
('Deep Red Lipstick', 'Glam Beauty', 'Makeup', 1899, 'Classic deep red lipstick', 'Winter', 'Cool', 'Red', 'High', 'Dark', ARRAY['lipstick', 'red', 'cool'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'),
('Silver Eyeshadow', 'Makeup Pro', 'Makeup', 2299, 'Cool silver eyeshadow palette', 'Winter', 'Cool', 'Gray', 'Medium', 'Medium', ARRAY['eyeshadow', 'silver', 'cool'], 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop'),
('Winter Coat', 'Style Co', 'Clothing', 10999, 'Elegant winter coat', 'Winter', 'Cool', 'Black', 'High', 'Dark', ARRAY['coat', 'winter', 'elegant'], 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop'),

-- Neutral Products
('Neutral Blush', 'Beauty Co', 'Makeup', 1999, 'Versatile neutral blush for all seasons', 'Neutral', 'Neutral', 'Pink', 'Low', 'Medium', ARRAY['blush', 'neutral', 'universal'], 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop'),
('Nude Lipstick', 'Glam Beauty', 'Makeup', 1399, 'Classic nude lipstick for everyone', 'Neutral', 'Neutral', 'Brown', 'Low', 'Medium', ARRAY['lipstick', 'nude', 'universal'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'),
('Natural Eyeshadow', 'Makeup Pro', 'Makeup', 1699, 'Natural eyeshadow palette', 'Neutral', 'Neutral', 'Brown', 'Low', 'Medium', ARRAY['eyeshadow', 'natural', 'universal'], 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop');
```

## ✅ That's It!

After running both SQL scripts:

1. **Go to your app**: https://karthikganesh256.github.io/Echo-style-Web/
2. **Click "Products"** in the navigation
3. **You should see 20 sample products!** 🎉

## 🔧 If Products Still Don't Show:

1. **Check Console** (F12) for any error messages
2. **Make sure both SQL scripts ran successfully** in Supabase
3. **Try refreshing the page**

---

**Need help?** Check the browser console for any error messages and share them!
