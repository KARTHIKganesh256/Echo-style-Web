# Supabase Backend Setup

Your frontend is now configured to use Supabase as the backend.

## ✅ Configuration Complete

- **Supabase URL**: https://fcujblneuxjtvxxafyne.supabase.co
- **Anon Key**: Configured in environment files

## 📋 Database Setup Required

To make your app fully functional with Supabase, you need to set up the following tables:

### 1. Users Table (if not using Supabase Auth)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  password_hash TEXT,
  skin_tone TEXT,
  undertone TEXT,
  depth TEXT,
  season TEXT,
  saved_products JSONB DEFAULT '[]',
  photo_history JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Products Table

```sql
CREATE TABLE products (
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
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. User Saved Products (Junction Table)

```sql
CREATE TABLE user_saved_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

### 4. Analysis History

```sql
CREATE TABLE analysis_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  undertone TEXT,
  depth TEXT,
  season TEXT,
  photo_url TEXT,
  analyzed_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Authentication Options

### Option 1: Use Supabase Auth (Recommended)

Supabase provides built-in authentication. Update your auth logic to use:

```javascript
// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Sign Out
const { error } = await supabase.auth.signOut();

// Get Current User
const { data: { user } } = await supabase.auth.getUser();
```

### Option 2: Custom Authentication

Keep using your current JWT-based authentication by:
1. Deploying your Express backend to Render/Railway
2. Update `VITE_API_URL` to point to your deployed backend

## 🔧 Row Level Security (RLS)

Enable RLS on your tables for security:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_products ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policies for products (public read)
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT TO authenticated, anon USING (true);

-- Policies for saved products
CREATE POLICY "Users can manage their saved products" ON user_saved_products
  FOR ALL USING (auth.uid() = user_id);
```

## 📊 Seed Sample Products

Use the Supabase SQL editor to insert sample products:

```sql
INSERT INTO products (name, brand, category, price, season, undertone, image_url) VALUES
('Coral Blush', 'Beauty Co', 'Makeup', 24.99, 'Spring', 'Warm', 'https://example.com/coral-blush.jpg'),
('Cool Pink Lipstick', 'Makeup Pro', 'Makeup', 19.99, 'Summer', 'Cool', 'https://example.com/pink-lip.jpg'),
('Warm Bronze Eyeshadow', 'Glam Beauty', 'Makeup', 32.99, 'Autumn', 'Warm', 'https://example.com/bronze.jpg'),
('Deep Berry Lipstick', 'Lux Cosmetics', 'Makeup', 28.99, 'Winter', 'Cool', 'https://example.com/berry.jpg');
```

## 🚀 Next Steps

1. **Go to Supabase Dashboard**: https://app.supabase.com/project/fcujblneuxjtvxxafyne
2. **Set up tables** using the SQL editor (copy the schemas above)
3. **Enable authentication** in the Authentication section
4. **Configure RLS policies** for security
5. **Seed sample data** using the SQL editor

## 🔄 Update Frontend Code

Your app currently uses a custom Express API. You have two options:

### Option A: Migrate to Supabase Completely
Update your API calls to use Supabase SDK instead of Axios:

```javascript
// Example: Fetch products
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('season', userSeason);
```

### Option B: Keep Express Backend
Deploy your Express backend separately and use Supabase only for database:
- Deploy `server/` folder to Render/Railway
- Keep current API structure
- Use Supabase as your database (replace MongoDB)

## 📝 Environment Variables

Already configured in your `.env` files:
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`
- ✅ `VITE_API_URL`

## 🎯 Recommended Approach

For fastest deployment with minimal code changes:
1. Set up Supabase tables (schemas above)
2. Enable Supabase Auth
3. Update your API utility files to use Supabase SDK
4. Test locally with `npm run dev`
5. Deploy to GitHub Pages with `npm run deploy`

---

**Need help?** Check the [Supabase Docs](https://supabase.com/docs) for detailed guides.
