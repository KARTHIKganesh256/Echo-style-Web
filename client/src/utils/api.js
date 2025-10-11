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

// Skin Care API - Using Supabase (stored in user metadata)
export const skinCareAPI = {
  // Analyze and save skin care data
  analyzeSkinCare: async (formData) => {
    try {
      console.log('🔍 Analyzing skin care data...');
      
      // Check if we have a current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error: ' + sessionError.message);
      }
      
      if (!session || !session.user) {
        console.error('No active session found');
        throw new Error('Not authenticated - please log in again');
      }
      
      const user = session.user;
      console.log('✅ User authenticated:', user.email);
      
      // Test Supabase connection
      console.log('🔍 Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase.from('products').select('count').limit(1);
      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error('Database connection error: ' + testError.message);
      }
      console.log('✅ Supabase connection verified');
      
      // Generate analysis based on form data
      const analysis = generateSkinCareAnalysis(formData);
      
      // Create skin care analysis object
      const skinCareAnalysis = {
        ...formData,
        analysis,
        completedAt: new Date().toISOString()
      };
      
      // Try to save to user metadata first
      console.log('🔍 Saving analysis to user metadata...');
      try {
        const { error } = await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            skin_care_analysis: skinCareAnalysis
          }
        });
        
        if (error) {
          console.error('Error saving to user metadata:', error);
          // Fallback: store in localStorage
          console.log('🔍 Falling back to localStorage...');
          localStorage.setItem('skin_care_analysis', JSON.stringify(skinCareAnalysis));
          console.log('✅ Skin care analysis saved to localStorage');
        } else {
          console.log('✅ Skin care analysis saved to user metadata successfully');
        }
      } catch (metadataError) {
        console.error('Metadata update failed, using localStorage:', metadataError);
        localStorage.setItem('skin_care_analysis', JSON.stringify(skinCareAnalysis));
        console.log('✅ Skin care analysis saved to localStorage');
      }
      
      return { data: { analysis: skinCareAnalysis } };
    } catch (err) {
      console.error('❌ Error analyzing skin care:', err);
      throw err;
    }
  },
  
  // Get existing skin care analysis
  getSkinCareAnalysis: async () => {
    try {
      console.log('🔍 Fetching skin care analysis...');
      
      // Check if we have a current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error: ' + sessionError.message);
      }
      
      if (!session || !session.user) {
        console.error('No active session found');
        throw new Error('Not authenticated - please log in again');
      }
      
      const user = session.user;
      console.log('✅ User authenticated:', user.email);
      
      // Try to get from user metadata first
      let skinCareAnalysis = user.user_metadata?.skin_care_analysis;
      
      // Fallback to localStorage if not found in metadata
      if (!skinCareAnalysis) {
        console.log('🔍 Checking localStorage for analysis...');
        const localAnalysis = localStorage.getItem('skin_care_analysis');
        if (localAnalysis) {
          try {
            skinCareAnalysis = JSON.parse(localAnalysis);
            console.log('✅ Skin care analysis retrieved from localStorage');
          } catch (parseError) {
            console.error('Error parsing localStorage data:', parseError);
          }
        }
      } else {
        console.log('✅ Skin care analysis retrieved from user metadata');
      }
      
      if (!skinCareAnalysis) {
        console.log('No skin care analysis found');
        return { data: null };
      }
      
      return { data: skinCareAnalysis };
    } catch (err) {
      console.error('❌ Error fetching skin care analysis:', err);
      throw err;
    }
  },
  
  // Delete skin care analysis
  deleteSkinCareAnalysis: async () => {
    try {
      // Check if we have a current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error: ' + sessionError.message);
      }
      
      if (!session || !session.user) {
        console.error('No active session found');
        throw new Error('Not authenticated - please log in again');
      }
      
      const user = session.user;
      
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          skin_care_analysis: null
        }
      });
      
      if (error) throw error;
      console.log('✅ Skin care analysis deleted');
      
      return { data: { success: true } };
    } catch (err) {
      console.error('❌ Error deleting skin care analysis:', err);
      throw err;
    }
  }
};

