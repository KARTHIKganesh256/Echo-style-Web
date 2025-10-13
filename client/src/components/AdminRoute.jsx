/**
 * Admin Route Guard Component
 * Protects admin routes - only allows access to users with admin role
 * Redirects non-admin users to unauthorized page
 */

import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Card } from './ui/card';
import { Shield, AlertCircle } from 'lucide-react';
import { verifyAdminAccess } from '../utils/adminAuth';
import useAuthStore from '../store/useAuthStore';

const AdminRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [accessDeniedReason, setAccessDeniedReason] = useState('');
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAdminAccess();
  }, [isAuthenticated, user]);

  const checkAdminAccess = async () => {
    try {
      setChecking(true);

      // First check if user is authenticated
      if (!isAuthenticated) {
        console.log('🚫 User not authenticated - redirecting to login');
        setAccessDeniedReason('not_authenticated');
        setChecking(false);
        return;
      }

      // Check admin access
      const { allowed, reason } = await verifyAdminAccess();

      console.log('🔐 Admin access check:', { allowed, reason });

      if (allowed) {
        setIsAdminUser(true);
        setAccessDeniedReason('');
      } else {
        setIsAdminUser(false);
        setAccessDeniedReason(reason);
      }
    } catch (error) {
      console.error('❌ Error checking admin access:', error);
      setIsAdminUser(false);
      setAccessDeniedReason('error');
    } finally {
      setChecking(false);
    }
  };

  // Show loading while checking
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Verifying Access</h2>
          <p className="text-purple-200">Checking admin permissions...</p>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (accessDeniedReason === 'not_authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show access denied if not admin
  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center p-4">
        <Card className="p-12 text-center max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <div className="mb-6">
            <AlertCircle size={64} className="text-red-400 mx-auto mb-4" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-purple-200 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-200 text-sm font-medium">
              {accessDeniedReason === 'Insufficient permissions' 
                ? '🔒 Admin privileges required'
                : '❌ Access verification failed'
              }
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all"
            >
              Go to Home
            </button>
            <p className="text-sm text-purple-300">
              Contact administrator if you believe this is an error
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // User is admin - render children
  return (
    <div>
      {/* Admin badge indicator */}
      <div className="fixed top-4 right-4 z-50 bg-green-500/20 backdrop-blur-sm border border-green-500/50 rounded-full px-4 py-2 flex items-center gap-2">
        <Shield size={16} className="text-green-400" />
        <span className="text-green-400 text-sm font-semibold">Admin Mode</span>
      </div>
      {children}
    </div>
  );
};

export default AdminRoute;

