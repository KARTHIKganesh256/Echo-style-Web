import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analysisAPI, authAPI } from '../utils/api';
import useAuthStore from '../store/useAuthStore';
import useSeasonStore from '../store/useSeasonStore';

const AnalyzePage = () => {
  const [step, setStep] = useState(1);
  const [undertone, setUndertone] = useState('');
  const [depth, setDepth] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuthStore();
  const { setSeason } = useSeasonStore();

  const handleAnalyze = async () => {
    console.log('🔍 Starting analysis with:', { undertone, depth });
    
    if (!undertone || !depth) {
      console.error('❌ Missing data:', { undertone, depth });
      alert('Please complete both steps before getting results.');
      return;
    }
    
    setLoading(true);
    try {
      console.log('📡 Calling analysisAPI...');
      const response = await analysisAPI.analyzeTone({ undertone, depth });
      console.log('✅ Analysis complete:', response);
      
      if (!response || !response.data) {
        throw new Error('No data received from analysis');
      }
      
      console.log('💾 Setting result state...');
      setResult(response.data);
      
      console.log('🎨 Setting season store...');
      setSeason(response.data.season, response.data);
      
      // Update user profile
      console.log('💾 Updating user profile...');
      try {
        await authAPI.updateProfile({
          data: {
            skinAnalysis: {
              undertone: response.data.undertone,
              depth: response.data.depth,
              season: response.data.season,
            },
          },
        });
        console.log('✅ Profile updated successfully');
      } catch (profileError) {
        console.warn('⚠️ Profile update failed (non-critical):', profileError);
      }
      
      updateUser({
        skinAnalysis: {
          undertone: response.data.undertone,
          depth: response.data.depth,
          season: response.data.season,
        },
      });
      
      console.log('🎉 Analysis and profile update complete!');
      console.log('📊 Current result state:', response.data);
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        undertone,
        depth
      });
      alert(`Analysis failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const depthOptions = ['Fair', 'Light', 'Medium', 'Olive', 'Deep', 'Ebony'];

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white text-center mb-12 font-display"
        >
          Discover Your Season
        </motion.h1>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="glass p-8 md:p-12"
            >
              {step === 1 && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-8">Step 1: Undertone Test</h2>
                  
                  <div className="space-y-6 mb-8">
                    <div className="glass-dark p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-white mb-4">Vein Test</h3>
                      <p className="text-purple-200 mb-4">
                        Look at the veins on your wrist in natural light:
                      </p>
                      <ul className="list-disc list-inside text-purple-200 space-y-2">
                        <li>Green veins = Warm undertone</li>
                        <li>Blue/Purple veins = Cool undertone</li>
                        <li>Can't tell or both = Neutral undertone</li>
                      </ul>
                    </div>

                    <div className="glass-dark p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-white mb-4">Jewelry Test</h3>
                      <p className="text-purple-200 mb-4">
                        Which jewelry looks better on you?
                      </p>
                      <ul className="list-disc list-inside text-purple-200 space-y-2">
                        <li>Gold jewelry = Warm undertone</li>
                        <li>Silver jewelry = Cool undertone</li>
                        <li>Both look good = Neutral undertone</li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Warm', 'Cool', 'Neutral'].map((option) => (
                      <motion.button
                        key={option}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setUndertone(option);
                          setStep(2);
                        }}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          undertone === option
                            ? 'bg-white bg-opacity-20 border-white'
                            : 'bg-white bg-opacity-5 border-white border-opacity-20 hover:border-opacity-50'
                        }`}
                      >
                        <span className="text-2xl font-bold text-white">{option}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setStep(1)}
                    className="text-purple-200 hover:text-white mb-6 flex items-center gap-2"
                  >
                    ← Back
                  </motion.button>

                  <h2 className="text-3xl font-bold text-white mb-8">Step 2: Skin Depth</h2>
                  
                  <p className="text-purple-200 mb-8">
                    Select the option that best describes your natural skin tone:
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {depthOptions.map((option, index) => (
                      <motion.button
                        key={option}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDepth(option)}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          depth === option
                            ? 'bg-white bg-opacity-20 border-white'
                            : 'bg-white bg-opacity-5 border-white border-opacity-20 hover:border-opacity-50'
                        }`}
                      >
                        <span className="text-xl font-bold text-white">{option}</span>
                      </motion.button>
                    ))}
                  </div>

                  {depth && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="mb-4 p-4 bg-white bg-opacity-10 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">Your Selections:</h4>
                        <div className="flex gap-4 text-purple-200">
                          <span>Undertone: <span className="text-white font-bold">{undertone || 'Not selected'}</span></span>
                          <span>Depth: <span className="text-white font-bold">{depth}</span></span>
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                          <div className="mt-2 text-xs text-purple-300">
                            Debug: Result={result ? 'Set' : 'Null'}, Loading={loading ? 'Yes' : 'No'}
                          </div>
                        )}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAnalyze}
                        disabled={loading || !undertone || !depth}
                        className="w-full btn-primary bg-white text-purple-600 btn-glow text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Analyzing...' : 'Get My Results'}
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="glass p-8 md:p-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="text-center mb-12"
              >
                <h2 className="text-6xl font-bold text-white mb-4 font-display">
                  You are a <span className="gradient-text">{result.season}</span>!
                </h2>
                <p className="text-xl text-purple-200">
                  {result.palette.description}
                </p>
              </motion.div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Your Color Palette</h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {result.palette.colors.map((color, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className="aspect-square rounded-lg shadow-lg cursor-pointer"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Characteristics</h3>
                <div className="flex flex-wrap gap-3">
                  {result.palette.characteristics.map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-white font-semibold"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => window.location.href = '/products'}
                className="w-full btn-primary bg-white text-purple-600 btn-glow text-xl"
              >
                Shop My Palette
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalyzePage;
