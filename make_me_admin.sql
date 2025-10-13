-- Make karthikganeshchakibanda@gmail.com an Admin
-- Run this in Supabase SQL Editor

-- =====================================================
-- STEP 1: Find and Assign Admin Role
-- =====================================================

-- This will automatically find your user ID and make you admin
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'karthikganeshchakibanda@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin', updated_at = NOW();

-- =====================================================
-- STEP 2: Verify Admin Assignment
-- =====================================================

-- Check if admin role was assigned successfully
SELECT 
    u.email,
    ur.role,
    ur.created_at as role_assigned_at,
    'SUCCESS! You are now an admin' as status
FROM auth.users u
INNER JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'karthikganeshchakibanda@gmail.com';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Admin role assigned successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '📧 Email: karthikganeshchakibanda@gmail.com';
    RAISE NOTICE '👑 Role: admin';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 NEXT STEPS:';
    RAISE NOTICE '1. Logout from your app';
    RAISE NOTICE '2. Login again with your email and password';
    RAISE NOTICE '3. Look for "👑 Admin" link in navbar';
    RAISE NOTICE '4. Click it to access admin dashboard';
    RAISE NOTICE '';
    RAISE NOTICE '✨ You now have full admin access!';
END $$;

