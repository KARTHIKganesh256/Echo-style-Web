-- Setup Admin Role System in Supabase
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. CREATE ADMIN ROLES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- 'admin' or 'user'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own role
CREATE POLICY "Users can view own role"
ON user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Only admins can insert/update roles (we'll handle this via service role)
CREATE POLICY "Service role can manage roles"
ON user_roles FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- 2. CREATE ADMIN VERIFICATION FUNCTION
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
-- 3. UPDATE ADMIN POLICIES FOR PRODUCTS
-- =====================================================

-- Drop old admin policies
DROP POLICY IF EXISTS "Admins can insert products" ON ecommerce_products;
DROP POLICY IF EXISTS "Admins can update products" ON ecommerce_products;
DROP POLICY IF EXISTS "Admins can delete products" ON ecommerce_products;

-- New admin-only policies
CREATE POLICY "Admins can insert products"
ON ecommerce_products FOR INSERT
TO authenticated
WITH CHECK (is_current_user_admin());

CREATE POLICY "Admins can update products"
ON ecommerce_products FOR UPDATE
TO authenticated
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

CREATE POLICY "Admins can delete products"
ON ecommerce_products FOR DELETE
TO authenticated
USING (is_current_user_admin());

-- =====================================================
-- 4. UPDATE ADMIN POLICIES FOR ORDERS
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- Admins can view ALL orders
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
TO authenticated
USING (is_current_user_admin() OR auth.uid() = user_id);

-- Admins can update orders
CREATE POLICY "Admins can update orders"
ON orders FOR UPDATE
TO authenticated
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- =====================================================
-- 5. SET YOUR ADMIN USER
-- =====================================================

-- Replace 'your-admin-email@example.com' with your actual admin email
-- After running this, login with that email to get the user_id

-- Then run this to make that user an admin:
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'admin' FROM auth.users 
-- WHERE email = 'your-admin-email@example.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- =====================================================
-- 6. HELPER VIEW FOR ADMIN CHECK
-- =====================================================

CREATE OR REPLACE VIEW admin_users AS
SELECT 
    u.id,
    u.email,
    ur.role,
    ur.created_at as role_assigned_at
FROM auth.users u
INNER JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';

-- Grant access to authenticated users to check their own admin status
GRANT SELECT ON admin_users TO authenticated;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Admin role system setup complete!';
    RAISE NOTICE '';
    RAISE NOTICE '📝 NEXT STEPS:';
    RAISE NOTICE '1. Find your user ID by running:';
    RAISE NOTICE '   SELECT id, email FROM auth.users WHERE email = ''your-email@example.com'';';
    RAISE NOTICE '';
    RAISE NOTICE '2. Make yourself admin by running:';
    RAISE NOTICE '   INSERT INTO user_roles (user_id, role)';
    RAISE NOTICE '   VALUES (''your-user-id-here'', ''admin'')';
    RAISE NOTICE '   ON CONFLICT (user_id) DO UPDATE SET role = ''admin'';';
    RAISE NOTICE '';
    RAISE NOTICE '3. Logout and login again to refresh your session';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 Security: Only users with admin role can now:';
    RAISE NOTICE '   - Create/Edit/Delete products';
    RAISE NOTICE '   - View all orders';
    RAISE NOTICE '   - Update order status';
    RAISE NOTICE '   - Access admin functions';
END $$;

