import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Trash2, Plus, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAIStudioStore from '@/store/useAIStudioStore';
import { seasonalPalettes } from '@/utils/aiUtils';
import SmartCursor from './SmartCursor';

const PaletteMemoryWall = () => {
  const { paletteMemories, savePaletteMemory, deletePaletteMemory, updatePaletteMemory } = useAIStudioStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('Spring');
  const [copiedId, setCopiedId] = useState(null);
  const [activePalette, setActivePalette] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                     window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    window.addEventListener('storage', checkDarkMode);
    
    return () => window.removeEventListener('storage', checkDarkMode);
  }, []);

  const createPalette = () => {
    if (!newPaletteName.trim()) return;

    savePaletteMemory({
      name: newPaletteName,
      season: selectedSeason,
      colors: seasonalPalettes[selectedSeason].colors,
      mood: seasonalPalettes[selectedSeason].mood
    });

    setNewPaletteName('');
    setShowCreateModal(false);
  };

  const sharePalette = (palette) => {
    const shareUrl = `${window.location.origin}/palette/${palette.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(palette.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (palette) => {
    updatePaletteMemory(palette.id, { favorite: !palette.favorite });
  };

  return (
    <div className="space-y-6 relative" style={{ cursor: 'none' }}>
      {/* Smart AI Cursor */}
      <SmartCursor activePalette={activePalette} isDark={isDarkMode} />
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-400" />
            Palette Memory Wall
          </h2>
          <p className="text-gray-300 mt-2">
            Save and share your favorite color palettes
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-6 text-lg interactive cursor-pointer"
          data-color="#ec4899"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Palette
        </Button>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Create New Palette</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">Palette Name</label>
                  <input
                    type="text"
                    value={newPaletteName}
                    onChange={(e) => setNewPaletteName(e.target.value)}
                    placeholder="e.g., My festival look"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-white font-semibold mb-2 block">Base Season</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(seasonalPalettes).map(season => (
                      <button
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all interactive cursor-pointer ${
                          selectedSeason === season
                            ? 'bg-white text-purple-900'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                        data-color={seasonalPalettes[season].colors[0]}
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={createPalette}
                    className="flex-1 bg-white hover:bg-gray-100 text-purple-900"
                  >
                    Create
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Wall */}
      {paletteMemories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center"
        >
          <Heart className="w-24 h-24 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No Palettes Yet</h3>
          <p className="text-gray-400">Create your first palette memory to get started</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {paletteMemories.map((palette, index) => (
              <motion.div
                key={palette.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                onMouseEnter={() => setActivePalette(palette)}
                onMouseLeave={() => setActivePalette(null)}
                className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden group relative palette-card interactive cursor-pointer"
                data-color={palette.colors[0]}
              >
                {/* Favorite Badge */}
                {palette.favorite && (
                  <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" />
                    Favorite
                  </div>
                )}

                {/* Color Display */}
                <div className="h-48 relative overflow-hidden">
                  <motion.div
                    className="h-full w-full"
                    style={{
                      background: `linear-gradient(135deg, ${palette.colors.join(', ')})`
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Sparkle Effect */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <Sparkles className="w-16 h-16 text-white opacity-50" />
                  </motion.div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">{palette.name}</h3>
                    <p className="text-gray-300 text-sm">{palette.season} - {palette.mood}</p>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex gap-2">
                    {palette.colors.slice(0, 6).map((color, idx) => (
                      <motion.div
                        key={idx}
                        className="w-8 h-8 rounded-lg border-2 border-white/30 interactive cursor-pointer"
                        style={{ backgroundColor: color }}
                        data-color={color}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                        onMouseEnter={() => setActivePalette({ ...palette, colors: [color] })}
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => toggleFavorite(palette)}
                      variant="outline"
                      className={`flex-1 interactive cursor-pointer ${
                        palette.favorite
                          ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500 text-red-300'
                          : 'bg-white/5 hover:bg-white/10 border-white/20 text-white'
                      }`}
                      data-color={palette.favorite ? '#ef4444' : palette.colors[0]}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${palette.favorite ? 'fill-current' : ''}`} />
                      {palette.favorite ? 'Favorited' : 'Favorite'}
                    </Button>
                    
                    <Button
                      onClick={() => sharePalette(palette)}
                      variant="outline"
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/20 interactive cursor-pointer"
                      data-color={palette.colors[1] || palette.colors[0]}
                    >
                      {copiedId === palette.id ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => deletePaletteMemory(palette.id)}
                      variant="outline"
                      className="bg-white/5 hover:bg-red-500/20 text-white border-white/20 hover:border-red-500 interactive cursor-pointer"
                      data-color="#ef4444"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Stats */}
      {paletteMemories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold mb-1">Memory Wall Stats</h4>
              <p className="text-gray-300 text-sm">
                You've saved {paletteMemories.length} palette{paletteMemories.length !== 1 ? 's' : ''} •{' '}
                {paletteMemories.filter(p => p.favorite).length} favorite{paletteMemories.filter(p => p.favorite).length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-white">{paletteMemories.length}</div>
                <div className="text-xs text-gray-300">Total</div>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-white">{paletteMemories.filter(p => p.favorite).length}</div>
                <div className="text-xs text-gray-300">Favorites</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PaletteMemoryWall;


