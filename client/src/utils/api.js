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
    try {
      // First check if there's an active session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Auth session missing!');
      }
      
      if (!session) {
        console.warn('No active session found');
        throw new Error('Auth session missing!');
      }
      
      // Get user data
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw new Error(error.message);
      
      return { data: user };
    } catch (err) {
      console.error('getProfile error:', err);
      throw err;
    }
  },
  
  updateProfile: async (userData) => {
    const { data, error } = await supabase.auth.updateUser(userData);
    if (error) throw new Error(error.message);
    return { data: data.user };
  },
};

// Analysis API - Client-side analysis
export const analysisAPI = {
  analyzeTone: async (data) => {
    console.log('🔍 Analyzing skin tone:', data);
    
    // Client-side skin tone analysis logic
    const { undertone, depth } = data;
    
    // Determine season based on undertone and depth
    let season = '';
    let palette = {};
    
    if (undertone === 'Warm') {
      if (depth === 'Fair' || depth === 'Light') {
        season = 'Spring';
        palette = {
          primary: '#FFB347',
          secondary: '#FF6B6B',
          tertiary: '#4ECDC4',
          quaternary: '#45B7D1',
          characteristics: ['Fresh', 'Light', 'Warm', 'Bright']
        };
      } else if (depth === 'Medium' || depth === 'Olive') {
        season = 'Autumn';
        palette = {
          primary: '#D2691E',
          secondary: '#CD853F',
          tertiary: '#8B4513',
          quaternary: '#A0522D',
          characteristics: ['Warm', 'Rich', 'Deep', 'Earthy']
        };
      } else {
        season = 'Autumn';
        palette = {
          primary: '#8B4513',
          secondary: '#A0522D',
          tertiary: '#CD853F',
          quaternary: '#D2691E',
          characteristics: ['Deep', 'Rich', 'Warm', 'Earthy']
        };
      }
    } else if (undertone === 'Cool') {
      if (depth === 'Fair' || depth === 'Light') {
        season = 'Summer';
        palette = {
          primary: '#87CEEB',
          secondary: '#DDA0DD',
          tertiary: '#F0E68C',
          quaternary: '#FFB6C1',
          characteristics: ['Cool', 'Soft', 'Light', 'Muted']
        };
      } else if (depth === 'Medium' || depth === 'Olive') {
        season = 'Winter';
        palette = {
          primary: '#4169E1',
          secondary: '#8A2BE2',
          tertiary: '#DC143C',
          quaternary: '#000080',
          characteristics: ['Cool', 'Deep', 'Bright', 'Clear']
        };
      } else {
        season = 'Winter';
        palette = {
          primary: '#000080',
          secondary: '#DC143C',
          tertiary: '#8A2BE2',
          quaternary: '#4169E1',
          characteristics: ['Deep', 'Cool', 'Bright', 'Clear']
        };
      }
    } else {
      // Neutral undertone
      season = 'Neutral';
      palette = {
        primary: '#808080',
        secondary: '#A9A9A9',
        tertiary: '#D3D3D3',
        quaternary: '#F5F5F5',
        characteristics: ['Balanced', 'Versatile', 'Universal', 'Adaptable']
      };
    }
    
    const result = {
      season,
      undertone,
      depth,
      palette: {
        ...palette,
        colors: [palette.primary, palette.secondary, palette.tertiary, palette.quaternary],
        description: `Your ${season} palette features ${palette.characteristics.join(', ').toLowerCase()} colors that complement your ${undertone.toLowerCase()} undertone and ${depth.toLowerCase()} skin depth.`
      },
      confidence: 0.85,
      recommendations: [
        `Your ${season} palette works best with ${palette.characteristics.join(', ').toLowerCase()} colors`,
        `Avoid colors that clash with your ${undertone.toLowerCase()} undertone`,
        `Focus on ${season.toLowerCase()} season colors for the most flattering look`
      ]
    };
    
    console.log('✅ Analysis result:', result);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { data: result };
  },
  
  getSeasonPalette: (season) => {
    const palettes = {
      Spring: {
        primary: '#FFB347',
        secondary: '#FF6B6B',
        tertiary: '#4ECDC4',
        quaternary: '#45B7D1',
        characteristics: ['Fresh', 'Light', 'Warm', 'Bright']
      },
      Summer: {
        primary: '#87CEEB',
        secondary: '#DDA0DD',
        tertiary: '#F0E68C',
        quaternary: '#FFB6C1',
        characteristics: ['Cool', 'Soft', 'Light', 'Muted']
      },
      Autumn: {
        primary: '#D2691E',
        secondary: '#CD853F',
        tertiary: '#8B4513',
        quaternary: '#A0522D',
        characteristics: ['Warm', 'Rich', 'Deep', 'Earthy']
      },
      Winter: {
        primary: '#4169E1',
        secondary: '#8A2BE2',
        tertiary: '#DC143C',
        quaternary: '#000080',
        characteristics: ['Cool', 'Deep', 'Bright', 'Clear']
      },
      Neutral: {
        primary: '#808080',
        secondary: '#A9A9A9',
        tertiary: '#D3D3D3',
        quaternary: '#F5F5F5',
        characteristics: ['Balanced', 'Versatile', 'Universal', 'Adaptable']
      }
    };
    
    return { data: palettes[season] || palettes.Neutral };
  }
};

