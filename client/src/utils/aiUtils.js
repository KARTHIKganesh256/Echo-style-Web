/**
 * AI Utilities for color processing, face detection, and style analysis
 */

// Color palette definitions for seasonal analysis
export const seasonalPalettes = {
  Spring: {
    name: 'Spring',
    colors: ['#FFD700', '#FF6B9D', '#98D8C8', '#F7CAC9', '#FFDAB9', '#E0BBE4', '#FFE5B4', '#B0E57C'],
    mood: 'Energetic, Fresh, Vibrant',
    gradient: 'from-yellow-400 via-pink-400 to-green-400'
  },
  Summer: {
    name: 'Summer',
    colors: ['#B4A7D6', '#AED9E0', '#D5A6BD', '#E8DFF5', '#A2B5CD', '#C7CEEA', '#B0C4DE', '#D8BFD8'],
    mood: 'Cool, Calm, Soft',
    gradient: 'from-purple-300 via-blue-300 to-pink-300'
  },
  Autumn: {
    name: 'Autumn',
    colors: ['#8B4513', '#CD853F', '#B8860B', '#A0522D', '#D2691E', '#8B7355', '#BC8F8F', '#6B4423'],
    mood: 'Warm, Rich, Earthy',
    gradient: 'from-amber-700 via-orange-600 to-brown-600'
  },
  Winter: {
    name: 'Winter',
    colors: ['#000080', '#DC143C', '#4B0082', '#2F4F4F', '#8B008B', '#191970', '#800020', '#0C0C0C'],
    mood: 'Bold, Dramatic, Clear',
    gradient: 'from-blue-900 via-purple-900 to-red-900'
  }
};

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calculate color distance using simple RGB distance
 */
export const colorDistance = (color1, color2) => {
  const c1 = typeof color1 === 'string' ? hexToRgb(color1) : color1;
  const c2 = typeof color2 === 'string' ? hexToRgb(color2) : color2;
  
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
};

/**
 * Find the closest seasonal palette for a given color
 */
export const findClosestPalette = (color) => {
  let closestSeason = 'Spring';
  let minDistance = Infinity;

  Object.entries(seasonalPalettes).forEach(([season, palette]) => {
    palette.colors.forEach(paletteColor => {
      const distance = colorDistance(color, paletteColor);
      if (distance < minDistance) {
        minDistance = distance;
        closestSeason = season;
      }
    });
  });

  return closestSeason;
};

/**
 * Apply color overlay to canvas context
 */
export const applyColorFilter = (ctx, width, height, color, opacity = 0.3) => {
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1.0;
};

/**
 * Apply seasonal filter to video frame
 */
export const applySeasonalFilter = (ctx, width, height, season) => {
  const palette = seasonalPalettes[season];
  if (!palette) return;

  // Create gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  palette.colors.forEach((color, index) => {
    gradient.addColorStop(index / (palette.colors.length - 1), color);
  });

  ctx.globalAlpha = 0.15;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1.0;
};

/**
 * Categorize clothing items by color
 */
export const categorizeClothingByColor = (imageData) => {
  // Simplified version - in production, you'd use TensorFlow for object detection
  const rgb = extractDominantColor(imageData);
  const season = findClosestPalette(rgb);
  return { dominantColor: rgb, season };
};

/**
 * Extract dominant color from image data
 */
export const extractDominantColor = (imageData) => {
  const data = imageData.data;
  const colorMap = {};
  
  // Sample every 10th pixel for performance
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${r},${g},${b}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }

  // Find most common color
  let maxCount = 0;
  let dominantColor = { r: 0, g: 0, b: 0 };
  
  Object.entries(colorMap).forEach(([color, count]) => {
    if (count > maxCount) {
      maxCount = count;
      const [r, g, b] = color.split(',').map(Number);
      dominantColor = { r, g, b };
    }
  });

  return dominantColor;
};

