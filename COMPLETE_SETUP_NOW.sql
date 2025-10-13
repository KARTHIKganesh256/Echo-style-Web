-- =====================================================
-- COMPLETE E-COMMERCE + ADMIN SETUP
-- Run this ONE script to set up everything!
-- =====================================================

-- This script is safe to run multiple times

-- =====================================================
-- PART 1: CREATE USER ROLES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Service role can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Anyone can view roles" ON user_roles;

-- Allow all authenticated users to view roles
CREATE POLICY "Anyone can view roles"
ON user_roles FOR SELECT
TO authenticated
USING (true);

-- =====================================================
-- PART 2: MAKE YOU ADMIN
-- =====================================================

-- Assign admin role to your account
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'karthikganeshchakibanda@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin', updated_at = NOW();

-- =====================================================
-- PART 3: CREATE ADMIN VERIFICATION FUNCTIONS
-- =====================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = user_uuid 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN is_admin(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PART 4: CATEGORIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    slug VARCHAR(100) NOT NULL UNIQUE,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

CREATE POLICY "Anyone can view active categories"
ON categories FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can insert categories"
ON categories FOR INSERT TO authenticated
WITH CHECK (is_current_user_admin());

CREATE POLICY "Admins can update categories"
ON categories FOR UPDATE TO authenticated
USING (is_current_user_admin());

CREATE POLICY "Admins can delete categories"
ON categories FOR DELETE TO authenticated
USING (is_current_user_admin());

-- =====================================================
-- PART 5: ECOMMERCE PRODUCTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS ecommerce_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    is_in_stock BOOLEAN DEFAULT true,
    track_inventory BOOLEAN DEFAULT true,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand VARCHAR(100),
    weight DECIMAL(10, 2),
    dimensions JSONB,
    images JSONB DEFAULT '[]',
    thumbnail_url TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT[],
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    season VARCHAR(20),
    undertone VARCHAR(20),
    color_tags TEXT[],
    views_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ecommerce_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active products" ON ecommerce_products;
DROP POLICY IF EXISTS "Admins can insert products" ON ecommerce_products;
DROP POLICY IF EXISTS "Admins can update products" ON ecommerce_products;
DROP POLICY IF EXISTS "Admins can delete products" ON ecommerce_products;

CREATE POLICY "Anyone can view active products"
ON ecommerce_products FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can insert products"
ON ecommerce_products FOR INSERT TO authenticated
WITH CHECK (is_current_user_admin());

CREATE POLICY "Admins can update products"
ON ecommerce_products FOR UPDATE TO authenticated
USING (is_current_user_admin());

CREATE POLICY "Admins can delete products"
ON ecommerce_products FOR DELETE TO authenticated
USING (is_current_user_admin());

-- =====================================================
-- PART 6: SHOPPING CART, ORDERS, WISHLIST TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS shopping_cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID REFERENCES ecommerce_products(id) ON DELETE CASCADE,
    variant_id UUID,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own cart" ON shopping_cart;
DROP POLICY IF EXISTS "Users can insert into own cart" ON shopping_cart;
DROP POLICY IF EXISTS "Users can update own cart" ON shopping_cart;
DROP POLICY IF EXISTS "Users can delete from own cart" ON shopping_cart;

CREATE POLICY "Users can view own cart"
ON shopping_cart FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own cart"
ON shopping_cart FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
ON shopping_cart FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
ON shopping_cart FOR DELETE USING (auth.uid() = user_id);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    tracking_number VARCHAR(100),
    shipping_carrier VARCHAR(100),
    customer_notes TEXT,
    admin_notes TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

CREATE POLICY "Users can view own orders"
ON orders FOR SELECT USING (auth.uid() = user_id OR is_current_user_admin());

CREATE POLICY "Users can create orders"
ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders"
ON orders FOR UPDATE TO authenticated
USING (is_current_user_admin());

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES ecommerce_products(id) ON DELETE SET NULL,
    variant_id UUID,
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    variant_name VARCHAR(100),
    sku VARCHAR(100),
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own order items" ON order_items;

CREATE POLICY "Users can view own order items"
ON order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR is_current_user_admin())
    )
);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID REFERENCES ecommerce_products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can add to own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can remove from own wishlist" ON wishlist;

CREATE POLICY "Users can view own wishlist"
ON wishlist FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist"
ON wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own wishlist"
ON wishlist FOR DELETE USING (auth.uid() = user_id);

-- User addresses
CREATE TABLE IF NOT EXISTS user_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    postal_code VARCHAR(20) NOT NULL,
    address_type VARCHAR(20) DEFAULT 'home',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own addresses" ON user_addresses;
DROP POLICY IF EXISTS "Users can create own addresses" ON user_addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON user_addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON user_addresses;

CREATE POLICY "Users can view own addresses"
ON user_addresses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addresses"
ON user_addresses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
ON user_addresses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
ON user_addresses FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- PART 7: CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON ecommerce_products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_season ON ecommerce_products(season);
CREATE INDEX IF NOT EXISTS idx_products_active ON ecommerce_products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_cart_user ON shopping_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);

-- =====================================================
-- PART 8: INSERT SAMPLE CATEGORIES
-- =====================================================

INSERT INTO categories (name, slug, description) VALUES
('Makeup', 'makeup', 'Makeup products for all skin tones'),
('Skincare', 'skincare', 'Skincare essentials'),
('Fashion', 'fashion', 'Fashion and accessories'),
('Hair Care', 'hair-care', 'Hair care products'),
('Fragrance', 'fragrance', 'Perfumes and fragrances')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- PART 9: VERIFY ADMIN ASSIGNMENT
-- =====================================================

-- Check if admin was assigned
SELECT 
    '✅ SETUP COMPLETE!' as message,
    u.email as admin_email,
    ur.role as admin_role,
    'You can now access /admin' as next_step
FROM auth.users u
INNER JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'karthikganeshchakibanda@gmail.com';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
DECLARE
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count FROM user_roles WHERE role = 'admin';
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ COMPLETE SETUP FINISHED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Tables Created:';
    RAISE NOTICE '   - user_roles (admin system)';
    RAISE NOTICE '   - categories';
    RAISE NOTICE '   - ecommerce_products';
    RAISE NOTICE '   - shopping_cart';
    RAISE NOTICE '   - orders';
    RAISE NOTICE '   - order_items';
    RAISE NOTICE '   - wishlist';
    RAISE NOTICE '   - user_addresses';
    RAISE NOTICE '';
    RAISE NOTICE '👑 Admin Users: %', admin_count;
    RAISE NOTICE '📧 Admin Email: karthikganeshchakibanda@gmail.com';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 NEXT STEPS:';
    RAISE NOTICE '1. Logout from your website';
    RAISE NOTICE '2. Login again with your email';
    RAISE NOTICE '3. You will see "👑 Admin" link in navbar';
    RAISE NOTICE '4. Click it to access admin dashboard';
    RAISE NOTICE '';
    RAISE NOTICE '🔗 Admin URL: /admin';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;

