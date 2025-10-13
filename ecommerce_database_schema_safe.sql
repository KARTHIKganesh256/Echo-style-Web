-- E-Commerce Database Schema for Supabase (SAFE VERSION)
-- This version can be run multiple times safely

-- =====================================================
-- DROP EXISTING INDEXES (if any)
-- =====================================================
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_season;
DROP INDEX IF EXISTS idx_products_active;
DROP INDEX IF EXISTS idx_products_featured;
DROP INDEX IF EXISTS idx_products_created;
DROP INDEX IF EXISTS idx_orders_user;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_created;
DROP INDEX IF EXISTS idx_orders_number;
DROP INDEX IF EXISTS idx_cart_user;
DROP INDEX IF EXISTS idx_reviews_product;
DROP INDEX IF EXISTS idx_reviews_user;
DROP INDEX IF EXISTS idx_reviews_approved;
DROP INDEX IF EXISTS idx_wishlist_user;

-- =====================================================
-- 1. CATEGORIES TABLE
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

-- =====================================================
-- 2. ECOMMERCE PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ecommerce_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    sku VARCHAR(100) UNIQUE,
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    
    -- Inventory
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    is_in_stock BOOLEAN DEFAULT true,
    track_inventory BOOLEAN DEFAULT true,
    
    -- Product Details
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand VARCHAR(100),
    weight DECIMAL(10, 2),
    dimensions JSONB, -- {length, width, height, unit}
    
    -- Images
    images JSONB DEFAULT '[]', -- Array of image URLs
    thumbnail_url TEXT,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT[],
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    
    -- Seasonal color analysis integration
    season VARCHAR(20), -- Spring, Summer, Autumn, Winter
    undertone VARCHAR(20), -- Warm, Cool, Neutral
    color_tags TEXT[], -- Array of color names
    
    -- Stats
    views_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. PRODUCT VARIANTS TABLE (for size, color variations)
-- =====================================================
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES ecommerce_products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g., "Red - Large"
    sku VARCHAR(100) UNIQUE,
    
    -- Variant attributes
    attributes JSONB, -- {color: "Red", size: "L", material: "Cotton"}
    
    -- Pricing (can override product price)
    price DECIMAL(10, 2),
    compare_at_price DECIMAL(10, 2),
    
    -- Inventory
    stock_quantity INTEGER DEFAULT 0,
    is_in_stock BOOLEAN DEFAULT true,
    
    -- Images
    image_url TEXT,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. SHOPPING CART TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS shopping_cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID REFERENCES ecommerce_products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL, -- Price at time of adding
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'shopping_cart_user_product_variant_key'
    ) THEN
        ALTER TABLE shopping_cart ADD CONSTRAINT shopping_cart_user_product_variant_key 
        UNIQUE(user_id, product_id, variant_id);
    END IF;
END $$;

-- =====================================================
-- 5. ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID,
    
    -- Customer Info
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    
    -- Shipping Address
    shipping_address JSONB NOT NULL, -- {line1, line2, city, state, country, postal_code}
    billing_address JSONB, -- Same structure as shipping
    
    -- Order Totals
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    
    -- Payment
    payment_method VARCHAR(50), -- COD, Card, UPI, etc.
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_id VARCHAR(255), -- Payment gateway transaction ID
    
    -- Order Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
    
    -- Tracking
    tracking_number VARCHAR(100),
    shipping_carrier VARCHAR(100),
    
    -- Notes
    customer_notes TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES ecommerce_products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    
    -- Product snapshot (in case product is deleted later)
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    variant_name VARCHAR(100),
    sku VARCHAR(100),
    
    -- Pricing
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. PRODUCT REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES ecommerce_products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    
    -- Review images
    images TEXT[], -- Array of image URLs
    
    -- Verification
    is_verified_purchase BOOLEAN DEFAULT false,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT false,
    admin_reply TEXT,
    
    -- Helpful votes
    helpful_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'product_reviews_product_user_key'
    ) THEN
        ALTER TABLE product_reviews ADD CONSTRAINT product_reviews_product_user_key 
        UNIQUE(product_id, user_id);
    END IF;
END $$;

-- =====================================================
-- 8. WISHLIST TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID REFERENCES ecommerce_products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'wishlist_user_product_key'
    ) THEN
        ALTER TABLE wishlist ADD CONSTRAINT wishlist_user_product_key 
        UNIQUE(user_id, product_id);
    END IF;
END $$;

-- =====================================================
-- 9. COUPONS/DISCOUNTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    
    -- Discount
    discount_type VARCHAR(20) NOT NULL, -- percentage, fixed
    discount_value DECIMAL(10, 2) NOT NULL,
    
    -- Limits
    min_purchase_amount DECIMAL(10, 2),
    max_discount_amount DECIMAL(10, 2),
    usage_limit INTEGER, -- Total uses allowed
    usage_per_customer INTEGER DEFAULT 1,
    
    -- Validity
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    
    -- Usage tracking
    times_used INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. COUPON USAGE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS coupon_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'coupon_usage_coupon_order_key'
    ) THEN
        ALTER TABLE coupon_usage ADD CONSTRAINT coupon_usage_coupon_order_key 
        UNIQUE(coupon_id, order_id);
    END IF;
