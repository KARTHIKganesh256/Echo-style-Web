import User from '../models/User.js';

// Seasonal Color Analysis Logic
const analyzeSeason = (undertone, depth) => {
  if (undertone === 'Warm' && (depth === 'Fair' || depth === 'Light')) {
    return 'Spring';
  } else if (undertone === 'Warm' && (depth === 'Medium' || depth === 'Deep' || depth === 'Olive' || depth === 'Ebony')) {
    return 'Autumn';
  } else if (undertone === 'Cool' && (depth === 'Fair' || depth === 'Light')) {
    return 'Summer';
  } else if (undertone === 'Cool' && (depth === 'Medium' || depth === 'Deep' || depth === 'Olive' || depth === 'Ebony')) {
    return 'Winter';
  } else {
    return 'Neutral';
  }
};

// Get seasonal color palette
const getSeasonalPalette = (season) => {
  const palettes = {
    Spring: {
      colors: ['#FFD700', '#FF6B9D', '#98D8C8', '#F7CAC9', '#FFDAB9', '#E0BBE4', '#FFE5B4', '#B0E57C'],
      description: 'Warm, light, and bright colors with yellow undertones',
      characteristics: ['Bright', 'Warm', 'Light', 'Clear']
    },
    Summer: {
      colors: ['#B4A7D6', '#AED9E0', '#D5A6BD', '#E8DFF5', '#A2B5CD', '#C7CEEA', '#B0C4DE', '#D8BFD8'],
      description: 'Cool, soft, and muted colors with blue undertones',
      characteristics: ['Soft', 'Cool', 'Light', 'Muted']
    },
    Autumn: {
      colors: ['#8B4513', '#CD853F', '#B8860B', '#A0522D', '#D2691E', '#8B7355', '#BC8F8F', '#6B4423'],
      description: 'Warm, deep, and muted colors with golden undertones',
      characteristics: ['Deep', 'Warm', 'Muted', 'Rich']
    },
    Winter: {
      colors: ['#000080', '#DC143C', '#4B0082', '#2F4F4F', '#8B008B', '#191970', '#800020', '#0C0C0C'],
      description: 'Cool, deep, and vivid colors with blue undertones',
      characteristics: ['Bright', 'Cool', 'Deep', 'Vivid']
    },
    Neutral: {
      colors: ['#F5F5DC', '#D3D3D3', '#C0C0C0', '#808080', '#696969', '#A9A9A9', '#B8B8B8', '#DCDCDC'],
      description: 'Balanced, versatile colors that work with various undertones',
      characteristics: ['Balanced', 'Versatile', 'Neutral', 'Soft']
    }
  };

  return palettes[season] || palettes.Neutral;
};

// @desc    Analyze skin tone and determine season
// @route   POST /api/analyze-tone
// @access  Private
export const analyzeTone = async (req, res) => {
  try {
    const { undertone, depth } = req.body;

    if (!undertone || !depth) {
      return res.status(400).json({ message: 'Please provide undertone and depth' });
    }

    // Determine season
    const season = analyzeSeason(undertone, depth);
    const palette = getSeasonalPalette(season);

    // Update user's skin analysis
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.skinAnalysis = { undertone, depth, season };
        await user.save();
      }
    }

    res.json({
      undertone,
      depth,
      season,
      palette
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get season palette info
// @route   GET /api/palette/:season
// @access  Public
export const getSeasonPalette = async (req, res) => {
  try {
    const { season } = req.params;
    const palette = getSeasonalPalette(season);

    res.json({
      season,
      palette
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