/**
 * Calculate style DNA based on user preferences
 */
export const calculateStyleDNA = (preferences) => {
  const seasonScores = {
    Spring: 0,
    Summer: 0,
    Autumn: 0,
    Winter: 0
  };

  preferences.forEach(pref => {
    if (pref.season && seasonScores.hasOwnProperty(pref.season)) {
      seasonScores[pref.season] += pref.weight || 1;
    }
  });

  const total = Object.values(seasonScores).reduce((a, b) => a + b, 0);
  const percentages = {};
  
  Object.entries(seasonScores).forEach(([season, score]) => {
    percentages[season] = total > 0 ? Math.round((score / total) * 100) : 0;
  });

  return percentages;
};

/**
 * Generate outfit combinations based on season and mood
 */
export const generateOutfitCombinations = (season, mood) => {
  const palette = seasonalPalettes[season];
  const combinations = [];

  for (let i = 0; i < 3; i++) {
    const baseColor = palette.colors[i * 2];
    const accentColor = palette.colors[i * 2 + 1] || palette.colors[0];
    
    combinations.push({
      id: i,
      name: `${season} Look ${i + 1}`,
      items: [
        { type: 'top', color: baseColor, description: getMoodBasedDescription(mood, 'top') },
        { type: 'bottom', color: accentColor, description: getMoodBasedDescription(mood, 'bottom') },
        { type: 'accessory', color: palette.colors[(i + 3) % palette.colors.length], description: 'Accent piece' }
      ]
    });
  }

  return combinations;
};

/**
 * Get mood-based clothing description
 */
const getMoodBasedDescription = (mood, type) => {
  const descriptions = {
    casual: { top: 'Relaxed fit shirt', bottom: 'Comfortable pants' },
    formal: { top: 'Tailored blazer', bottom: 'Dress trousers' },
    artistic: { top: 'Flowy blouse', bottom: 'Wide-leg pants' },
    energetic: { top: 'Vibrant top', bottom: 'Dynamic bottoms' }
  };

  return descriptions[mood]?.[type] || `${type} piece`;
};

/**
 * Convert image to canvas for processing
 */
export const imageToCanvas = (image) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  return { canvas, ctx };
};

/**
 * Simple face detection placeholder (use MediaPipe in production)
 */
export const detectFaceRegion = (width, height) => {
  // Simplified - returns center region
  return {
    x: width * 0.3,
    y: height * 0.2,
    width: width * 0.4,
    height: height * 0.5
  };
};

// =====================
// Closet color utilities
// =====================

export const rgbToHsl = ({ r, g, b }) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max - min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s, l };
};

export const hueDistance = (h1, h2) => {
  const d = Math.abs(h1 - h2);
  return Math.min(d, 360 - d);
};

export const isComplementaryHue = (h1, h2, tolerance = 20) =>
  Math.abs(hueDistance(h1, h2) - 180) <= tolerance;

export const isAnalogousHue = (h1, h2, tolerance = 30) =>
  hueDistance(h1, h2) <= tolerance;

export const isNeutralRGB = ({ r, g, b }) => {
  // heuristic: low saturation or near gray/beige/brown range
  const { s } = rgbToHsl({ r, g, b });
  return s < 0.12; // very low saturation treated as neutral
};

export const pickClosetColorPairs = (closetItems, maxPairs = 3) => {
  const colors = closetItems.map(i => i.dominantColor).filter(Boolean);
  const pairs = [];
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const a = colors[i];
      const b = colors[j];
      const ha = rgbToHsl(a).h; const hb = rgbToHsl(b).h;
      if (isNeutralRGB(a) || isNeutralRGB(b) || isAnalogousHue(ha, hb) || isComplementaryHue(ha, hb)) {
        pairs.push([a, b]);
      }
    }
  }
  // de-duplicate-like by hue bucket and limit
  return pairs.slice(0, maxPairs);
};



