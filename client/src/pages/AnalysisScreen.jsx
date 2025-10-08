import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const AnalysisScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, fileName } = location.state || {};
  const [showResults, setShowResults] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveTags, setSaveTags] = useState('');

  useEffect(() => {
    if (!image) {
      navigate('/upload');
      return;
    }
    
    // Trigger results animation
    setTimeout(() => setShowResults(true), 500);
    
    // Auto-save to history when analysis loads
    autoSaveToHistory();
  }, [image, navigate]);

  const autoSaveToHistory = () => {
    if (!image || !analysisData) return;

    // Generate a default name based on date and season
    const defaultName = `${analysisData.seasonMatch || 'Style'} Look - ${new Date().toLocaleDateString()}`;
    
    // Generate default tags based on analysis
    const defaultTags = [
      analysisData.seasonMatch?.toLowerCase(),
      analysisData.detectedStyle?.toLowerCase(),
      analysisData.mood?.toLowerCase(),
      'auto-saved'
    ].filter(Boolean);

    // Save to local storage
    const history = JSON.parse(localStorage.getItem('photoHistory') || '[]');
    
    // Check if this exact analysis already exists (prevent duplicates)
    const existingIndex = history.findIndex(item => 
      item.image === image && 
      item.analysisData.overallScore === analysisData.overallScore
    );
    
    if (existingIndex === -1) {
      history.unshift({
        id: Date.now(),
        image,
        fileName,
        customName: defaultName,
        tags: defaultTags,
        analysisData,
        date: new Date().toISOString(),
        autoSaved: true // Flag to indicate this was auto-saved
      });
      
      // Keep only last 50 analyses
      localStorage.setItem('photoHistory', JSON.stringify(history.slice(0, 50)));
    }
  };

  // Simulated AI analysis results
  const analysisData = {
    overallScore: 87,
    aestheticBreakdown: {
      composition: 92,
      colorHarmony: 85,
      lighting: 88,
      clarity: 84,
    },
    dominantColors: ['#8B4513', '#CD853F', '#F4A460', '#DEB887'],
    detectedStyle: 'Autumn Warm',
    mood: 'Confident & Elegant',
    recommendations: [
      'The warm earth tones complement your skin tone perfectly',
      'Consider adding gold accessories to enhance the overall look',
      'This color palette works great for professional settings',
      'Pair with neutral bottoms for a balanced ensemble',
    ],
    seasonMatch: 'Autumn',
    confidenceScore: 94,
  };

  const handleShare = () => {
    navigate('/social-media', { state: { image, analysisData } });
  };

  const handleSaveToHistory = () => {
    // Pre-fill the modal with auto-generated data
    const defaultName = `${analysisData.seasonMatch || 'Style'} Look - ${new Date().toLocaleDateString()}`;
    const defaultTags = [
      analysisData.seasonMatch?.toLowerCase(),
      analysisData.detectedStyle?.toLowerCase(),
      analysisData.mood?.toLowerCase(),
      'auto-saved'
    ].filter(Boolean).join(', ');
    
    setSaveName(defaultName);
    setSaveTags(defaultTags);
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    if (!saveName.trim()) {
      alert('Please enter a name for your analysis');
      return;
    }

    // Save to local storage or backend
    const history = JSON.parse(localStorage.getItem('photoHistory') || '[]');
    
    // Check if this is updating an existing auto-saved entry
    const existingIndex = history.findIndex(item => 
      item.image === image && 
      item.analysisData.overallScore === analysisData.overallScore &&
      item.autoSaved === true
    );
    
    const newEntry = {
      id: existingIndex !== -1 ? history[existingIndex].id : Date.now(),
      image,
      fileName,
      customName: saveName.trim(),
      tags: saveTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      analysisData,
      date: new Date().toISOString(),
      autoSaved: false // Mark as manually saved
    };
    
    if (existingIndex !== -1) {
      // Update existing entry
      history[existingIndex] = newEntry;
    } else {
      // Add new entry
      history.unshift(newEntry);
    }
    
    localStorage.setItem('photoHistory', JSON.stringify(history.slice(0, 50)));
    
    setShowSaveModal(false);
    setSaveName('');
    setSaveTags('');
    alert('Analysis saved to history!');
  };

  const handleCancelSave = () => {
    setShowSaveModal(false);
    setSaveName('');
    setSaveTags('');
  };

  if (!image) return null;

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white text-center mb-12 font-display"
        >
          Analysis Results
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Photo Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6"
          >
            <img
              src={image}
              alt="Analyzed"
              className="w-full h-96 object-cover rounded-xl mb-4"
            />
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/upload')}
                className="flex-1 btn-primary bg-white bg-opacity-20 text-white"
              >
                New Analysis
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveToHistory}
                className="flex-1 btn-primary bg-green-500 text-white"
              >
                ✏️ Customize & Save
              </motion.button>
            </div>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="glass p-8 text-center"
            >
              <div className="text-7xl font-bold text-white mb-2">
                {analysisData.overallScore}
              </div>
              <div className="text-2xl text-purple-200 font-semibold">
                Overall Style Score
              </div>
              <div className="mt-4 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-3xl">
                    {i < Math.floor(analysisData.overallScore / 20) ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Aesthetic Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-6"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Aesthetic Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(analysisData.aestheticBreakdown).map(([key, value], index) => (
                  <div key={key}>
                    <div className="flex justify-between text-white mb-2">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-bold">{value}%</span>
                    </div>
                    <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Dominant Colors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass p-6"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Dominant Colors</h3>
              <div className="flex gap-3">
                {analysisData.dominantColors.map((color, index) => (
                  <motion.div
                    key={color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.2 }}
                    className="flex-1 aspect-square rounded-xl shadow-lg cursor-pointer relative group"
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
          </motion.div>
        </div>

        {/* Additional Insights */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Style Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-purple-200">Detected Style:</span>
                <span className="text-white font-bold">{analysisData.detectedStyle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-200">Mood:</span>
                <span className="text-white font-bold">{analysisData.mood}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-200">Season Match:</span>
                <span className="text-white font-bold">{analysisData.seasonMatch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-200">Confidence:</span>
                <span className="text-white font-bold">{analysisData.confidenceScore}%</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Recommendations</h3>
            <ul className="space-y-3">
              {analysisData.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-3 text-purple-200"
                >
                  <span className="text-green-400 mt-1">✓</span>
                  <span>{rec}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 flex gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="btn-primary bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8"
          >
            📱 Share on Social Media
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/products')}
            className="btn-primary bg-white text-purple-600 px-8"
          >
            🛍️ Shop This Style
          </motion.button>
        </motion.div>

        {/* Save Modal */}
        <AnimatePresence>
          {showSaveModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="glass p-8 w-full max-w-md"
              >
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Save Analysis
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Analysis Name *
                    </label>
                    <input
                      type="text"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      placeholder="e.g., My Summer Look, Casual Friday, Date Night Outfit"
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-purple-200 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Tags (optional)
                    </label>
                    <input
                      type="text"
                      value={saveTags}
                      onChange={(e) => setSaveTags(e.target.value)}
                      placeholder="e.g., casual, work, party, summer, elegant"
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-purple-200 focus:outline-none focus:border-purple-400"
                    />
                    <p className="text-purple-200 text-sm mt-1">
                      Separate tags with commas
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelSave}
                    className="flex-1 btn-primary bg-white bg-opacity-20 text-white"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmSave}
                    className="flex-1 btn-primary bg-white text-purple-600 btn-glow"
                  >
                    Save Analysis
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalysisScreen;
