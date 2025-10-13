import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { localAuth } from '../utils/localAuth';

const useAuthStore = create((set, get) => {
  // Initialize auth state from Supabase session with local fallback
  const initializeAuth = async () => {
    try {
      console.log('Initializing auth...');
      
      // Try Supabase first
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          console.log('✅ Session found via Supabase:', session.user.email);
          set({
            user: session.user,
            token: session.access_token,
            isAuthenticated: true,
          });
          return;
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase session failed, checking local auth:', supabaseError.message);
      }
      
      // Fallback to local authentication
      const localUser = await localAuth.getCurrentUser();
      if (localUser) {
        console.log('✅ Session found via local auth:', localUser.email);
        set({
          user: localUser,
          token: localAuth.generateToken(localUser),
          isAuthenticated: true,
        });
      } else {
        console.log('No session found in either system');
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
      try {
        // Try Supabase first
        try {
          const { data: { session }, error } = await supabase.auth.refreshSession();
          
          if (error) {
            throw error;
          }
          
          if (session?.user) {
            console.log('✅ Session refreshed successfully via Supabase:', session.user.email);
            set({
              user: session.user,
              token: session.access_token,
              isAuthenticated: true,
            });
            return true;
          }
        } catch (supabaseError) {
          console.log('⚠️ Supabase refresh failed, checking local auth:', supabaseError.message);
        }
        
        // Fallback to local authentication
        const localUser = await localAuth.getCurrentUser();
        if (localUser) {
          console.log('✅ Session refreshed successfully via local auth:', localUser.email);
          set({
            user: localUser,
            token: localAuth.generateToken(localUser),
            isAuthenticated: true,
          });
          return true;
        } else {
          console.log('No session after refresh');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return false;
        }
      } catch (error) {
        console.error('Error refreshing session:', error);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        return false;
      }
    },
  };
});

export default useAuthStore;