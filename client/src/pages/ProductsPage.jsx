import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productsAPI, authAPI } from '../utils/api';
import useAuthStore from '../store/useAuthStore';
import SkeletonCard from '../components/SkeletonCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    season: 'All',
    hue: 'All',
    productType: 'All',
    chroma: 'All',
  });
  const { user } = useAuthStore();
  const [savedProducts, setSavedProducts] = useState(new Set());

  useEffect(() => {
    fetchProducts();
    loadSavedProducts();
  }, [filters]);

  const loadSavedProducts = async () => {
    try {
      if (!user) {
        console.log('No user logged in, skipping saved products load');
        return;
      }
      
      // Try to load saved products from user metadata
      const savedProductsData = user?.user_metadata?.saved_products || [];
      if (savedProductsData.length > 0) {
        setSavedProducts(new Set(savedProductsData.map(id => id.toString())));
        console.log('✅ Loaded saved products:', savedProductsData.length);
      } else {
        console.log('No saved products found');
      }
    } catch (error) {
      console.error('Failed to load saved products:', error);
      // Don't throw - just continue without saved products
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log('Fetching products with filters:', filters);
      const { data } = await productsAPI.getProducts(filters);
      console.log('Products received:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productId) => {
    try {
      const isSaved = savedProducts.has(productId);
      
      if (isSaved) {
        // Unsave product
        await productsAPI.unsaveProduct(productId);
        setSavedProducts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        console.log('✅ Product removed from favorites');
      } else {
        // Save product
        await productsAPI.saveProduct(productId);
        setSavedProducts((prev) => new Set(prev).add(productId));
        console.log('✅ Product saved to favorites');
      }
      
      // Refresh user data to get updated saved products
      const { refreshSession } = useAuthStore.getState();
      await refreshSession();
    } catch (error) {
      console.error('❌ Failed to save/unsave product:', error);
      alert(error.response?.data?.message || 'Failed to save product. Please try again.');
    }
  };

  const seasonColors = {
    Spring: 'from-yellow-400 to-pink-400',
    Summer: 'from-purple-400 to-blue-300',
    Autumn: 'from-orange-600 to-yellow-700',
    Winter: 'from-blue-700 to-red-600',
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white text-center mb-4 font-display"
        >
          Discover Your Perfect Style
        </motion.h1>

        {user?.skinAnalysis?.season && user.skinAnalysis.season !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="glass inline-block px-6 py-3 rounded-full">
              <span className="text-white text-lg">
                Your Season: <span className="font-bold gradient-text">{user.skinAnalysis.season}</span>
              </span>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 mb-12"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">🌸 Season</label>
              <select
                value={filters.season}
                onChange={(e) => setFilters({ ...filters, season: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white focus:outline-none focus:border-purple-400"
                style={{ colorScheme: 'dark' }}
              >
                <option value="All" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>All Seasons</option>
                <option value="Spring" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>🌸 Spring</option>
                <option value="Summer" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>☀️ Summer</option>
                <option value="Autumn" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>🍂 Autumn</option>
                <option value="Winter" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>❄️ Winter</option>
                <option value="Neutral" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>⚖️ Neutral</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">🎨 Color</label>
              <select
                value={filters.hue}
                onChange={(e) => setFilters({ ...filters, hue: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white focus:outline-none focus:border-purple-400"
                style={{ colorScheme: 'dark' }}
              >
                <option value="All" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>All Colors</option>
                {['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Brown', 'Beige', 'Gray', 'Black', 'White'].map(
                  (hue) => (
                    <option key={hue} value={hue} style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>
                      {hue}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">👕 Type</label>
              <select
                value={filters.productType}
                onChange={(e) => setFilters({ ...filters, productType: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white focus:outline-none focus:border-purple-400"
                style={{ colorScheme: 'dark' }}
              >
                <option value="All" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>All Types</option>
                {['Top', 'Bottom', 'Dress', 'Outerwear', 'Accessory', 'Shoes'].map((type) => (
                  <option key={type} value={type} style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">✨ Chroma</label>
              <select
                value={filters.chroma}
                onChange={(e) => setFilters({ ...filters, chroma: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white focus:outline-none focus:border-purple-400"
                style={{ colorScheme: 'dark' }}
              >
                <option value="All" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>All Chroma</option>
                <option value="Bright" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>✨ Bright</option>
                <option value="Muted" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>🎭 Muted</option>
                <option value="Soft" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>🌸 Soft</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass overflow-hidden card-hover"
              >
                <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image_url || product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', product.image_url || product.imageUrl);
                      e.target.style.display = 'none';
                      // Show fallback content
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center text-white text-6xl';
                      fallback.textContent = '🛍️';
                      e.target.parentNode.appendChild(fallback);
                    }}
                  />
                  {/* Fallback icon if no image */}
                  {!product.image_url && !product.imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                      🛍️
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-purple-200 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
                        seasonColors[product.season] || 'from-gray-400 to-gray-600'
                      }`}
                    >
                      🌸 {product.season}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-white bg-opacity-20">
                      🎨 {product.hue}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-purple-500 bg-opacity-30">
                      👕 {product.productType}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-green-500 bg-opacity-30">
                      ✨ {product.chroma}
                    </span>
                  </div>

                  {/* Detailed Product Info */}
                  <div className="mb-4 p-3 bg-white bg-opacity-5 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-purple-200">Season:</span>
                        <span className="text-white font-semibold">{product.season}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Color:</span>
                        <span className="text-white font-semibold">{product.hue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Type:</span>
                        <span className="text-white font-semibold">{product.productType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Chroma:</span>
                        <span className="text-white font-semibold">{product.chroma}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Value:</span>
                        <span className="text-white font-semibold">{product.value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Undertone:</span>
                        <span className="text-white font-semibold">{product.undertone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">₹{product.price}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSaveProduct(product._id)}
                      className={`p-2 rounded-full ${
                        savedProducts.has(product._id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white bg-opacity-20 text-white'
                      } transition-colors`}
                    >
                      ♥
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-white mb-4">No products found. Try adjusting your filters!</p>
            <p className="text-purple-200 mb-6">
              Make sure you've set up the products database in Supabase.
            </p>
            <div className="glass p-6 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white mb-3">Quick Setup:</h3>
              <ol className="text-left text-purple-200 space-y-2">
                <li>1. Go to your Supabase dashboard</li>
                <li>2. Open SQL Editor</li>
                <li>3. Run the products table creation script</li>
                <li>4. Add sample products</li>
              </ol>
              <p className="text-sm text-purple-300 mt-4">
                Check SUPABASE_QUICK_SETUP.md for detailed instructions!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