END $$;

-- =====================================================
-- 11. USER ADDRESSES TABLE
-- =====================================================
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
    
    address_type VARCHAR(20) DEFAULT 'home', -- home, work, other
    is_default BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Products
CREATE INDEX IF NOT EXISTS idx_products_category ON ecommerce_products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_season ON ecommerce_products(season);
CREATE INDEX IF NOT EXISTS idx_products_active ON ecommerce_products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON ecommerce_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created ON ecommerce_products(created_at DESC);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- Cart
CREATE INDEX IF NOT EXISTS idx_cart_user ON shopping_cart(user_id);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON product_reviews(is_approved);

-- Wishlist
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE ecommerce_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active products" ON ecommerce_products;
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
DROP POLICY IF EXISTS "Users can view own cart" ON shopping_cart;
DROP POLICY IF EXISTS "Users can insert into own cart" ON shopping_cart;
DROP POLICY IF EXISTS "Users can update own cart" ON shopping_cart;
DROP POLICY IF EXISTS "Users can delete from own cart" ON shopping_cart;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON product_reviews;
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can add to own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can remove from own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can view own addresses" ON user_addresses;
DROP POLICY IF EXISTS "Users can create own addresses" ON user_addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON user_addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON user_addresses;

-- Products: Everyone can view active products
CREATE POLICY "Anyone can view active products"
ON ecommerce_products FOR SELECT
USING (is_active = true);

-- Categories: Everyone can view active categories
CREATE POLICY "Anyone can view active categories"
ON categories FOR SELECT
USING (is_active = true);

-- Shopping Cart: Users can only access their own cart
CREATE POLICY "Users can view own cart"
ON shopping_cart FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own cart"
ON shopping_cart FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
ON shopping_cart FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
ON shopping_cart FOR DELETE
USING (auth.uid() = user_id);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Order Items: Users can view items from their orders
CREATE POLICY "Users can view own order items"
ON order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
);

-- Reviews: Users can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
ON product_reviews FOR SELECT
USING (is_approved = true);

CREATE POLICY "Users can create reviews"
ON product_reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
ON product_reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
ON product_reviews FOR DELETE
USING (auth.uid() = user_id);

-- Wishlist: Users can only access their own wishlist
CREATE POLICY "Users can view own wishlist"
ON wishlist FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist"
ON wishlist FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own wishlist"
ON wishlist FOR DELETE
USING (auth.uid() = user_id);

-- Addresses: Users can only access their own addresses
CREATE POLICY "Users can view own addresses"
ON user_addresses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addresses"
ON user_addresses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
ON user_addresses FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
ON user_addresses FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON ecommerce_products;
DROP TRIGGER IF EXISTS update_cart_updated_at ON shopping_cart;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_rating_on_review_insert ON product_reviews;
DROP TRIGGER IF EXISTS update_rating_on_review_update ON product_reviews;
DROP TRIGGER IF EXISTS generate_order_number_trigger ON orders;

-- Apply to all tables with updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON ecommerce_products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON shopping_cart
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update product rating when review is added/updated
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ecommerce_products
    SET 
        rating_average = (
            SELECT COALESCE(AVG(rating), 0)
            FROM product_reviews
            WHERE product_id = NEW.product_id
            AND is_approved = true
        ),
        review_count = (
            SELECT COUNT(*)
            FROM product_reviews
            WHERE product_id = NEW.product_id
            AND is_approved = true
        )
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review_insert
AFTER INSERT ON product_reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_rating_on_review_update
AFTER UPDATE ON product_reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'order_number_seq') THEN
        CREATE SEQUENCE order_number_seq;
    END IF;
END $$;

CREATE TRIGGER generate_order_number_trigger
BEFORE INSERT ON orders
FOR EACH ROW 
WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- SAMPLE DATA (Optional)
-- =====================================================

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Makeup', 'makeup', 'Makeup products for all skin tones'),
('Skincare', 'skincare', 'Skincare essentials'),
('Fashion', 'fashion', 'Fashion and accessories'),
('Hair Care', 'hair-care', 'Hair care products'),
('Fragrance', 'fragrance', 'Perfumes and fragrances')
ON CONFLICT (slug) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ E-Commerce database setup completed successfully!';
    RAISE NOTICE '📊 Tables created: 11';
    RAISE NOTICE '🔒 Row Level Security enabled';
    RAISE NOTICE '⚡ Indexes and triggers configured';
    RAISE NOTICE '🎯 Sample categories added';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Next steps:';
    RAISE NOTICE '   1. Go to /admin and add products';
    RAISE NOTICE '   2. Products will appear in /products';
    RAISE NOTICE '   3. Start shopping!';
END $$;

