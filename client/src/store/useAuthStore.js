import { create } from 'zustand';
import { supabase } from '../utils/supabase';

const useAuthStore = create((set) => {
  // Initialize auth state from Supabase session
  const initializeAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({
        user: session.user,
        token: session.access_token,
        isAuthenticated: true,
      });
    }
  };

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
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
      set({ user, token, isAuthenticated: true });
    },

    updateUser: (userData) =>
      set((state) => ({
        ...state,
        user: { ...state.user, ...userData },
      })),

    logout: async () => {
      await supabase.auth.signOut();
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});

export default useAuthStore;