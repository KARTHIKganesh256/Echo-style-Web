import axios from 'axios';
import { supabase } from './supabase';

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const USE_SUPABASE = !!SUPABASE_URL;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      const authData = JSON.parse(token);
      if (authData.state?.token) {
        config.headers.Authorization = `Bearer ${authData.state.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API - Using Supabase Magic Link Auth
export const authAPI = {
  register: async (data) => {
    try {
      console.log('Sending magic link for registration...');
      const { data: authData, error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          data: {
            name: data.name,
          },
          emailRedirectTo: `${window.location.origin}/Echo-style-Web/`,
        }
      });
      
      if (error) {
        console.error('Magic link error:', error);
        throw new Error(error.message || 'Failed to send magic link');
      }
      
      console.log('Magic link sent successfully:', authData);
      return { 
        data: { message: 'Check your email for a magic link to sign in!' },
        token: null 
      };
    } catch (err) {
      console.error('Auth register error:', err);
      throw err;
    }
  },
  
  login: async (data) => {
    try {
      console.log('Sending magic link for login...');
      const { data: authData, error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/Echo-style-Web/`,
        }
      });
      
      if (error) {
        console.error('Magic link error:', error);
        throw new Error(error.message || 'Failed to send magic link');
      }
      
      console.log('Magic link sent successfully:', authData);
      return { 
        data: { message: 'Check your email for a magic link to sign in!' },
        token: null 
      };
    } catch (err) {
      console.error('Auth login error:', err);
      throw err;
    }
  },
  
  getProfile: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return { data: user };
  },
  
  updateProfile: async (userData) => {
    const { data, error } = await supabase.auth.updateUser({
      data: userData
    });
    if (error) throw new Error(error.message);
    return { data: data.user };
  },
};

// Analysis API
export const analysisAPI = {
  analyzeTone: (data) => api.post('/analyze-tone', data),
  getSeasonPalette: (season) => api.get(`/analyze-tone/palette/${season}`),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductsBySeason: (season) => api.get(`/products/season/${season}`),
  getRecommendedProducts: () => api.get('/products/recommended'),
  getProductById: (id) => api.get(`/products/${id}`),
  saveProduct: (id) => api.post(`/products/${id}/save`),
  unsaveProduct: (id) => api.delete(`/products/${id}/save`),
};

export default api;
