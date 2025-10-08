import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UploadScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setProgress(0);

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/analysis', {
              state: {
                image: imagePreview,
                fileName: selectedImage.name,
              },
            });
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setProgress(0);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white text-center mb-4 font-display"
        >
          Photo Analysis
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-purple-200 text-center mb-12"
        >
          Upload your photo for AI-powered style analysis
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-8"
        >
          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all ${
                isDragging
                  ? 'border-purple-400 bg-purple-500 bg-opacity-10'
                  : 'border-white border-opacity-30 hover:border-opacity-50'
              }`}
            >
              <motion.div
                animate={{ scale: isDragging ? 1.1 : 1 }}
                className="flex flex-col items-center"
              >
                <div className="text-8xl mb-6">📸</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Drop your photo here
                </h3>
                <p className="text-purple-200 mb-6">
                  or click to browse from your device
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary bg-white text-purple-600 btn-glow"
                >
                  Select Photo
                </motion.button>

                <p className="text-purple-200 text-sm mt-6">
                  Supports: JPG, PNG, HEIC • Max size: 10MB
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-full h-96 object-cover"
                />
                
                {!analyzing && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={handleClear}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </motion.button>
                )}
              </motion.div>

              {analyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between text-white mb-2">
                    <span className="font-semibold">Analyzing your photo...</span>
                    <span className="font-bold">{progress}%</span>
                  </div>
                  
                  <div className="h-3 bg-white bg-opacity-20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {['Preprocessing', 'Color Analysis', 'Style Detection', 'Generating Insights'].map(
                      (step, index) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg ${
                            progress > index * 25
                              ? 'bg-green-500 bg-opacity-20 text-green-300'
                              : 'bg-white bg-opacity-10 text-purple-200'
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {progress > index * 25 ? '✓' : '○'} {step}
                          </span>
                        </motion.div>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {!analyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClear}
                    className="flex-1 btn-primary bg-white bg-opacity-20 text-white"
                  >
                    Choose Different Photo
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze}
                    className="flex-1 btn-primary bg-white text-purple-600 btn-glow"
                  >
                    Analyze Photo
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          {[
            { icon: '🎨', title: 'Color Analysis', desc: 'Detect dominant colors and palettes' },
            { icon: '✨', title: 'Style Recognition', desc: 'Identify fashion styles and trends' },
            { icon: '💡', title: 'Smart Recommendations', desc: 'Get personalized styling tips' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass p-6 text-center"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-purple-200 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default UploadScreen;