// Helper function to generate skin care analysis
const generateSkinCareAnalysis = (data) => {
  const { basicInfo, skinType, skinConcerns, lifestyle } = data;
  
  // Determine primary concerns (limit to top 2-3)
  const primaryConcerns = skinConcerns.mainConcerns.slice(0, 3);
  
  // Generate routines based on skin type and concerns
  const routines = generateRoutines(skinType.type, skinConcerns.mainConcerns, lifestyle);
  
  // Generate ingredients recommendations
  const ingredients = generateIngredientRecommendations(skinType.type, skinConcerns.mainConcerns, skinConcerns.allergies);
  
  // Generate lifestyle tips
  const lifestyleTips = generateLifestyleTips(lifestyle);
  
  return {
    skinProfile: {
      skinType: skinType.type,
      primaryConcerns,
      keyFactors: {
        age: basicInfo.ageRange,
        sunExposure: lifestyle.sunExposure,
        stressLevel: lifestyle.stressLevel,
        sleepQuality: lifestyle.sleepQuality
      }
    },
    morningRoutine: routines.morning,
    eveningRoutine: routines.evening,
    beneficialIngredients: ingredients.beneficial,
    ingredientsToAvoid: ingredients.avoid,
    weeklyTreatments: routines.weekly,
    lifestyleTips
  };
};

// Generate skincare routines
const generateRoutines = (skinType, concerns, lifestyle) => {
  const routines = {
    morning: [],
    evening: [],
    weekly: []
  };
  
  // Base routine based on skin type
  switch (skinType) {
    case 'Dry':
      routines.morning = [
        'Creamy, hydrating cleanser',
        'Hyaluronic acid serum',
        'Rich moisturizer with ceramides',
        'Hydrating SPF 30+'
      ];
      routines.evening = [
        'Gentle milk cleanser',
        'Peptide or vitamin E serum',
        'Occlusive moisturizer or face oil',
        'Overnight sleeping mask 2x/week'
      ];
      break;
    
    case 'Oily':
      routines.morning = [
        'Foaming gel cleanser',
        'Niacinamide serum',
        'Lightweight, oil-free moisturizer',
        'Mattifying SPF 30+'
      ];
      routines.evening = [
        'Salicylic acid cleanser',
        'Retinol serum (start with low %)',
        'Light moisturizer or gel',
        'Clay mask 1-2x/week'
      ];
      break;
    
    case 'Combination':
      routines.morning = [
        'Gentle gel cleanser',
        'Hyaluronic acid serum',
        'Light moisturizer (heavier on dry areas)',
        'Broad spectrum SPF 30+'
      ];
      routines.evening = [
        'Double cleanse (oil + gentle cleanser)',
        'Vitamin C serum',
        'Balanced moisturizer',
        'Spot treatment for oily areas'
      ];
      break;
    
    case 'Sensitive':
      routines.morning = [
        'Hypoallergenic cream cleanser',
        'Soothing serum (chamomile/aloe)',
        'Fragrance-free moisturizer',
        'Mineral SPF 30+'
      ];
      routines.evening = [
        'Gentle, fragrance-free cleanser',
        'Calming serum',
        'Barrier repair moisturizer',
        'Cool compress for redness'
      ];
      break;
    
    case 'Normal':
      routines.morning = [
        'Gentle cream or gel cleanser',
        'Antioxidant serum (vitamin C)',
        'Light moisturizer',
        'Broad spectrum SPF 30+'
      ];
      routines.evening = [
        'Gentle cleanser',
        'Retinol or peptide serum',
        'Moisturizer with ceramides',
        'Weekly exfoliant'
      ];
      break;
  }
  
  // Add treatments based on concerns
  if (concerns.includes('Acne/Breakouts')) {
    routines.weekly.push('Salicylic acid treatment 2-3x/week');
  }
  if (concerns.includes('Fine lines/Wrinkles')) {
    routines.weekly.push('Retinol treatment 2-3x/week');
  }
  if (concerns.includes('Dullness')) {
    routines.weekly.push('Gentle exfoliant 1-2x/week');
  }
  if (concerns.includes('Dark spots/Hyperpigmentation')) {
    routines.weekly.push('Vitamin C treatment daily');
  }
  
  // Add lifestyle-based treatments
  if (lifestyle.stressLevel === 'High' || lifestyle.stressLevel === 'Very High') {
    routines.weekly.push('Relaxing face mask with calming ingredients');
  }
  if (lifestyle.sleepQuality === 'Poor' || lifestyle.sleepQuality === 'Fair') {
    routines.evening.push('Overnight repair treatment');
  }
  
  return routines;
};

