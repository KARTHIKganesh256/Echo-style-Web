import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const SocialMediaScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, analysisData } = location.state || {};
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [caption, setCaption] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const captionTemplates = [
    `✨ Just discovered my perfect style palette! My ${analysisData?.seasonMatch || 'seasonal'} colors score: ${analysisData?.overallScore || 0}/100 🎨 #StyleAnalysis #EchoStyle`,
    `Feeling confident in my ${analysisData?.detectedStyle || 'style'}! 🌟 AI says this look is ${analysisData?.overallScore || 0}% perfect for me 💯 #OOTD #PersonalStyle`,
    `Color analysis complete! 🎨 These ${analysisData?.seasonMatch || 'seasonal'} tones are made for me ✨ #ColorAnalysis #StyleTips`,
    `My style DNA: ${analysisData?.mood || 'Confident & Elegant'} vibes 💫 Score: ${analysisData?.overallScore || 0}/100 🎯 #FashionAI #StyleGoals`,
  ];

  const platforms = [
    { name: 'Instagram', icon: '📷', color: 'from-purple-600 to-pink-500', handle: '@yourusername' },
    { name: 'Facebook', icon: '👥', color: 'from-blue-600 to-blue-400', handle: 'facebook.com/you' },
    { name: 'Twitter', icon: '🐦', color: 'from-blue-400 to-blue-300', handle: '@yourusername' },
    { name: 'Pinterest', icon: '📌', color: 'from-red-600 to-red-400', handle: '@yourusername' },
  ];

  const togglePlatform = (platformName) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformName)
        ? prev.filter((p) => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleShare = () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    // Simulate sharing
    alert(`Sharing to: ${selectedPlatforms.join(', ')}\n\nCaption: ${caption || captionTemplates[selectedTemplate]}`);
    navigate('/photo-history');
  };

  if (!image) {
    navigate('/upload');
    return null;
  }

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="container mx-auto max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white text-center mb-4 font-display"
        >
          Share Your Style
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-purple-200 text-center mb-12"
        >
          Share your analysis results on social media
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Post Preview</h3>
            
            <div className="bg-white bg-opacity-10 rounded-2xl overflow-hidden">
              <img src={image} alt="Preview" className="w-full h-64 object-cover" />
              
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                  <div>
                    <div className="text-white font-semibold">Your Name</div>
                    <div className="text-purple-200 text-sm">Just now</div>
                  </div>
                </div>
                
                <p className="text-white mb-3">
                  {caption || captionTemplates[selectedTemplate]}
                </p>
                
                <div className="flex items-center gap-4 text-purple-200">
                  <span>❤️ 142</span>
                  <span>💬 23</span>
                  <span>🔄 12</span>
                </div>
              </div>
            </div>

            <div className="mt-4 glass-dark p-4 rounded-xl">
              <h4 className="text-white font-semibold mb-2">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-purple-200">
                  Overall Score: <span className="text-white font-bold">{analysisData?.overallScore || 0}</span>
                </div>
                <div className="text-purple-200">
                  Season: <span className="text-white font-bold">{analysisData?.seasonMatch || 'N/A'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sharing Options */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Platform Selection */}
            <div className="glass p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Select Platforms</h3>
              <div className="grid grid-cols-2 gap-4">
                {platforms.map((platform, index) => (
                  <motion.button
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => togglePlatform(platform.name)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedPlatforms.includes(platform.name)
                        ? 'bg-white bg-opacity-20 border-white'
                        : 'bg-white bg-opacity-5 border-white border-opacity-20'
                    }`}
                  >
                    <div className={`text-4xl mb-2 bg-gradient-to-br ${platform.color} bg-clip-text text-transparent`}>
                      {platform.icon}
                    </div>
                    <div className="text-white font-semibold">{platform.name}</div>
                    <div className="text-purple-200 text-xs">{platform.handle}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Caption Templates */}
            <div className="glass p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Caption Templates</h3>
              <div className="space-y-3">
                {captionTemplates.map((template, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedTemplate(index);
                      setCaption('');
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedTemplate === index && !caption
                        ? 'bg-purple-500 bg-opacity-30 border-2 border-purple-400'
                        : 'bg-white bg-opacity-10 border-2 border-transparent hover:border-purple-400'
                    }`}
                  >
                    <p className="text-white text-sm">{template}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Caption */}
            <div className="glass p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Custom Caption</h3>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your own caption..."
                className="w-full h-24 px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-purple-200 focus:outline-none focus:border-purple-400 resize-none"
              />
              <div className="text-purple-200 text-sm mt-2">
                {caption.length}/280 characters
              </div>
            </div>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShare}
              disabled={selectedPlatforms.length === 0}
              className="w-full btn-primary bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📤 Share Now ({selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''})
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaScreen;
