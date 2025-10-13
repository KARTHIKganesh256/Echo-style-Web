import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import useAuthStore from '../store/useAuthStore';

const SessionFixer = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showFix, setShowFix] = useState(false);

  useEffect(() => {
    const checkSessionMismatch = async () => {
      if (isAuthenticated && user) {
        // Check if Supabase actually has a session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!session || !session.user) {
          console.log('🔧 Session mismatch detected - showing fix option');
          setShowFix(true);
        }
      }
    };

    checkSessionMismatch();
  }, [isAuthenticated, user]);

  const handleFixSession = async () => {
    console.log('🔧 Fixing session mismatch...');
    await logout();
    setShowFix(false);
    // Redirect to login
    window.location.href = '/login';
  };

  if (!showFix) return null;

  return (
    <div className="fixed top-4 left-4 bg-yellow-100 border border-yellow-400 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Session Issue Detected
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Your login session has expired. Please log in again to continue.</p>
          </div>
          <div className="mt-4">
            <button
              onClick={handleFixSession}
              className="bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-yellow-700"
            >
              Fix Session (Login Again)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionFixer;







