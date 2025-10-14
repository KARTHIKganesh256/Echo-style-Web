import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Camera, Shirt, Dna, Wand2, Sun, Heart, ChevronRight } from 'lucide-react';
import AIMirrorMode from '@/components/ai-studio/AIMirrorMode';
import VirtualCloset from '@/components/ai-studio/VirtualCloset';
import AIStyleDNA from '@/components/ai-studio/AIStyleDNA';
import AIOutfitGenerator from '@/components/ai-studio/AIOutfitGenerator';
import ARPaletteGlow from '@/components/ai-studio/ARPaletteGlow';
import PaletteMemoryWall from '@/components/ai-studio/PaletteMemoryWall';

const features = [
  {
    id: 'mirror',
    name: 'AI Mirror Mode',
    icon: Camera,
    color: 'from-yellow-400 to-orange-500',
    description: 'Real-time color palette filters on your webcam',
    component: AIMirrorMode
  },
  {
    id: 'closet',
    name: 'Virtual Closet',
    icon: Shirt,
    color: 'from-blue-400 to-purple-500',
    description: 'Upload clothes and get AI-powered combinations',
    component: VirtualCloset
  },
  {
    id: 'dna',
    name: 'AI Style DNA',
    icon: Dna,
    color: 'from-pink-400 to-purple-500',
    description: 'Your personalized style fingerprint',
    component: AIStyleDNA
  },
  {
    id: 'outfit',
    name: 'AI Outfit Generator',
    icon: Wand2,
    color: 'from-purple-400 to-pink-500',
    description: 'Generate beautiful outfit combinations',
    component: AIOutfitGenerator
  },
  {
    id: 'ar',
    name: 'AR Palette Glow',
    icon: Sun,
    color: 'from-orange-400 to-red-500',
    description: 'Augmented reality seasonal filters',
    component: ARPaletteGlow
  },
  {
    id: 'memory',
    name: 'Palette Memory Wall',
    icon: Heart,
    color: 'from-red-400 to-pink-500',
    description: 'Save and share your favorite palettes',
    component: PaletteMemoryWall
  }
];

const AIStudioPage = () => {
  const [selectedFeature, setSelectedFeature] = useState('mirror');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeFeature = features.find(f => f.id === selectedFeature);
  const ActiveComponent = activeFeature?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-full mb-6 shadow-2xl"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-display">
            AI Style Studio
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of fashion with AI-powered tools that understand your unique style
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex gap-6 relative">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`${
              sidebarOpen ? 'w-80' : 'w-20'
            } transition-all duration-300 flex-shrink-0`}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sticky top-24 border border-white/20">
              {/* Toggle Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full mb-4 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: sidebarOpen ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.div>
              </button>

              {/* Feature List */}
              <div className="space-y-2">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isActive = selectedFeature === feature.id;
                  
                  return (
                    <motion.button
                      key={feature.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedFeature(feature.id)}
                      className={`w-full p-4 rounded-xl transition-all ${
                        isActive
                          ? 'bg-white text-purple-900 shadow-lg scale-105'
                          : 'bg-white/5 hover:bg-white/10 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color} ${!isActive && 'opacity-70'}`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        
                        <AnimatePresence>
                          {sidebarOpen && (
                            <motion.div
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              className="text-left flex-1"
                            >
                              <div className="font-semibold text-sm">{feature.name}</div>
                              {isActive && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="text-xs opacity-70 mt-1"
                                >
                                  {feature.description}
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feature Count */}
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-white/5 rounded-xl text-center"
                >
                  <div className="text-3xl font-bold text-white mb-1">{features.length}</div>
                  <div className="text-sm text-gray-300">AI Features</div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Main Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 min-h-[800px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFeature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {ActiveComponent && <ActiveComponent />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-white font-bold text-lg mb-2">Color Intelligence</h3>
            <p className="text-gray-300 text-sm">
              Advanced AI analyzes colors and recommends perfect combinations
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="text-white font-bold text-lg mb-2">Machine Learning</h3>
            <p className="text-gray-300 text-sm">
              Learns your preferences to create personalized style recommendations
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-white font-bold text-lg mb-2">Real-time AR</h3>
            <p className="text-gray-300 text-sm">
              See how different colors look on you instantly with AR filters
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIStudioPage;


