# 💰 Update Product Prices to Indian Rupees (₹)

## Quick Update - Convert All Prices to INR

Run this SQL script in your **Supabase SQL Editor** to convert all product prices from USD to INR:

```sql
-- Update all product prices to Indian Rupees (₹)
-- Conversion rate: 1 USD ≈ 83 INR (rounded for clean prices)

UPDATE products SET price = 
  CASE 
    -- Makeup Products (₹1,500 - ₹2,500)
    WHEN name LIKE '%Blush%' THEN ROUND((price * 83) / 100) * 100  -- Round to nearest 100
    WHEN name LIKE '%Lipstick%' THEN ROUND((price * 83) / 100) * 100
    WHEN name LIKE '%Eyeshadow%' THEN ROUND((price * 83) / 100) * 100
    
    -- Clothing Products (₹4,000 - ₹10,000)
    WHEN category = 'Clothing' THEN ROUND((price * 83) / 100) * 100
    
    -- Default conversion
    ELSE ROUND((price * 83) / 100) * 100
  END;
```

## Or Use These Specific Prices:

If you want more control over pricing, use this script instead:

```sql
-- Set specific Indian Rupee prices for each product type

-- Spring Products
UPDATE products SET price = 1999 WHERE name = 'Coral Blush';
UPDATE products SET price = 1499 WHERE name = 'Peach Lipstick';
UPDATE products SET price = 1799 WHERE name = 'Light Green Eyeshadow';
UPDATE products SET price = 3999 WHERE name = 'Spring Blouse';

-- Summer Products
UPDATE products SET price = 2199 WHERE name = 'Cool Pink Blush';
UPDATE products SET price = 1599 WHERE name = 'Berry Lipstick';
UPDATE products SET price = 1899 WHERE name = 'Blue Eyeshadow';
UPDATE products SET price = 6499 WHERE name = 'Summer Dress';

-- Autumn Products
UPDATE products SET price = 2399 WHERE name = 'Bronze Blush';
UPDATE products SET price = 1799 WHERE name = 'Burnt Orange Lipstick';
UPDATE products SET price = 2099 WHERE name = 'Golden Eyeshadow';
UPDATE products SET price = 5499 WHERE name = 'Autumn Sweater';

-- Winter Products
UPDATE products SET price = 2499 WHERE name = 'Deep Berry Blush';
UPDATE products SET price = 1899 WHERE name = 'Deep Red Lipstick';
UPDATE products SET price = 2299 WHERE name = 'Silver Eyeshadow';
UPDATE products SET price = 10999 WHERE name = 'Winter Coat';

-- Neutral Products
UPDATE products SET price = 1999 WHERE name = 'Neutral Blush';
UPDATE products SET price = 1399 WHERE name = 'Nude Lipstick';
UPDATE products SET price = 1699 WHERE name = 'Natural Eyeshadow';
```

## ✅ After Running the Script:

1. **Refresh your app**: https://karthikganesh256.github.io/Echo-style-Web/
2. **Go to Products page**
3. **Prices will now show in ₹ (Indian Rupees)** instead of $

## 📊 Price Ranges:

- **Makeup Products**: ₹1,399 - ₹2,499
- **Clothing Products**: ₹3,999 - ₹10,999

---

## 🎨 Example Product Prices:

| Product | Old Price | New Price |
|---------|-----------|-----------|
| Coral Blush | $24.99 | ₹1,999 |
| Peach Lipstick | $18.99 | ₹1,499 |
| Spring Blouse | $49.99 | ₹3,999 |
| Summer Dress | $79.99 | ₹6,499 |
| Winter Coat | $129.99 | ₹10,999 |

---

**The frontend is already updated to show ₹ symbol! Just run the SQL script to update the database prices.** 🚀




