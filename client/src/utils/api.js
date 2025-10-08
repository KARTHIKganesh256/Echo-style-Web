import axios from 'axios';

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

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
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
