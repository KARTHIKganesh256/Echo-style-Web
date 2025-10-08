import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authAPI, productsAPI } from '../utils/api';
import useAuthStore from '../store/useAuthStore';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(user?.preferences?.theme || 'light');
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.name || user?.email?.split('@')[0] || 'User');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await authAPI.getProfile();
      updateUser(data);
      
      console.log('📊 Profile data:', data);
      console.log('💾 Saved product IDs:', data.savedProducts);
      
      // Fetch saved products
      if (data.savedProducts && data.savedProducts.length > 0) {
        const productPromises = data.savedProducts.map((id) =>
          productsAPI.getProductById(id).catch((err) => {
            console.error(`Failed to fetch product ${id}:`, err);
            return null;
          })
        );
        const productResults = await Promise.all(productPromises);
        const validProducts = productResults.filter((p) => p !== null).map((p) => p.data);
        console.log('✅ Loaded saved products:', validProducts);
        setSavedProducts(validProducts);
      } else {
        console.log('ℹ️ No saved products found');
        setSavedProducts([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await productsAPI.unsaveProduct(productId);
      setSavedProducts((prev) => prev.filter((p) => p._id !== productId));
      console.log('✅ Product removed from favorites');
    } catch (error) {
      console.error('❌ Failed to remove product:', error);
      alert('Failed to remove product. Please try again.');
    }
  };

  const handleThemeToggle = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await authAPI.updateProfile({
        preferences: { theme: newTheme },
      });
      updateUser({ preferences: { theme: newTheme } });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const handleNameUpdate = async () => {
    if (!displayName.trim()) return;
    
    try {
      await authAPI.updateProfile({
        data: { name: displayName.trim() }
      });
      setEditingName(false);
      updateUser({ user_metadata: { name: displayName.trim() } });
    } catch (error) {
      console.error('Failed to update name:', error);
      alert('Failed to update name. Please try again.');
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploadingPhoto(true);
    try {
      // Convert to base64 for demo purposes
      // In production, you'd upload to a storage service
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target.result;
          await authAPI.updateProfile({
            data: { profile_photo: base64 }
          });
          updateUser({ user_metadata: { profile_photo: base64 } });
          alert('Profile photo updated successfully!');
        } catch (error) {
          console.error('Failed to update photo:', error);
          alert('Failed to update photo. Please try again.');
        } finally {
          setUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to process photo:', error);
      alert('Failed to process photo. Please try again.');
      setUploadingPhoto(false);
    }
  };

  const seasonalPalettes = {
    Spring: ['#FFD700', '#FF6B9D', '#98D8C8', '#F7CAC9', '#FFDAB9', '#E0BBE4', '#FFE5B4', '#B0E57C'],
    Summer: ['#B4A7D6', '#AED9E0', '#D5A6BD', '#E8DFF5', '#A2B5CD', '#C7CEEA', '#B0C4DE', '#D8BFD8'],
    Autumn: ['#8B4513', '#CD853F', '#B8860B', '#A0522D', '#D2691E', '#8B7355', '#BC8F8F', '#6B4423'],
    Winter: ['#000080', '#DC143C', '#4B0082', '#2F4F4F', '#8B008B', '#191970', '#800020', '#0C0C0C'],
    Neutral: ['#F5F5DC', '#D3D3D3', '#C0C0C0', '#808080', '#696969', '#A9A9A9', '#B8B8B8', '#DCDCDC'],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white text-center mb-12 font-display"
        >
          My Profile
        </motion.h1>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {user?.user_metadata?.profile_photo ? (
                    <img
                      src={user.user_metadata.profile_photo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                </div>
                
                {/* Upload Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={uploadingPhoto}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-purple-600 transition-colors"
                >
                  {uploadingPhoto ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    '📷'
                  )}
                </motion.button>
                
                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingPhoto}
                />
              </div>
              
              {/* User Details */}
              <div>
                {editingName ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="text-3xl font-bold bg-transparent border-b-2 border-white text-white focus:outline-none"
                      autoFocus
                      onKeyPress={(e) => e.key === 'Enter' && handleNameUpdate()}
                      onBlur={handleNameUpdate}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleNameUpdate}
                      className="text-green-400 text-xl"
                    >
                      ✓
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-3xl font-bold text-white">{displayName}</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingName(true)}
                      className="text-purple-300 text-xl hover:text-white transition-colors"
                      title="Edit name"
                    >
                      ✏️
                    </motion.button>
                  </div>
                )}
                <p className="text-purple-200">{user?.email}</p>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleThemeToggle}
              className="p-4 rounded-full bg-white bg-opacity-20 text-2xl hover:bg-opacity-30 transition-all"
              title="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </motion.button>
          </div>

          {user?.skinAnalysis?.season && user.skinAnalysis.season !== '' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Your Season</h3>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold gradient-text">{user.skinAnalysis.season}</span>
                <div className="flex gap-1">
                  {seasonalPalettes[user.skinAnalysis.season]?.slice(0, 5).map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-purple-200">
                  <span className="font-semibold">Undertone:</span> {user.skinAnalysis.undertone}
                </p>
                <p className="text-purple-200">
                  <span className="font-semibold">Depth:</span> {user.skinAnalysis.depth}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Personal Palette Board */}
        {user?.skinAnalysis?.season && user.skinAnalysis.season !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 mb-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Your Color Palette</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {seasonalPalettes[user.skinAnalysis.season]?.map((color, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  className="aspect-square rounded-xl shadow-lg cursor-pointer relative group"
                  style={{ backgroundColor: color }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-mono bg-black bg-opacity-75 px-2 py-1 rounded text-white">
                      {color}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Saved Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              Saved Products ({savedProducts.length})
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchProfile}
              className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all"
            >
              🔄 Refresh
            </motion.button>
          </div>

          {savedProducts.length === 0 ? (
            <p className="text-purple-200 text-center py-12">
              No saved products yet. Start exploring and save your favorites!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white bg-opacity-10 rounded-xl overflow-hidden relative group"
                >
                  {/* Remove button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveProduct(product._id)}
                    className="absolute top-2 right-2 z-10 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from favorites"
                  >
                    ✕
                  </motion.button>
                  
                  <div className="h-40 bg-gradient-to-br from-purple-500 to-pink-500">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-white mb-2">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-white">${product.price}</p>
                      <span className="px-2 py-1 bg-purple-500 bg-opacity-30 text-purple-200 text-xs rounded-full">
                        {product.season}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Personal Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-8"
        >
          <div className="glass p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">{savedProducts.length}</div>
            <div className="text-purple-200">Saved Products</div>
          </div>
          <div className="glass p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {user?.skinAnalysis?.season || 'N/A'}
            </div>
            <div className="text-purple-200">Your Season</div>
          </div>
          <div className="glass p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {seasonalPalettes[user?.skinAnalysis?.season]?.length || 0}
            </div>
            <div className="text-purple-200">Palette Colors</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
