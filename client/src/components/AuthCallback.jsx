import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import useAuthStore from '../store/useAuthStore';
import { motion } from 'framer-motion';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login?error=auth_failed');
          return;
        }

        if (data.session) {
          // User is authenticated
          setUser(data.session.user, data.session.access_token);
          navigate('/analyze');
        } else {
          // No session found
          navigate('/login?error=no_session');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/login?error=auth_failed');
      }
    };

    handleAuthCallback();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-8 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-opacity-30 border-t-white rounded-full mx-auto mb-6"
        />
        <h2 className="text-2xl font-bold text-white mb-4 font-display">
          Verifying Magic Link...
        </h2>
        <p className="text-purple-200">
          Please wait while we verify your magic link and sign you in.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthCallback;
