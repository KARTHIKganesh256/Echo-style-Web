import { create } from 'zustand';

const useAuthStore = create((set) => {
  // Load from localStorage on init
  const stored = localStorage.getItem('auth-storage');
  const initialState = stored
    ? JSON.parse(stored).state
    : { user: null, token: null, isAuthenticated: false };

  return {
    ...initialState,

    setUser: (user, token) => {
      const newState = { user, token, isAuthenticated: true };
      localStorage.setItem('auth-storage', JSON.stringify({ state: newState }));
      set(newState);
    },

    updateUser: (userData) =>
      set((state) => {
        const newState = { ...state, user: { ...state.user, ...userData } };
        localStorage.setItem('auth-storage', JSON.stringify({ state: newState }));
        return newState;
      }),

    logout: () => {
      const newState = { user: null, token: null, isAuthenticated: false };
      localStorage.setItem('auth-storage', JSON.stringify({ state: newState }));
      set(newState);
    },
  };
});

export default useAuthStore;