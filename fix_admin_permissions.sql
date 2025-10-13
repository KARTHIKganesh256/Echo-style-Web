-- Fix Admin Permissions for E-Commerce
-- This allows authenticated users to manage products, orders, etc.

-- =====================================================
-- ADMIN POLICIES FOR PRODUCTS
-- =====================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can insert products" ON ecommerce_products;
DROP POLICY IF EXISTS "Admins can update products" ON ecommerce_products;
DROP POLICY IF EXISTS "Admins can delete products" ON ecommerce_products;

-- Allow authenticated users to INSERT products (admin function)
CREATE POLICY "Admins can insert products"
ON ecommerce_products FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to UPDATE products (admin function)
CREATE POLICY "Admins can update products"
ON ecommerce_products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to DELETE products (admin function)
CREATE POLICY "Admins can delete products"
ON ecommerce_products FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- ADMIN POLICIES FOR CATEGORIES
-- =====================================================

DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

CREATE POLICY "Admins can insert categories"
ON categories FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can update categories"
ON categories FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can delete categories"
ON categories FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- ADMIN POLICIES FOR ORDERS (View and Update)
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- Admins can view ALL orders (not just their own)
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
TO authenticated
USING (true);

-- Admins can update order status, tracking, etc.
CREATE POLICY "Admins can update orders"
ON orders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- ADMIN POLICIES FOR ORDER ITEMS (View all)
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

CREATE POLICY "Admins can view all order items"
ON order_items FOR SELECT
TO authenticated
USING (true);

-- =====================================================
-- ADMIN POLICIES FOR REVIEWS (Moderate)
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all reviews" ON product_reviews;
DROP POLICY IF EXISTS "Admins can update any review" ON product_reviews;
DROP POLICY IF EXISTS "Admins can delete any review" ON product_reviews;

-- Admins can view all reviews (even unapproved)
CREATE POLICY "Admins can view all reviews"
ON product_reviews FOR SELECT
TO authenticated
USING (true);

-- Admins can update any review (for moderation)
CREATE POLICY "Admins can update any review"
ON product_reviews FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Admins can delete any review
CREATE POLICY "Admins can delete any review"
ON product_reviews FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- ADMIN POLICIES FOR PRODUCT VARIANTS
-- =====================================================

DROP POLICY IF EXISTS "Admins can manage variants" ON product_variants;

CREATE POLICY "Admins can manage variants"
ON product_variants FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- Success Message
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Admin permissions added successfully!';
    RAISE NOTICE '🔓 Authenticated users can now:';
    RAISE NOTICE '   - Create/Edit/Delete products';
    RAISE NOTICE '   - Manage categories';
    RAISE NOTICE '   - View and update all orders';
    RAISE NOTICE '   - Moderate reviews';
    RAISE NOTICE '   - Manage product variants';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 You can now add products from /admin';
END $$;