// Products API - Using Supabase
export const productsAPI = {
  getProducts: async (params = {}) => {
    try {
      console.log('🔍 Fetching products with params:', params);
      console.log('🔗 Supabase URL:', supabase.supabaseUrl);
      
      let query = supabase.from('products').select('*');
      
      // Apply filters
      if (params.season && params.season !== 'All Seasons' && params.season !== 'All') {
        query = query.eq('season', params.season);
        console.log('🔍 Filtering by season:', params.season);
      }
      if (params.productType && params.productType !== 'All Types' && params.productType !== 'All') {
        query = query.eq('category', params.productType);
        console.log('🔍 Filtering by type:', params.productType);
      }
      if (params.chroma && params.chroma !== 'All Chroma' && params.chroma !== 'All') {
        query = query.eq('chroma', params.chroma);
        console.log('🔍 Filtering by chroma:', params.chroma);
      }
      if (params.hue && params.hue !== 'All Colors' && params.hue !== 'All') {
        query = query.eq('hue', params.hue);
        console.log('🔍 Filtering by hue:', params.hue);
      }
      
      console.log('🔍 Executing query...');
      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Products fetched successfully:', data?.length || 0, 'items');
      console.log('📦 Sample product:', data?.[0]);
      
      // Log image URLs to debug
      data?.forEach((product, index) => {
        console.log(`🖼️ Product ${index + 1} image URL:`, product.image_url);
      });
      
      return { data: data || [] };
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      console.error('❌ Error details:', {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code
      });
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Get current saved products from user metadata
      const currentSaved = user.user_metadata?.saved_products || [];
      
      // Add new product if not already saved
      if (!currentSaved.includes(id)) {
        const updatedSaved = [...currentSaved, id];
        
        // Update user metadata
        const { error } = await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            saved_products: updatedSaved
          }
        });
        
        if (error) throw error;
        console.log('✅ Product saved to user metadata');
      }
      
      return { data: { success: true } };
    } catch (err) {
      console.error('Error saving product:', err);
      throw err;
    }
  },
  
  unsaveProduct: async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Get current saved products from user metadata
      const currentSaved = user.user_metadata?.saved_products || [];
      
      // Remove product
      const updatedSaved = currentSaved.filter(productId => productId !== id);
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          saved_products: updatedSaved
        }
      });
      
      if (error) throw error;
      console.log('✅ Product removed from user metadata');
      
      return { data: { success: true } };
    } catch (err) {
      console.error('Error unsaving product:', err);
      throw err;
    }
  },
};

export default api;
