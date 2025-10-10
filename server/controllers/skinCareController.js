import SkinCare from '../models/SkinCare.js';

// Analyze skin care questionnaire and generate recommendations
const analyzeSkinCare = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      basicInfo,
      skinType,
      skinConcerns,
      lifestyle
    } = req.body;

    // Check if user already has a skin care analysis
    const existingAnalysis = await SkinCare.findOne({ userId });
    if (existingAnalysis) {
      return res.status(400).json({
        message: 'Skin care analysis already exists. Use update endpoint to modify.'
      });
    }

    // Generate analysis based on responses
    const analysis = generateSkinCareAnalysis({
      basicInfo,
      skinType,
      skinConcerns,
      lifestyle
    });

    // Create new skin care analysis
    const skinCareAnalysis = new SkinCare({
      userId,
      basicInfo,
      skinType,
      skinConcerns,
      lifestyle,
      analysis
    });

    await skinCareAnalysis.save();

    res.status(201).json({
      message: 'Skin care analysis completed successfully',
      analysis: skinCareAnalysis
    });
  } catch (error) {
    console.error('Skin care analysis error:', error);
    res.status(500).json({
      message: 'Error analyzing skin care data',
      error: error.message
    });
  }
};

// Get user's skin care analysis
const getSkinCareAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;

    const skinCareAnalysis = await SkinCare.findOne({ userId })
      .populate('userId', 'name email');

    if (!skinCareAnalysis) {
      return res.status(404).json({
        message: 'No skin care analysis found'
      });
    }

    res.json(skinCareAnalysis);
  } catch (error) {
    console.error('Get skin care analysis error:', error);
    res.status(500).json({
      message: 'Error retrieving skin care analysis',
      error: error.message
    });
  }
};

// Update skin care analysis
const updateSkinCareAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      basicInfo,
      skinType,
      skinConcerns,
      lifestyle
    } = req.body;

    // Generate updated analysis
    const analysis = generateSkinCareAnalysis({
      basicInfo,
      skinType,
      skinConcerns,
      lifestyle
    });

    const updatedAnalysis = await SkinCare.findOneAndUpdate(
      { userId },
      {
        basicInfo,
        skinType,
        skinConcerns,
        lifestyle,
        analysis,
        completedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json({
      message: 'Skin care analysis updated successfully',
      analysis: updatedAnalysis
    });
  } catch (error) {
    console.error('Update skin care analysis error:', error);
    res.status(500).json({
      message: 'Error updating skin care analysis',
      error: error.message
    });
  }
};

// Delete skin care analysis
const deleteSkinCareAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;

    await SkinCare.findOneAndDelete({ userId });

    res.json({
      message: 'Skin care analysis deleted successfully'
    });
  } catch (error) {
    console.error('Delete skin care analysis error:', error);
    res.status(500).json({
      message: 'Error deleting skin care analysis',
      error: error.message
    });
  }
};

// Helper function to generate skin care analysis
const generateSkinCareAnalysis = (data) => {
  const { basicInfo, skinType, skinConcerns, lifestyle } = data;

  // Determine primary concerns (limit to top 2-3)
  const primaryConcerns = skinConcerns.mainConcerns.slice(0, 3);

  // Generate routines based on skin type and concerns
  const routines = generateRoutines(skinType.type, skinConcerns.mainConcerns, lifestyle);
  
  // Generate ingredients recommendations
  const ingredients = generateIngredientRecommendations(skinType.type, skinConcerns.mainConcerns, skinConcerns.allergies);
  
  // Generate lifestyle tips
  const lifestyleTips = generateLifestyleTips(lifestyle);

  return {
    skinProfile: {
      skinType: skinType.type,
      primaryConcerns,
      keyFactors: {
        age: basicInfo.ageRange,
        sunExposure: lifestyle.sunExposure,
        stressLevel: lifestyle.stressLevel,
        sleepQuality: lifestyle.sleepQuality
      }
    },
    morningRoutine: routines.morning,
    eveningRoutine: routines.evening,
    beneficialIngredients: ingredients.beneficial,
    ingredientsToAvoid: ingredients.avoid,
    weeklyTreatments: routines.weekly,
    lifestyleTips
  };
};

