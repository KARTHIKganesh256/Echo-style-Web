import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const seasonalColors = {
    Spring: ['#FFD700', '#FF6B9D', '#98D8C8', '#F7CAC9', '#FFDAB9', '#E0BBE4', '#FFE5B4', '#B0E57C'],
    Summer: ['#B4A7D6', '#AED9E0', '#D5A6BD', '#E8DFF5', '#A2B5CD', '#C7CEEA', '#B0C4DE', '#D8BFD8'],
    Autumn: ['#8B4513', '#CD853F', '#B8860B', '#A0522D', '#D2691E', '#8B7355', '#BC8F8F', '#6B4423'],
    Winter: ['#000080', '#DC143C', '#4B0082', '#2F4F4F', '#8B008B', '#191970', '#800020', '#0C0C0C']
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
          className="text-center z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-7xl md:text-8xl font-bold text-white mb-6 font-display"
          >
            Echo<span className="gradient-text">Style</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2xl md:text-3xl text-white mb-12 font-light"
          >
            Your Style, <span className="text-purple-300">Powered by KONDA</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary bg-white text-purple-600 text-xl btn-glow px-12 py-4"
              >
                Get Started
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-pink-500 rounded-full opacity-20 blur-3xl"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-white text-center mb-16 font-display"
          >
            Discover Your Perfect Palette
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Skin Tone Analysis',
                description: 'Advanced questionnaire to determine your unique undertone and depth',
                icon: '🎨',
              },
              {
                title: 'Seasonal Colors',
                description: 'Get matched with Spring, Summer, Autumn, or Winter color palette',
                icon: '🌈',
              },
              {
                title: 'Smart Recommendations',
                description: 'Personalized product suggestions that complement your natural beauty',
                icon: '✨',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="glass p-8 text-center"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-purple-200">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Color Palette Preview */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-white text-center mb-16 font-display"
          >
            Seasonal Color Palettes
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(seasonalColors).map(([season, colors], seasonIndex) => (
              <motion.div
                key={season}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: seasonIndex * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass p-6"
              >
                <h3 className="text-2xl font-bold text-white mb-4 text-center">{season}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color, colorIndex) => (
                    <motion.div
                      key={colorIndex}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className="aspect-square rounded-lg shadow-lg cursor-pointer"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass container mx-auto p-16 text-center"
        >
          <h2 className="text-5xl font-bold text-white mb-6 font-display">
            Ready to Transform Your Style?
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            Join thousands of users discovering their perfect colors
          </p>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary bg-white text-purple-600 text-xl btn-glow px-12 py-4"
            >
              Start Your Journey
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
