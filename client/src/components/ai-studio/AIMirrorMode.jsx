import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Sparkles, RotateCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { seasonalPalettes, applySeasonalFilter } from '@/utils/aiUtils';

const AIMirrorMode = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('Spring');
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

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
  }, [selectedSeason, isActive, stream, isVideoReady]);

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
      // Set canvas size to match video for sharp export
      const vw = video.videoWidth || 1280;
      const vh = video.videoHeight || 720;
      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw;
        canvas.height = vh;
      }

      // Clear previous frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mirror horizontally for natural mirror effect
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Apply seasonal filter
      applySeasonalFilter(ctx, canvas.width, canvas.height, selectedSeason);

      // Add glow effect
      ctx.shadowBlur = 20;
      ctx.shadowColor = seasonalPalettes[selectedSeason].colors[0];
    }

    // Continue animation loop
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    }
  };

  /**
   * Save the CURRENT PROCESSED CANVAS as a JPG:
   * - Uses canvas.toDataURL('image/jpeg', 1.0)
   * - Triggers a download with a timestamped filename
   * - Works on desktop & mobile (mobile may show a preview or ask where to save)
   */
  const handleSavePhoto = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Convert the processed canvas content to a JPEG Data URL (quality 1.0)
      const dataUrl = canvas.toDataURL('image/jpeg', 1.0);

      // Create an anchor and programmatically click it to download
      const a = document.createElement('a');
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = dataUrl;
      a.download = `ai_mirror_${ts}.jpg`; // Saved to Downloads (browser-managed)
      
      // Some mobile browsers require the element to be in the document
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error('Save failed:', e);
      alert('Failed to save photo. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            AI Mirror Mode
          </h2>
          <p className="text-gray-300 mt-2">
            See yourself with different seasonal color palettes in real-time
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsActive(!isActive)}
            className={`${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-6 text-lg`}
          >
            {isActive ? (
              <>
                <CameraOff className="w-5 h-5 mr-2" />
                Stop Mirror
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Start Mirror
              </>
            )}
          </Button>
          
          <Button
            onClick={handleSavePhoto}
            disabled={!isActive}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                       disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-6 text-lg
                       transition-all duration-200 shadow-lg hover:shadow-xl"
            title="Save processed mirror image"
          >
            <Download className="w-5 h-5 mr-2" />
            📸 Save Photo
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}

      {/* Season Selector */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 flex-wrap"
        >
          {Object.entries(seasonalPalettes).map(([season, palette]) => (
            <motion.button
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedSeason === season
                  ? 'bg-white text-purple-900 scale-110'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${palette.colors[0]}, ${palette.colors[palette.colors.length - 1]})` }}
                />
                {season}
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Video Display */}
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
              
              {/* Season Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedSeason} Palette</h3>
                    <p className="text-gray-300">{seasonalPalettes[selectedSeason].mood}</p>
                  </div>
                  <div className="flex gap-2">
                    {seasonalPalettes[selectedSeason].colors.slice(0, 5).map((color, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-gray-400"
            >
              <Camera className="w-24 h-24 mb-4 opacity-50" />
              <p className="text-xl">Click "Start Mirror" to begin</p>
              <p className="text-sm mt-2">Your camera will show different seasonal color palettes</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIMirrorMode;


