import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Sun, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { seasonalPalettes } from '@/utils/aiUtils';

const ARPaletteGlow = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedGlow, setSelectedGlow] = useState('Spring');
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle camera start/stop
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isActive]);

  // Handle rendering when video is ready
  useEffect(() => {
    if (isActive && stream && isVideoReady) {
      renderFrame();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [selectedGlow, isActive, stream, isVideoReady]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsVideoReady(true);
        };
      }
      
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please grant camera permissions.');
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    // Stop animation frame first
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop video stream
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      setStream(null);
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    setIsVideoReady(false);
  };

  const renderFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isActive || !stream) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // Set canvas size to match video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      // Clear previous frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw video frame
      ctx.save();
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Apply AR glow effect
      const palette = seasonalPalettes[selectedGlow];
      
      // Radial gradient glow
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      
      gradient.addColorStop(0, `${palette.colors[0]}00`);
      gradient.addColorStop(0.5, `${palette.colors[1]}33`);
      gradient.addColorStop(1, `${palette.colors[2]}66`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add sparkle effect
      ctx.shadowBlur = 40;
      ctx.shadowColor = palette.colors[0];
      
      // Vignette effect
      const vignetteGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Continue animation loop
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Sun className="w-8 h-8 text-orange-400" />
            AR Palette Glow
          </h2>
          <p className="text-gray-300 mt-2">
            {isMobile ? 'Perfect for mobile! ' : ''}Experience your seasonal glow in augmented reality
          </p>
        </div>
        <Button
          onClick={() => setIsActive(!isActive)}
          className={`${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white px-6 py-6 text-lg`}
        >
          {isActive ? (
            <>
              <CameraOff className="w-5 h-5 mr-2" />
              Stop AR
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              Start AR
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}

      {isMobile && !isActive && (
        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 text-blue-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>Mobile detected! AR filters work best on mobile devices.</span>
          </div>
        </div>
      )}

      {/* Glow Selector */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 flex-wrap"
        >
          {Object.entries(seasonalPalettes).map(([season, palette]) => (
            <motion.button
              key={season}
              onClick={() => setSelectedGlow(season)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all relative overflow-hidden ${
                selectedGlow === season
                  ? 'bg-white text-purple-900 scale-110'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedGlow === season && (
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${palette.colors[0]}, ${palette.colors[palette.colors.length - 1]})`
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              )}
              <div className="flex items-center gap-2 relative z-10">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${palette.colors[0]}, ${palette.colors[2]})` }}
                />
                {season} Glow
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* AR Display */}
      <div className="relative rounded-2xl overflow-hidden bg-black/50 backdrop-blur-sm">
        <AnimatePresence>
          {isActive ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="hidden"
              />
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-2xl shadow-2xl"
                style={{ maxHeight: '600px', objectFit: 'contain' }}
              />
              
              {/* AR Overlay Info */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{ backgroundColor: seasonalPalettes[selectedGlow].colors[0] }}
                    />
                    <span className="text-white font-semibold">AR Active</span>
                  </div>
                </div>
                
                <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-2">
                  <span className="text-white font-semibold">{selectedGlow} Filter</span>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="text-xl font-bold text-white mb-1">{selectedGlow} Glow</h3>
                <p className="text-gray-300 text-sm">{seasonalPalettes[selectedGlow].mood}</p>
                
                {/* Color indicators */}
                <div className="flex gap-2 mt-3">
                  {seasonalPalettes[selectedGlow].colors.slice(0, 4).map((color, idx) => (
                    <motion.div
                      key={idx}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: color }}
                      animate={{
                        scale: [1, 1.1, 1],
                        boxShadow: [`0 0 0px ${color}`, `0 0 20px ${color}`, `0 0 0px ${color}`]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: idx * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-gray-400"
            >
              <Sun className="w-24 h-24 mb-4 opacity-50" />
              <p className="text-xl">Click "Start AR" to begin</p>
              <p className="text-sm mt-2">Experience beautiful seasonal glows in real-time</p>
              {isMobile && (
                <div className="mt-4 px-6 py-3 bg-blue-500/20 rounded-lg border border-blue-500/50">
                  <p className="text-blue-300 text-sm">📱 Mobile optimized for best AR experience</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ARPaletteGlow;


