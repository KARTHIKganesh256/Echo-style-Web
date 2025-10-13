# 📊 CSV Files Guide for EchoStyle Web Application

## Available CSV Files

### 1. **products_data.csv** - Product Database
**Contains:** 25 beauty products with complete details

**Columns:**
- `id`: Unique product identifier
- `name`: Product name
- `brand`: Brand name
- `category`: Product category (Makeup, Foundation, etc.)
- `price`: Price in USD
- `image_url`: Product image URL
- `description`: Product description
- `season`: Seasonal classification (Spring, Summer, Autumn, Winter)
- `undertone`: Undertone match (Warm, Cool, Neutral)
- `hue`: Color family (Orange, Pink, Brown, etc.)
- `chroma`: Color intensity (Low, Medium, High)
- `value`: Color lightness (Light, Medium, Dark)
- `tags`: Searchable tags
- `rating`: Customer rating (1-5)

**Use Cases:**
- Import products into database
- Bulk product updates
- Data analysis and reporting
- Product recommendations

---

### 2. **users_template.csv** - User Data Template
**Contains:** Sample user data structure

**Columns:**
- `id`: User ID
- `email`: User email address
- `name`: Full name
- `created_at`: Account creation timestamp
- `season`: User's seasonal color type
- `undertone`: User's undertone (Warm/Cool)
- `skin_tone`: User's skin tone
- `saved_products`: Comma-separated product IDs
- `subscription_status`: Account status

**Use Cases:**
- User data export
- Bulk user import
- User analytics
- Subscription management

---

### 3. **skin_analysis_results.csv** - Analysis Results
**Contains:** Skin care analysis data

**Columns:**
- `user_id`: User identifier
- `analysis_date`: Date of analysis
- `skin_type`: Skin type classification
- `skin_concerns`: User's skin concerns
- `season`: Seasonal color type
- `undertone`: Undertone classification
- `recommended_colors`: Color recommendations
- `lifestyle_factors`: Health and lifestyle data

**Use Cases:**
- Export analysis results
- Track user progress
- Generate reports
- Research and analytics

---

### 4. **seasonal_palettes.csv** - Color Palette Reference
**Contains:** Complete seasonal color palette guide

**Columns:**
- `season`: Season name
- `undertone`: Undertone classification
- `primary_colors`: Main color palette
- `secondary_colors`: Supporting colors
- `accent_colors`: Accent colors
- `best_makeup_shades`: Recommended makeup
- `avoid_colors`: Colors to avoid

**Use Cases:**
- Color recommendations
- Product filtering
- User education
- Style guidance

---

## 🔧 How to Use These CSV Files

### **Import into Supabase Database:**

```sql
-- Create products table
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT,
  brand TEXT,
  category TEXT,
  price DECIMAL,
  image_url TEXT,
  description TEXT,
  season TEXT,
  undertone TEXT,
  hue TEXT,
  chroma TEXT,
  value TEXT,
  tags TEXT,
  rating DECIMAL
);

-- Import CSV in Supabase Dashboard:
-- 1. Go to Table Editor
-- 2. Select "products" table
-- 3. Click "Import data from CSV"
-- 4. Upload products_data.csv
```

### **Import into Local Application:**

```javascript
// Example: Load products from CSV
import Papa from 'papaparse';

Papa.parse(csvFile, {
  header: true,
  complete: (results) => {
    console.log('Products loaded:', results.data);
    // Use results.data for your application
  }
});
```

### **Excel/Google Sheets:**
- Open CSV files directly in Excel or Google Sheets
- Edit data as needed
- Export back to CSV format

---

## 📈 Data Statistics

- **Total Products:** 25
- **Product Categories:** Makeup (20), Foundation (5)
- **Seasons Covered:** Spring, Summer, Autumn, Winter
- **Price Range:** $19.99 - $49.99
- **Average Rating:** 4.5/5.0

---

## 🔄 Regular Updates

**Recommended:**
- Update product prices quarterly
- Add new products monthly
- Review ratings weekly
- Update user data daily

---

## 📝 CSV Format Guidelines

1. **Always use UTF-8 encoding**
2. **Keep headers in first row**
3. **Use commas for arrays** (e.g., "tag1,tag2,tag3")
4. **Escape commas in text** with quotes
5. **Use ISO 8601 for dates** (YYYY-MM-DDTHH:MM:SSZ)

---

## 🛠️ Tools for CSV Management

- **Excel** - Basic editing
- **Google Sheets** - Collaborative editing
- **CSV Editor Pro** - Advanced CSV editing
- **Papa Parse** - JavaScript CSV parser
- **Python Pandas** - Data analysis

---

## 📞 Need Help?

If you need to:
- Add more products
- Modify CSV structure
- Import data into database
- Create custom reports

Just ask! I can help you manage and update these CSV files.






