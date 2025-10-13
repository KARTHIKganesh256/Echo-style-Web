/**
 * Admin Authentication Utilities
 * Secure admin role verification and access control
 */

import { supabase } from './supabase';

/**
 * Check if current user has admin role
 * @returns {Promise<boolean>} True if user is admin
 */
export const isAdmin = async () => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('❌ No authenticated user');
      return false;
    }

    // Check if user has admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('❌ Error checking admin role:', error);
      return false;
    }

    const isAdminUser = data?.role === 'admin';
    console.log(isAdminUser ? '✅ User is admin' : '❌ User is not admin');
    
    return isAdminUser;
  } catch (error) {
    console.error('❌ Error in isAdmin:', error);
    return false;
  }
};

/**
 * Get current user's role
 * @returns {Promise<string|null>} User role or null
 */
export const getUserRole = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If no role found, default to 'user'
      if (error.code === 'PGRST116') {
        return 'user';
      }
      console.error('Error getting user role:', error);
      return null;
    }

    return data?.role || 'user';
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
};

/**
 * Require admin access - throws error if not admin
 * @throws {Error} If user is not admin
 */
export const requireAdmin = async () => {
  const isAdminUser = await isAdmin();
  
  if (!isAdminUser) {
    throw new Error('Admin access required');
  }
  
  return true;
};

/**
 * Set user role (admin only operation - should be done via Supabase dashboard)
 * This is here for reference only
 */
export const setUserRole = async (userId, role) => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: role
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error setting user role:', error);
    return { data: null, error };
  }
};

/**
 * Check if user session is valid and user is admin
 * @returns {Promise<{isValid: boolean, isAdmin: boolean, user: object|null}>}
 */
export const checkAdminSession = async () => {
  try {
    // Check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return { isValid: false, isAdmin: false, user: null };
    }

    // Check admin role
    const isAdminUser = await isAdmin();

    return {
      isValid: true,
      isAdmin: isAdminUser,
      user: session.user
    };
  } catch (error) {
    console.error('Error checking admin session:', error);
    return { isValid: false, isAdmin: false, user: null };
  }
};

/**
 * Verify admin access with detailed response
 * @returns {Promise<{allowed: boolean, reason: string, user: object|null}>}
 */
export const verifyAdminAccess = async () => {
  try {
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        allowed: false,
        reason: 'Not authenticated',
        user: null
      };
    }

    // Check if user has admin role
    const isAdminUser = await isAdmin();

    if (!isAdminUser) {
      return {
        allowed: false,
        reason: 'Insufficient permissions',
        user: user
      };
    }

    return {
      allowed: true,
      reason: 'Access granted',
      user: user
    };
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return {
      allowed: false,
      reason: 'Verification error',
      user: null
    };
  }
};

export default {
  isAdmin,
  getUserRole,
  requireAdmin,
  checkAdminSession,
  verifyAdminAccess,
  setUserRole
};