// Generate ingredient recommendations
const generateIngredientRecommendations = (skinType, concerns, allergies) => {
  const ingredients = {
    beneficial: [],
    avoid: []
  };
  
  // Base beneficial ingredients by skin type
  switch (skinType) {
    case 'Dry':
      ingredients.beneficial = ['Hyaluronic Acid', 'Ceramides', 'Glycerin', 'Squalane', 'Shea Butter'];
      ingredients.avoid = ['Alcohol', 'Strong fragrances', 'Harsh sulfates', 'Retinol (high %)'];
      break;
    
    case 'Oily':
      ingredients.beneficial = ['Niacinamide', 'Salicylic Acid', 'Tea Tree Oil', 'Clay', 'Witch Hazel'];
      ingredients.avoid = ['Heavy oils', 'Comedogenic ingredients', 'Thick creams'];
      break;
    
    case 'Combination':
      ingredients.beneficial = ['Hyaluronic Acid', 'Niacinamide', 'Vitamin C', 'Ceramides'];
      ingredients.avoid = ['Heavy oils on T-zone', 'Over-drying ingredients'];
      break;
    
    case 'Sensitive':
      ingredients.beneficial = ['Aloe Vera', 'Chamomile', 'Oatmeal', 'Hyaluronic Acid', 'Ceramides'];
      ingredients.avoid = ['Fragrances', 'Alcohol', 'Harsh acids', 'Essential oils'];
      break;
    
    case 'Normal':
      ingredients.beneficial = ['Vitamin C', 'Retinol', 'Hyaluronic Acid', 'Peptides', 'Antioxidants'];
      ingredients.avoid = ['Over-exfoliation', 'Too many active ingredients'];
      break;
  }
  
  // Add concern-specific ingredients
  if (concerns.includes('Acne/Breakouts')) {
    ingredients.beneficial.push('Benzoyl Peroxide', 'Azelaic Acid');
  }
  if (concerns.includes('Fine lines/Wrinkles')) {
    ingredients.beneficial.push('Retinol', 'Peptides', 'Vitamin C');
  }
  if (concerns.includes('Dark spots/Hyperpigmentation')) {
    ingredients.beneficial.push('Vitamin C', 'Arbutin', 'Kojic Acid');
  }
  if (concerns.includes('Dullness')) {
    ingredients.beneficial.push('Glycolic Acid', 'Vitamin C', 'Niacinamide');
  }
  
  // Remove duplicates
  ingredients.beneficial = [...new Set(ingredients.beneficial)];
  
  // Remove ingredients based on allergies
  if (allergies !== 'None known') {
    ingredients.avoid.push(allergies);
    ingredients.beneficial = ingredients.beneficial.filter(ingredient => 
      !ingredient.toLowerCase().includes(allergies.toLowerCase())
    );
  }
  
  return ingredients;
};

// Generate lifestyle tips
const generateLifestyleTips = (lifestyle) => {
  const tips = [];
  
  if (lifestyle.stressLevel === 'High' || lifestyle.stressLevel === 'Very High') {
    tips.push('Incorporate stress-reduction techniques - meditation, yoga, or deep breathing');
  }
  
  if (lifestyle.sleepQuality === 'Poor' || lifestyle.sleepQuality === 'Fair') {
    tips.push('Aim for 7-9 hours of quality sleep - skin repairs itself during sleep');
  }
  
  if (lifestyle.sunExposure.includes('High')) {
    tips.push('Reapply sunscreen every 2 hours when outdoors');
  }
  
  if (lifestyle.exerciseFrequency === 'Daily' || lifestyle.exerciseFrequency === '3-4 times per week') {
    tips.push('Cleanse skin immediately after exercise to prevent breakouts');
  }
  
  // General tips
  tips.push('Stay hydrated - drink at least 8 glasses of water daily');
  tips.push('Eat a balanced diet rich in antioxidants and omega-3 fatty acids');
  
  return tips;
};

export default api;
