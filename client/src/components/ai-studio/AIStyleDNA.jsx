import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dna, TrendingUp, Sparkles } from 'lucide-react';
import useAIStudioStore from '@/store/useAIStudioStore';
import { seasonalPalettes } from '@/utils/aiUtils';

const AIStyleDNA = () => {
  const { styleDNA, styleHistory, updateStyleDNA } = useAIStudioStore();

  useEffect(() => {
    if (styleHistory.length > 0) {
      updateStyleDNA();
    }
  }, [styleHistory]);

  if (!styleDNA || styleHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center"
      >
        <Dna className="w-24 h-24 mx-auto mb-4 text-gray-400 opacity-50" />
        <h3 className="text-xl font-semibold text-white mb-2">No Style DNA Yet</h3>
        <p className="text-gray-400">
          Use the AI Mirror and Virtual Closet to build your unique style profile
        </p>
      </motion.div>
    );
  }

  const { traits, dominant } = styleDNA;
  const dominantPalette = seasonalPalettes[dominant];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Dna className="w-8 h-8 text-pink-400" />
          Your Style DNA
        </h2>
        <p className="text-gray-300 mt-2">
          Your unique style fingerprint based on {styleHistory.length} sessions
        </p>
      </div>

      {/* DNA Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-blue-900/50 backdrop-blur-xl rounded-3xl p-8 overflow-hidden border border-white/20"
      >
        {/* Animated Gradient Ring */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `conic-gradient(from 0deg, ${traits.map(t => 
              `${seasonalPalettes[t.season].colors[0]} ${t.percent}%`
            ).join(', ')})`
          }}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-4xl font-bold text-white mb-2">
              {dominant} Dominant
            </h3>
            <p className="text-xl text-gray-300">{dominantPalette.mood}</p>
          </div>

          {/* Trait Breakdown */}
          <div className="space-y-4 mb-8">
            {traits.map((trait, index) => (
              <motion.div
                key={trait.season}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{trait.season}</span>
                    <span className="text-white font-bold">{trait.percent}%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trait.percent}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${seasonalPalettes[trait.season].colors[0]}, ${seasonalPalettes[trait.season].colors[2]})`
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Color Palette Display */}
          <div className="bg-black/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">Your Signature Colors</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {dominantPalette.colors.map((color, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="w-16 h-16 rounded-xl shadow-lg border-2 border-white/30 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-400">{color}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Style Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-white/5 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-semibold mb-1">Your Style Personality</h4>
                <p className="text-gray-300 text-sm">
                  You're a <strong>{dominant}</strong> personality with {traits[1]?.percent || 0}%{' '}
                  <strong>{traits[1]?.season || 'balanced'}</strong> influence. This makes you{' '}
                  {dominant === 'Spring' && 'energetic, fresh, and vibrant with a love for soft, warm colors.'}
                  {dominant === 'Summer' && 'cool, calm, and soft with an elegant, muted color preference.'}
                  {dominant === 'Autumn' && 'warm, rich, and earthy with a natural, grounded aesthetic.'}
                  {dominant === 'Winter' && 'bold, dramatic, and clear with a striking, high-contrast style.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
        >
          <div className="text-3xl font-bold text-white mb-1">{styleHistory.length}</div>
          <div className="text-sm text-gray-300">Sessions</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
        >
          <div className="text-3xl font-bold text-white mb-1">{traits.length}</div>
          <div className="text-sm text-gray-300">Styles</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
        >
          <div className="text-3xl font-bold text-white mb-1">{traits[0]?.percent || 0}%</div>
          <div className="text-sm text-gray-300">Dominant</div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIStyleDNA;


