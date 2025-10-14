import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, RefreshCw, Download, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { seasonalPalettes, generateOutfitCombinations, rgbToHsl, isAnalogousHue, isComplementaryHue, isNeutralRGB } from '@/utils/aiUtils';
import useAIStudioStore from '@/store/useAIStudioStore';

const AIOutfitGenerator = () => {
  const [selectedSeason, setSelectedSeason] = useState('Spring');
  const [selectedMood, setSelectedMood] = useState('casual');
  const [outfits, setOutfits] = useState([]);
  const [generating, setGenerating] = useState(false);
  const { addStylePreference, closetItems } = useAIStudioStore();
  const [useCloset, setUseCloset] = useState(true);

  const moods = [
    { id: 'casual', name: 'Casual', icon: '😊' },
    { id: 'formal', name: 'Formal', icon: '👔' },
    { id: 'artistic', name: 'Artistic', icon: '🎨' },
    { id: 'energetic', name: 'Energetic', icon: '⚡' }
  ];

  const generateOutfits = () => {
    setGenerating(true);
    
    // Add to style history
    addStylePreference({ season: selectedSeason, mood: selectedMood, weight: 1 });

    setTimeout(() => {
      if (useCloset && closetItems.length > 0) {
        const shirts = closetItems.filter(i => (i.category || '').toLowerCase().includes('top'));
        const pants = closetItems.filter(i => (i.category || '').toLowerCase().includes('bottom'));
        const dresses = closetItems.filter(i => (i.category || '').toLowerCase().includes('dress'));

        const combos = [];
        // Top + Bottom
        for (const top of shirts) {
          for (const bottom of pants) {
            const h1 = rgbToHsl(top.dominantColor).h;
            const h2 = rgbToHsl(bottom.dominantColor).h;
            if (
              isNeutralRGB(top.dominantColor) ||
              isNeutralRGB(bottom.dominantColor) ||
              isAnalogousHue(h1, h2) ||
              isComplementaryHue(h1, h2)
            ) {
              combos.push({
                id: `${top.id || top.image}-${bottom.id || bottom.image}`,
                name: `${selectedSeason} Look (Closet)`,
                items: [
                  { type: 'top', color: `rgb(${top.dominantColor.r}, ${top.dominantColor.g}, ${top.dominantColor.b})`, description: top.category || 'Top' },
                  { type: 'bottom', color: `rgb(${bottom.dominantColor.r}, ${bottom.dominantColor.g}, ${bottom.dominantColor.b})`, description: bottom.category || 'Bottom' }
                ]
              });
            }
          }
        }
        // Dresses as standalone
        for (const dress of dresses) {
          combos.push({
            id: `${dress.id || dress.image}`,
            name: `${selectedSeason} Dress (Closet)`,
            items: [
              { type: 'top', color: `rgb(${dress.dominantColor.r}, ${dress.dominantColor.g}, ${dress.dominantColor.b})`, description: dress.category || 'Dress' }
            ]
          });
        }

        setOutfits(combos.slice(0, 9));
      } else {
        const generated = generateOutfitCombinations(selectedSeason, selectedMood);
        setOutfits(generated);
      }
      setGenerating(false);
    }, 600);
  };

  const ClothingSketch = ({ type, color }) => {
    const paths = {
      top: 'M20 30 L30 20 L50 20 L60 30 L60 60 L20 60 Z',
      bottom: 'M25 20 L55 20 L60 80 L50 80 L45 60 L35 60 L30 80 L20 80 Z',
      accessory: 'M30 40 Q40 30 50 40 L48 45 Q40 38 32 45 Z'
    };

    return (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <path
          d={paths[type]}
          fill={color}
          stroke="white"
          strokeWidth="1"
          className="transition-all duration-300"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Wand2 className="w-8 h-8 text-purple-400" />
          AI Outfit Generator
        </h2>
        <p className="text-gray-300 mt-2">
          Generate stylish outfit combinations based on your mood and season
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Source Toggle */}
        <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
          <span className="text-white text-sm">Use items from your Virtual Closet</span>
          <button
            onClick={() => setUseCloset(v => !v)}
            className={`px-3 py-1 rounded-md text-sm ${useCloset ? 'bg-white text-purple-900' : 'bg-white/20 text-white'}`}
          >
            {useCloset ? 'On' : 'Off'}
          </button>
        </div>
        {/* Season Selection */}
        <div>
          <label className="text-white font-semibold mb-2 block">Select Season</label>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(seasonalPalettes).map(([season, palette]) => (
              <motion.button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedSeason === season
                    ? 'bg-white text-purple-900'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {season}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Mood Selection */}
        <div>
          <label className="text-white font-semibold mb-2 block">Select Mood</label>
          <div className="flex gap-3 flex-wrap">
            {moods.map(mood => (
              <motion.button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  selectedMood === mood.id
                    ? 'bg-white text-purple-900'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl">{mood.icon}</span>
                {mood.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateOutfits}
          disabled={generating}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg w-full"
        >
          {generating ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Outfits
            </>
          )}
        </Button>
      </div>

      {/* Generated Outfits */}
      <AnimatePresence>
        {outfits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {outfits.map((outfit, index) => (
              <motion.div
                key={outfit.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-all group"
              >
                {/* Outfit Name */}
                <h3 className="text-xl font-bold text-white mb-4">{outfit.name}</h3>

                {/* Clothing Sketches */}
                <div className="space-y-4 mb-4">
                  {outfit.items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + idx * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-20 h-20 bg-black/30 rounded-lg p-2">
                        <ClothingSketch type={item.type} color={item.color} />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold capitalize">{item.type}</div>
                        <div className="text-gray-400 text-sm">{item.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-4 h-4 rounded-full border border-white/30"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs text-gray-400">{item.color}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-white/20">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/20"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {outfits.length === 0 && !generating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center"
        >
          <Wand2 className="w-24 h-24 mx-auto mb-4 text-gray-400 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">Ready to Create</h3>
          <p className="text-gray-400">
            {useCloset && closetItems.length === 0
              ? 'Your Virtual Closet is empty. Upload Tops/Bottoms/Dresses to generate outfits from your wardrobe, or toggle Off to use AI palettes.'
              : 'Select your season and mood, then click generate to see beautiful outfit combinations'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AIOutfitGenerator;


