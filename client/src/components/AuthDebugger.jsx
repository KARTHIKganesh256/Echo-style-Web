import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import useAuthStore from '../store/useAuthStore';

const AuthDebugger = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // Check Supabase user
        const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
        
        setDebugInfo({
          authStore: {
            isAuthenticated,
            user: user?.email || 'No user'
          },
          supabase: {
            hasSession: !!session,
            hasUser: !!supabaseUser,
            userEmail: supabaseUser?.email || 'No user',
            sessionError: sessionError?.message || 'No error',
            userError: userError?.message || 'No error'
          }
        });
      } catch (err) {
        setDebugInfo({
          error: err.message
        });
      }
    };

    checkAuth();
  }, [isAuthenticated, user]);

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">🔍 Auth Debug Info</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};

export default AuthDebugger;







