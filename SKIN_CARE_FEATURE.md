# Skin Care Analysis Feature

## Overview
The Skin Care Analysis feature provides a comprehensive questionnaire-based system for personalized skincare recommendations. Users can answer questions about their skin type, concerns, and lifestyle to receive customized routines and product suggestions.

## Features

### Multi-Step Questionnaire
1. **Basic Information** - Age range and gender
2. **Skin Type** - Oily, Dry, Combination, Sensitive, or Normal + Acne status
3. **Skin Concerns** - Multiple selection of concerns and allergy information
4. **Lifestyle Factors** - Sun exposure, exercise, stress, and sleep quality

### Personalized Recommendations
- **Skin Profile** - Summary of skin type and key factors
- **Morning & Evening Routines** - Step-by-step skincare routines
- **Ingredient Recommendations** - Beneficial ingredients and ingredients to avoid
- **Weekly Treatments** - Specialized treatments based on concerns
- **Lifestyle Tips** - Personalized advice based on lifestyle factors

## Backend API Endpoints

### POST `/api/skin-care/analyze`
Create a new skin care analysis
- **Body**: Questionnaire responses
- **Response**: Complete analysis with recommendations

### GET `/api/skin-care/analysis`
Get user's existing skin care analysis
- **Response**: User's skin care analysis or 404 if not found

### PUT `/api/skin-care/analysis`
Update user's skin care analysis
- **Body**: Updated questionnaire responses
- **Response**: Updated analysis

### DELETE `/api/skin-care/analysis`
Delete user's skin care analysis
- **Response**: Success message

## Database Schema

### SkinCare Model
```javascript
{
  userId: ObjectId (ref: User),
  basicInfo: {
    ageRange: String,
    gender: String
  },
  skinType: {
    type: String,
    acneStatus: String
  },
  skinConcerns: {
    mainConcerns: [String],
    allergies: String
  },
  lifestyle: {
    sunExposure: String,
    exerciseFrequency: String,
    stressLevel: String,
    sleepQuality: String
  },
  analysis: {
    skinProfile: Object,
    morningRoutine: [String],
    eveningRoutine: [String],
    beneficialIngredients: [String],
    ingredientsToAvoid: [String],
    weeklyTreatments: [String],
    lifestyleTips: [String]
  },
  completedAt: Date,
  timestamps: true
}
```

## Frontend Components

### SkinCarePage
Main page component with:
- Multi-step form with progress indicator
- Form validation and navigation
- API integration for data persistence
- Results display integration

### SkinCareResults
Results display component with:
- Animated card layout
- Comprehensive recommendation display
- Option to start new analysis
- Responsive design

## Recommendation Engine

The system uses a rule-based approach to generate recommendations:

### Skin Type-Based Routines
- **Dry Skin**: Hydrating cleansers, serums, and moisturizers
- **Oily Skin**: Foaming cleansers, niacinamide, and lightweight products
- **Combination**: Balanced approach with targeted treatments
- **Sensitive**: Hypoallergenic and calming ingredients
- **Normal**: Antioxidants and preventive care

### Concern-Specific Treatments
- **Acne**: Salicylic acid and benzoyl peroxide treatments
- **Aging**: Retinol and peptide serums
- **Hyperpigmentation**: Vitamin C and brightening agents
- **Dullness**: Exfoliants and vitamin C

### Lifestyle Integration
- **High Stress**: Calming treatments and stress-reduction tips
- **Poor Sleep**: Overnight repair products
- **High Sun Exposure**: Enhanced SPF recommendations
- **Frequent Exercise**: Post-workout cleansing routines

## Usage

1. Navigate to `/skin-care` (requires authentication)
2. Complete the 4-step questionnaire
3. Submit analysis to receive recommendations
4. View personalized results with routines and tips
5. Option to start new analysis anytime

## Integration

The skin care feature is fully integrated with:
- User authentication system
- Existing navigation
- Responsive design system
- Animation framework (Framer Motion)
- API utilities

## Future Enhancements

- Product recommendations based on analysis
- Progress tracking over time
- Photo-based skin analysis integration
- Seasonal routine adjustments
- Community features and sharing
