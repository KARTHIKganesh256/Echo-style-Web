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

// Auth API - Using Supabase Password Auth
export const authAPI = {
  register: async (data) => {
    try {
      console.log('Registering user with password...');
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        throw new Error(error.message || 'Registration failed');
      }
      
      console.log('Registration successful:', authData);
      return { data: authData.user, token: authData.session?.access_token };
    } catch (err) {
      console.error('Auth register error:', err);
      throw err;
    }
  },
  
  login: async (data) => {
    try {
      console.log('Logging in user with password...');
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Login failed');
      }
      
      console.log('Login successful:', authData);
      return { data: authData.user, token: authData.session?.access_token };
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
    const { data, error } = await supabase.auth.updateUser(userData);
    if (error) throw new Error(error.message);
    return { data: data.user };
  },
};

// Analysis API
export const analysisAPI = {
  analyzeTone: (data) => api.post('/analyze-tone', data),
  getSeasonPalette: (season) => api.get(`/analyze-tone/palette/${season}`),
};

// Products API - Using Supabase
export const productsAPI = {
  getProducts: async (params = {}) => {
    try {
      let query = supabase.from('products').select('*');
      
      // Apply filters
      if (params.season && params.season !== 'All Seasons') {
        query = query.eq('season', params.season);
      }
      if (params.type && params.type !== 'All Types') {
        query = query.eq('category', params.type);
      }
      if (params.chroma && params.chroma !== 'All Chroma') {
        query = query.eq('chroma', params.chroma);
      }
      if (params.color && params.color !== 'All Colors') {
        query = query.eq('hue', params.color);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return { data };
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  },
  
  getProductsBySeason: async (season) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('season', season);
      
      if (error) throw error;
      return { data };
    } catch (err) {
      console.error('Error fetching products by season:', err);
      throw err;
    }
  },
  
  getRecommendedProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(12);
      
      if (error) throw error;
      return { data };
    } catch (err) {
      console.error('Error fetching recommended products:', err);
      throw err;
    }
  },
  
  getProductById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data };
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      throw err;
    }
  },
  
  saveProduct: async (id) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      // For now, just return success - you can implement saved products table later
      return { data: { success: true } };
    } catch (err) {
      console.error('Error saving product:', err);
      throw err;
    }
  },
  
  unsaveProduct: async (id) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      // For now, just return success - you can implement saved products table later
      return { data: { success: true } };
    } catch (err) {
      console.error('Error unsaving product:', err);
      throw err;
    }
  },
};

export default api;
