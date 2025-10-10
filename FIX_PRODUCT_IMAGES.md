# 🖼️ Fix Product Images

If your product images aren't showing, here are the solutions:

## 🔍 **Check What's Happening:**

1. **Open Browser Console** (F12)
2. **Go to Products page**
3. **Look for these messages:**
   - `🖼️ Product 1 image URL: [URL]`
   - `Image failed to load: [URL]`

## 🛠️ **Solution 1: Update Image URLs in Database**

Go to Supabase SQL Editor and run this to fix image URLs:

```sql
-- Update all product images with working URLs
UPDATE products SET image_url = 
  CASE 
    WHEN name LIKE '%Blush%' THEN 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&auto=format'
    WHEN name LIKE '%Lipstick%' THEN 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop&auto=format'
    WHEN name LIKE '%Eyeshadow%' THEN 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&auto=format'
    WHEN name LIKE '%Blouse%' THEN 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&auto=format'
    WHEN name LIKE '%Dress%' THEN 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&auto=format'
    WHEN name LIKE '%Sweater%' THEN 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format'
    WHEN name LIKE '%Coat%' THEN 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&auto=format'
    ELSE 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&auto=format'
  END;
```

## 🛠️ **Solution 2: Add New Products with Working Images**

If the above doesn't work, add fresh products:

```sql
-- Clear existing products
DELETE FROM products;

-- Add new products with working image URLs (Prices in Indian Rupees ₹)
INSERT INTO products (name, brand, category, price, description, season, undertone, hue, chroma, value, tags, image_url) VALUES
('Coral Blush', 'Beauty Co', 'Makeup', 1999, 'Perfect coral blush for warm spring tones', 'Spring', 'Warm', 'Orange', 'Medium', 'Light', ARRAY['blush', 'coral', 'warm'], 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'),
('Peach Lipstick', 'Glam Beauty', 'Makeup', 1499, 'Soft peach lipstick for spring complexions', 'Spring', 'Warm', 'Orange', 'Medium', 'Light', ARRAY['lipstick', 'peach', 'warm'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop'),
('Light Green Eyeshadow', 'Makeup Pro', 'Makeup', 1799, 'Fresh light green eyeshadow', 'Spring', 'Warm', 'Green', 'Medium', 'Light', ARRAY['eyeshadow', 'green', 'light'], 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop'),
('Spring Blouse', 'Style Co', 'Clothing', 3999, 'Light floral blouse for spring', 'Spring', 'Warm', 'Green', 'Medium', 'Light', ARRAY['blouse', 'floral', 'spring'], 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'),
('Cool Pink Blush', 'Beauty Co', 'Makeup', 2199, 'Cool pink blush for summer tones', 'Summer', 'Cool', 'Pink', 'Medium', 'Light', ARRAY['blush', 'pink', 'cool'], 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'),
('Berry Lipstick', 'Glam Beauty', 'Makeup', 1599, 'Cool berry lipstick for summer', 'Summer', 'Cool', 'Purple', 'High', 'Medium', ARRAY['lipstick', 'berry', 'cool'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop'),
('Blue Eyeshadow', 'Makeup Pro', 'Makeup', 1899, 'Cool blue eyeshadow palette', 'Summer', 'Cool', 'Blue', 'Medium', 'Medium', ARRAY['eyeshadow', 'blue', 'cool'], 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop'),
('Summer Dress', 'Style Co', 'Clothing', 6499, 'Cool pastel dress for summer', 'Summer', 'Cool', 'Blue', 'Medium', 'Light', ARRAY['dress', 'pastel', 'summer'], 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'),
('Bronze Blush', 'Beauty Co', 'Makeup', 2399, 'Rich bronze blush for autumn tones', 'Autumn', 'Warm', 'Brown', 'High', 'Medium', ARRAY['blush', 'bronze', 'warm'], 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'),
('Burnt Orange Lipstick', 'Glam Beauty', 'Makeup', 1799, 'Deep burnt orange for autumn', 'Autumn', 'Warm', 'Orange', 'High', 'Dark', ARRAY['lipstick', 'orange', 'warm'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop'),
('Golden Eyeshadow', 'Makeup Pro', 'Makeup', 2099, 'Rich golden eyeshadow palette', 'Autumn', 'Warm', 'Yellow', 'High', 'Medium', ARRAY['eyeshadow', 'gold', 'warm'], 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop'),
('Autumn Sweater', 'Style Co', 'Clothing', 5499, 'Warm autumn sweater', 'Autumn', 'Warm', 'Orange', 'High', 'Medium', ARRAY['sweater', 'warm', 'autumn'], 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop'),
('Deep Berry Blush', 'Beauty Co', 'Makeup', 2499, 'Deep berry blush for winter tones', 'Winter', 'Cool', 'Purple', 'High', 'Dark', ARRAY['blush', 'berry', 'cool'], 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'),
('Deep Red Lipstick', 'Glam Beauty', 'Makeup', 1899, 'Classic deep red lipstick', 'Winter', 'Cool', 'Red', 'High', 'Dark', ARRAY['lipstick', 'red', 'cool'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop'),
('Silver Eyeshadow', 'Makeup Pro', 'Makeup', 2299, 'Cool silver eyeshadow palette', 'Winter', 'Cool', 'Gray', 'Medium', 'Medium', ARRAY['eyeshadow', 'silver', 'cool'], 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop'),
('Winter Coat', 'Style Co', 'Clothing', 10999, 'Elegant winter coat', 'Winter', 'Cool', 'Black', 'High', 'Dark', ARRAY['coat', 'winter', 'elegant'], 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop'),
('Neutral Blush', 'Beauty Co', 'Makeup', 1999, 'Versatile neutral blush for all seasons', 'Neutral', 'Neutral', 'Pink', 'Low', 'Medium', ARRAY['blush', 'neutral', 'universal'], 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'),
('Nude Lipstick', 'Glam Beauty', 'Makeup', 1399, 'Classic nude lipstick for everyone', 'Neutral', 'Neutral', 'Brown', 'Low', 'Medium', ARRAY['lipstick', 'nude', 'universal'], 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop'),
('Natural Eyeshadow', 'Makeup Pro', 'Makeup', 1699, 'Natural eyeshadow palette', 'Neutral', 'Neutral', 'Brown', 'Low', 'Medium', ARRAY['eyeshadow', 'natural', 'universal'], 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop');
```

## ✅ **After Running Either Solution:**

1. **Refresh your app**: https://karthikganesh256.github.io/Echo-style-Web/
2. **Go to Products page**
3. **Images should now load!** 🎉

## 🔍 **Debug Steps:**

1. **Check Console** for image URL logs
2. **Test image URLs** by opening them in a new tab
3. **Check Supabase** → Table Editor → products → image_url column

---

**The app now has fallback icons (🛍️) if images fail to load, so you'll always see something!**
