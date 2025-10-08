import { create } from 'zustand';
import { supabase } from '../utils/supabase';

const useAuthStore = create((set, get) => {
  // Initialize auth state from Supabase session
  const initializeAuth = async () => {
    try {
      console.log('Initializing auth...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      
      if (session?.user) {
        console.log('Session found:', session.user.email);
        set({
          user: session.user,
          token: session.access_token,
          isAuthenticated: true,
        });
      } else {
        console.log('No session found');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  };

  // Listen for auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email);
    
    if (session?.user) {
      set({
        user: session.user,
        token: session.access_token,
        isAuthenticated: true,
      });
    } else {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  });

  // Initialize on load
  initializeAuth();

  return {
    user: null,
    token: null,
    isAuthenticated: false,

    setUser: (user, token) => {
      console.log('Setting user:', user?.email);
      set({ user, token, isAuthenticated: true });
    },

    updateUser: (userData) => {
      const currentState = get();
      console.log('Updating user data:', userData);
      set((state) => ({
        ...state,
        user: { ...state.user, ...userData },
      }));
    },

    logout: async () => {
      console.log('Logging out...');
      await supabase.auth.signOut();
      set({ user: null, token: null, isAuthenticated: false });
    },

    // Add method to refresh session
    refreshSession: async () => {
      console.log('Refreshing session...');
      await initializeAuth();
    },
  };
});

export default useAuthStore;