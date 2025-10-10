import mongoose from 'mongoose';

const skinCareSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Basic Information
  basicInfo: {
    ageRange: {
      type: String,
      enum: ['Under 18', '18-25', '26-35', '36-45', '46-55', '55+'],
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      required: true
    }
  },
  // Skin Type
  skinType: {
    type: {
      type: String,
      enum: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'],
      required: true
    },
    acneStatus: {
      type: String,
      enum: ['None', 'Mild', 'Moderate', 'Severe'],
      required: true
    }
  },
  // Skin Concerns
  skinConcerns: {
    mainConcerns: [{
      type: String,
      enum: ['Acne/Breakouts', 'Fine lines/Wrinkles', 'Dullness', 'Redness/Rosacea', 'Oily T-zone', 'Dark spots/Hyperpigmentation', 'Dark circles', 'Large pores', 'Dry patches', 'Sensitivity/Irritation']
    }],
    allergies: {
      type: String,
      enum: ['Fragrances', 'Parabens', 'Alpha Hydroxy Acids', 'Essential oils', 'None known', 'Sulfates', 'Retinoids', 'Beta Hydroxy Acids', 'Alcohol'],
      required: true
    }
  },
  // Lifestyle Factors
  lifestyle: {
    sunExposure: {
      type: String,
      enum: ['Minimal (indoors most of the day)', 'Moderate (1-2 hours outdoors)', 'High (3+ hours outdoors)'],
      required: true
    },
    exerciseFrequency: {
      type: String,
      enum: ['Rarely', '1-2 times per week', '3-4 times per week', 'Daily'],
      required: true
    },
    stressLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Very High'],
      required: true
    },
    sleepQuality: {
      type: String,
      enum: ['Poor', 'Fair', 'Good', 'Excellent'],
      required: true
    }
  },
  // Analysis Results
  analysis: {
    skinProfile: {
      skinType: String,
      primaryConcerns: [String],
      keyFactors: {
        age: String,
        sunExposure: String,
        stressLevel: String,
        sleepQuality: String
      }
    },
    morningRoutine: [String],
    eveningRoutine: [String],
    beneficialIngredients: [String],
    ingredientsToAvoid: [String],
    weeklyTreatments: [String],
    lifestyleTips: [String]
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
skinCareSchema.index({ userId: 1 });

const SkinCare = mongoose.model('SkinCare', skinCareSchema);

export default SkinCare;
