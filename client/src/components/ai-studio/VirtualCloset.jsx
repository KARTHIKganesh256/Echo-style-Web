import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Shirt, Sparkles, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAIStudioStore from '@/store/useAIStudioStore';
import { extractDominantColor, findClosestPalette, seasonalPalettes } from '@/utils/aiUtils';

const VirtualCloset = () => {
  const { closetItems, addClosetItem, deleteClosetItem, updateClosetItem } = useAIStudioStore();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleOpenFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;

      // Read file as data URL and wait for load
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      // Load image element and wait for decode
      const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Invalid image'));
        image.src = dataUrl;
      });

      // Analyze with canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const dominantColor = extractDominantColor(imageData);
      const season = findClosestPalette(dominantColor);

      addClosetItem({
        // Do not store image in persisted storage; only keep transiently in memory via URL
        image: dataUrl.length > 512000 ? URL.createObjectURL(file) : dataUrl,
        dominantColor,
        season,
        category: 'Uncategorized'
      });
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getCategoryIcon = (category) => {
    return <Shirt className="w-5 h-5" />;
  };

  const getSuggestions = (item) => {
    const matchingItems = closetItems.filter(
      i => i.id !== item.id && i.season === item.season
    );
    return matchingItems.slice(0, 3);
  };

  const setCategory = (id, category) => {
    updateClosetItem(id, { category });
  };

  const topCount = closetItems.filter(i => (i.category || '').toLowerCase().includes('top')).length;
  const bottomCount = closetItems.filter(i => (i.category || '').toLowerCase().includes('bottom')).length;
  const dressCount = closetItems.filter(i => (i.category || '').toLowerCase().includes('dress')).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Shirt className="w-8 h-8 text-blue-400" />
            Virtual Closet
          </h2>
          <p className="text-gray-300 mt-2">
            Upload your clothes and get AI-powered style combinations
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button onClick={handleOpenFilePicker} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-6 text-lg cursor-pointer">
            <Upload className="w-5 h-5 mr-2" />
            Upload Clothes
          </Button>
        </div>
      </div>

      {uploading && (
        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 text-blue-200">
          Analyzing your clothes...
        </div>
      )}

      {/* Categorization helper */}
      {closetItems.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-gray-300">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-white font-semibold">Categories ready:</span>
            <span className="px-2 py-1 rounded bg-white/10">Tops: {topCount}</span>
            <span className="px-2 py-1 rounded bg-white/10">Bottoms: {bottomCount}</span>
            <span className="px-2 py-1 rounded bg-white/10">Dresses: {dressCount}</span>
            <span className="opacity-80">Tip: Tag each item as Top / Bottom / Dress for outfit generation.</span>
          </div>
        </div>
      )}

      {closetItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center"
        >
          <Shirt className="w-24 h-24 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">Your closet is empty</h3>
          <p className="text-gray-400">Upload photos of your clothes to get started</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {closetItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/15 transition-all group"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt="Closet item"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button
                    onClick={() => deleteClosetItem(item.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  {/* Dominant Color & Season */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                        style={{
                          backgroundColor: `rgb(${item.dominantColor.r}, ${item.dominantColor.g}, ${item.dominantColor.b})`
                        }}
                      />
                      <span className="text-white font-semibold">{item.season}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/80 px-2 py-1 rounded bg-white/10 border border-white/10">
                        {(item.category || 'Uncategorized')}
                      </span>
                      {getCategoryIcon(item.category)}
                    </div>
                  </div>

                  {/* Category selector */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCategory(item.id, 'Top')}
                      className={`px-3 py-1 rounded text-xs border ${
                        (item.category || '').toLowerCase() === 'top'
                          ? 'bg-white text-purple-900 border-white'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      Top
                    </button>
                    <button
                      onClick={() => setCategory(item.id, 'Bottom')}
                      className={`px-3 py-1 rounded text-xs border ${
                        (item.category || '').toLowerCase() === 'bottom'
                          ? 'bg-white text-purple-900 border-white'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      Bottom
                    </button>
                    <button
                      onClick={() => setCategory(item.id, 'Dress')}
                      className={`px-3 py-1 rounded text-xs border ${
                        (item.category || '').toLowerCase() === 'dress'
                          ? 'bg-white text-purple-900 border-white'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      Dress
                    </button>
                  </div>

                  {/* AI Suggestions */}
                  {getSuggestions(item).length > 0 && (
                    <div className="pt-3 border-t border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">Pairs well with:</span>
                      </div>
                      <div className="flex gap-2">
                        {getSuggestions(item).map(suggestion => (
                          <div
                            key={suggestion.id}
                            className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30"
                          >
                            <img
                              src={suggestion.image}
                              alt="Suggestion"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Style Tip */}
      {closetItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-start gap-4">
            <Palette className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white font-semibold mb-2">AI Style Tip</h4>
              <p className="text-gray-300 text-sm">
                Your closet has <strong>{closetItems.length}</strong> items. Try mixing{' '}
                {closetItems.filter(i => i.season === 'Spring').length > 0 && 'Spring'}{' '}
                colors with neutral tones for a balanced look!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VirtualCloset;


