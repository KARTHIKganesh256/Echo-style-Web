import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SmartCursor = ({ activePalette = null, isDark = true }) => {
  const cursorRef = useRef(null);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [cursorSize, setCursorSize] = useState(20);
  const [cursorColor, setCursorColor] = useState('#a78bfa');
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [ripples, setRipples] = useState([]);
  const idleTimerRef = useRef(null);

  // Smooth spring animation for cursor movement
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Get color based on active palette or default
  const getActiveColor = () => {
    if (activePalette && activePalette.colors && activePalette.colors.length > 0) {
      return activePalette.colors[0];
    }
    return isDark ? '#a78bfa' : '#8b5cf6';
  };

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Reset idle state
      setIsIdle(false);
      clearTimeout(idleTimerRef.current);
      
      // Start new idle timer
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 5000);

      // Check if hovering over interactive elements
      const target = e.target;
      const isInteractive = 
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.palette-card') ||
        target.closest('.interactive');

      if (isInteractive) {
        setIsHovering(true);
        
        // Get element color if available
        const computedStyle = window.getComputedStyle(target.closest('button') || target);
        const bgColor = computedStyle.backgroundColor;
        
        // Try to extract palette color from data attribute or nearest palette
        const paletteCard = target.closest('.palette-card');
        if (paletteCard && paletteCard.dataset.color) {
          setCursorColor(paletteCard.dataset.color);
        } else {
          setCursorColor(getActiveColor());
        }
        
        setCursorSize(40);
      } else {
        setIsHovering(false);
        setCursorColor(getActiveColor());
        setCursorSize(20);
      }
    };

    const handleMouseDown = (e) => {
      setIsClicking(true);
      
      // Create ripple effect
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        color: cursorColor
      };
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 800);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      clearTimeout(idleTimerRef.current);
    };
  }, [cursorColor, activePalette, isDark]);

  // Update cursor color when active palette changes
  useEffect(() => {
    if (!isHovering) {
      setCursorColor(getActiveColor());
    }
  }, [activePalette, isHovering, isDark]);

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {/* Outer Glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          animate={{
            width: isClicking ? cursorSize * 2 : cursorSize * 1.5,
            height: isClicking ? cursorSize * 2 : cursorSize * 1.5,
            opacity: isIdle ? [0.3, 0.6, 0.3] : isHovering ? 0.8 : 0.4,
          }}
          transition={{
            duration: isIdle ? 2 : 0.3,
            repeat: isIdle ? Infinity : 0,
            ease: "easeInOut"
          }}
          style={{
            backgroundColor: cursorColor,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Inner Core */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            width: isClicking ? cursorSize * 1.5 : cursorSize,
            height: isClicking ? cursorSize * 1.5 : cursorSize,
            scale: isClicking ? [1, 1.5, 1] : 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut"
          }}
          style={{
            backgroundColor: cursorColor,
            transform: 'translate(-50%, -50%)',
            opacity: 0.6,
          }}
        />

        {/* Ripple Ring on Hover */}
        {isHovering && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: cursorColor,
            }}
            animate={{
              width: cursorSize * 2,
              height: cursorSize * 2,
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}

        {/* Heartbeat effect when idle */}
        {isIdle && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: cursorColor,
              width: cursorSize * 1.5,
              height: cursorSize * 1.5,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Trailing particles */}
        {isHovering && (
          <>
            <motion.div
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: cursorColor }}
              animate={{
                x: [0, -20, 0],
                y: [0, -20, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: cursorColor }}
              animate={{
                x: [0, 20, 0],
                y: [0, 20, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3
              }}
            />
          </>
        )}
      </motion.div>

      {/* Click Ripples */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-2"
          style={{
            borderColor: ripple.color,
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{
            width: 20,
            height: 20,
            opacity: 1,
          }}
          animate={{
            width: 100,
            height: 100,
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Secondary light burst on click */}
      {isClicking && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full blur-2xl"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
            backgroundColor: cursorColor,
          }}
          initial={{
            width: 0,
            height: 0,
            opacity: 0.8,
          }}
          animate={{
            width: 150,
            height: 150,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut"
          }}
        />
      )}
    </>
  );
};

export default SmartCursor;