// Generate skincare routines
const generateRoutines = (skinType, concerns, lifestyle) => {
  const routines = {
    morning: [],
    evening: [],
    weekly: []
  };

  // Base routine based on skin type
  switch (skinType) {
    case 'Dry':
      routines.morning = [
        'Creamy, hydrating cleanser',
        'Hyaluronic acid serum',
        'Rich moisturizer with ceramides',
        'Hydrating SPF 30+'
      ];
      routines.evening = [
        'Gentle milk cleanser',
        'Peptide or vitamin E serum',
        'Occlusive moisturizer or face oil',
        'Overnight sleeping mask 2x/week'
      ];
      break;
    
    case 'Oily':
      routines.morning = [
        'Foaming gel cleanser',
        'Niacinamide serum',
        'Lightweight, oil-free moisturizer',
        'Mattifying SPF 30+'
      ];
      routines.evening = [
        'Salicylic acid cleanser',
        'Retinol serum (start with low %)',
        'Light moisturizer or gel',
        'Clay mask 1-2x/week'
      ];
      break;
    
    case 'Combination':
      routines.morning = [
        'Gentle gel cleanser',
        'Hyaluronic acid serum',
        'Light moisturizer (heavier on dry areas)',
        'Broad spectrum SPF 30+'
      ];
      routines.evening = [
        'Double cleanse (oil + gentle cleanser)',
        'Vitamin C serum',
        'Balanced moisturizer',
        'Spot treatment for oily areas'
      ];
      break;
    
    case 'Sensitive':
      routines.morning = [
        'Hypoallergenic cream cleanser',
        'Soothing serum (chamomile/aloe)',
        'Fragrance-free moisturizer',
        'Mineral SPF 30+'
      ];
      routines.evening = [
        'Gentle, fragrance-free cleanser',
        'Calming serum',
        'Barrier repair moisturizer',
        'Cool compress for redness'
      ];
      break;
    
    case 'Normal':
      routines.morning = [
        'Gentle cream or gel cleanser',
        'Antioxidant serum (vitamin C)',
        'Light moisturizer',
        'Broad spectrum SPF 30+'
      ];
      routines.evening = [
        'Gentle cleanser',
        'Retinol or peptide serum',
        'Moisturizer with ceramides',
        'Weekly exfoliant'
      ];
      break;
  }

  // Add treatments based on concerns
  if (concerns.includes('Acne/Breakouts')) {
    routines.weekly.push('Salicylic acid treatment 2-3x/week');
  }
  if (concerns.includes('Fine lines/Wrinkles')) {
    routines.weekly.push('Retinol treatment 2-3x/week');
  }
  if (concerns.includes('Dullness')) {
    routines.weekly.push('Gentle exfoliant 1-2x/week');
  }
  if (concerns.includes('Dark spots/Hyperpigmentation')) {
    routines.weekly.push('Vitamin C treatment daily');
  }

  // Add lifestyle-based treatments
  if (lifestyle.stressLevel === 'High' || lifestyle.stressLevel === 'Very High') {
    routines.weekly.push('Relaxing face mask with calming ingredients');
  }
  if (lifestyle.sleepQuality === 'Poor' || lifestyle.sleepQuality === 'Fair') {
    routines.evening.push('Overnight repair treatment');
  }

  return routines;
};

// Generate ingredient recommendations
const generateIngredientRecommendations = (skinType, concerns, allergies) => {
  const ingredients = {
    beneficial: [],
    avoid: []
  };

  // Base beneficial ingredients by skin type
  switch (skinType) {
    case 'Dry':
      ingredients.beneficial = ['Hyaluronic Acid', 'Ceramides', 'Glycerin', 'Squalane', 'Shea Butter'];
      ingredients.avoid = ['Alcohol', 'Strong fragrances', 'Harsh sulfates', 'Retinol (high %)'];
      break;
    
    case 'Oily':
      ingredients.beneficial = ['Niacinamide', 'Salicylic Acid', 'Tea Tree Oil', 'Clay', 'Witch Hazel'];
      ingredients.avoid = ['Heavy oils', 'Comedogenic ingredients', 'Thick creams'];
      break;
    
    case 'Combination':
      ingredients.beneficial = ['Hyaluronic Acid', 'Niacinamide', 'Vitamin C', 'Ceramides'];
      ingredients.avoid = ['Heavy oils on T-zone', 'Over-drying ingredients'];
      break;
    
    case 'Sensitive':
      ingredients.beneficial = ['Aloe Vera', 'Chamomile', 'Oatmeal', 'Hyaluronic Acid', 'Ceramides'];
      ingredients.avoid = ['Fragrances', 'Alcohol', 'Harsh acids', 'Essential oils'];
      break;
    
    case 'Normal':
      ingredients.beneficial = ['Vitamin C', 'Retinol', 'Hyaluronic Acid', 'Peptides', 'Antioxidants'];
      ingredients.avoid = ['Over-exfoliation', 'Too many active ingredients'];
      break;
  }

  // Add concern-specific ingredients
  if (concerns.includes('Acne/Breakouts')) {
    ingredients.beneficial.push('Benzoyl Peroxide', 'Azelaic Acid');
  }
  if (concerns.includes('Fine lines/Wrinkles')) {
    ingredients.beneficial.push('Retinol', 'Peptides', 'Vitamin C');
  }
  if (concerns.includes('Dark spots/Hyperpigmentation')) {
    ingredients.beneficial.push('Vitamin C', 'Arbutin', 'Kojic Acid');
  }
  if (concerns.includes('Dullness')) {
    ingredients.beneficial.push('Glycolic Acid', 'Vitamin C', 'Niacinamide');
  }

  // Remove ingredients based on allergies
  if (allergies !== 'None known') {
    ingredients.avoid.push(allergies);
    ingredients.beneficial = ingredients.beneficial.filter(ingredient => 
      !ingredient.toLowerCase().includes(allergies.toLowerCase())
    );
  }

  return ingredients;
};

// Generate lifestyle tips
const generateLifestyleTips = (lifestyle) => {
  const tips = [];

  if (lifestyle.stressLevel === 'High' || lifestyle.stressLevel === 'Very High') {
    tips.push('Incorporate stress-reduction techniques - meditation, yoga, or deep breathing');
  }

  if (lifestyle.sleepQuality === 'Poor' || lifestyle.sleepQuality === 'Fair') {
    tips.push('Aim for 7-9 hours of quality sleep - skin repairs itself during sleep');
  }

  if (lifestyle.sunExposure === 'High') {
    tips.push('Reapply sunscreen every 2 hours when outdoors');
  }

  if (lifestyle.exerciseFrequency === 'Daily' || lifestyle.exerciseFrequency === '3-4 times per week') {
    tips.push('Cleanse skin immediately after exercise to prevent breakouts');
  }

  // General tips
  tips.push('Stay hydrated - drink at least 8 glasses of water daily');
  tips.push('Eat a balanced diet rich in antioxidants and omega-3 fatty acids');

  return tips;
};

export {
  analyzeSkinCare,
  getSkinCareAnalysis,
  updateSkinCareAnalysis,
  deleteSkinCareAnalysis
};
