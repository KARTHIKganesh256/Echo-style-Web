import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { skinCareAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SkinCareResults from '../components/SkinCareResults';
import useAuthStore from '../store/useAuthStore';
import { supabase } from '../utils/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const SkinCarePage = () => {
  const { isAuthenticated, user, refreshSession } = useAuthStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [existingAnalysis, setExistingAnalysis] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [formData, setFormData] = useState({
    basicInfo: {
      ageRange: '',
      gender: ''
    },
    skinType: {
      type: '',
      acneStatus: ''
    },
    skinConcerns: {
      mainConcerns: [],
      allergies: ''
    },
    lifestyle: {
      sunExposure: '',
      exerciseFrequency: '',
      stressLevel: '',
      sleepQuality: ''
    }
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: '👤' },
    { id: 2, title: 'Skin Type', icon: '💧' },
    { id: 3, title: 'Skin Concerns', icon: '⚠️' },
    { id: 4, title: 'Lifestyle Factors', icon: '☀️' }
  ];

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      console.log('🔍 Checking authentication state...');
      console.log('isAuthenticated:', isAuthenticated);
      console.log('user:', user?.email);
      
      // Additional check with Supabase directly
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔍 Direct Supabase session check:', { 
          hasSession: !!session, 
          hasUser: !!session?.user, 
          error: error?.message 
        });
        
        if (session?.user) {
          console.log('✅ Supabase session confirmed:', session.user.email);
        }
      } catch (err) {
        console.error('❌ Supabase session check failed:', err);
      }
      
      setAuthLoading(false);
      
      // Only fetch analysis if authenticated
      if (isAuthenticated && user) {
        console.log('✅ User is authenticated, fetching analysis...');
        await fetchExistingAnalysis();
      } else {
        console.log('❌ User not authenticated yet');
      }
    };
    
    checkAuthAndFetch();
  }, [isAuthenticated, user]);

  const fetchExistingAnalysis = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching existing analysis for user:', user?.email);
      const response = await skinCareAPI.getSkinCareAnalysis();
      if (response.data) {
        console.log('✅ Existing analysis found');
        setExistingAnalysis(response.data);
        setShowResults(true);
      } else {
        console.log('ℹ️ No existing analysis found');
      }
    } catch (error) {
      console.log('ℹ️ No existing analysis found or error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleConcernToggle = (concern) => {
    setFormData(prev => ({
      ...prev,
      skinConcerns: {
        ...prev.skinConcerns,
        mainConcerns: prev.skinConcerns.mainConcerns.includes(concern)
          ? prev.skinConcerns.mainConcerns.filter(c => c !== concern)
          : [...prev.skinConcerns.mainConcerns, concern]
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.basicInfo.ageRange && formData.basicInfo.gender;
      case 2:
        return formData.skinType.type && formData.skinType.acneStatus;
      case 3:
        return formData.skinConcerns.mainConcerns.length > 0 && formData.skinConcerns.allergies;
      case 4:
        return formData.lifestyle.sunExposure && formData.lifestyle.exerciseFrequency && 
               formData.lifestyle.stressLevel && formData.lifestyle.sleepQuality;
      default:
        return false;
    }
  };

  const submitAnalysis = async () => {
    try {
      setLoading(true);
      console.log('🔍 Submitting analysis for user:', user?.email);
      
      // First try to refresh the session to ensure we have a valid token
      const sessionRefreshed = await refreshSession();
      if (!sessionRefreshed) {
        alert('Your session has expired. Please log in again to continue.');
        navigate('/login');
        return;
      }
      
      const response = await skinCareAPI.analyzeSkinCare(formData);
      console.log('✅ Analysis submitted successfully');
      setExistingAnalysis(response.data.analysis);
      setShowResults(true);
    } catch (error) {
      console.error('❌ Error submitting analysis:', error);
      
      // If session expired, redirect to login
      if (error.message.includes('Session expired') || error.message.includes('login')) {
        alert('Your session has expired. Please log in again to continue.');
        navigate('/login');
        return;
      }
      
      alert(`Error submitting analysis: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p>Please log in to access the skin care analysis.</p>
        </div>
      </div>
    );
  }

  if (loading && !existingAnalysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (showResults && existingAnalysis) {
    return (
      <SkinCareResults 
        analysis={existingAnalysis} 
        onStartNew={() => {
          setShowResults(false);
          setExistingAnalysis(null);
          setFormData({
            basicInfo: { ageRange: '', gender: '' },
            skinType: { type: '', acneStatus: '' },
            skinConcerns: { mainConcerns: [], allergies: '' },
            lifestyle: { sunExposure: '', exerciseFrequency: '', stressLevel: '', sleepQuality: '' }
          });
          setCurrentStep(1);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4 bg-pink-100 text-pink-600 hover:bg-pink-200">
            ✨ Skin Analysis Questionnaire
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Let's Understand Your Skin
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Answer a few questions to get personalized skincare recommendations
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Progress
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {currentStep} of 4
                  </span>
                </div>
                <Progress value={(currentStep / 4) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-12"
        >
          <Card className="p-2">
            <div className="flex gap-2">
              {steps.map((step) => (
                <Button
                  key={step.id}
                  variant={currentStep === step.id ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    currentStep === step.id
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'text-gray-500 hover:text-emerald-600'
                  }`}
                >
                  <span className="text-lg">{step.icon}</span>
                  <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-xl">
              <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <span className="text-2xl">👤</span>
                    <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
                  </div>

                  {/* Age Range */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      What's your age range?
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Under 18', '18-25', '26-35', '36-45', '46-55', '55+'].map((age) => (
                        <label
                          key={age}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            formData.basicInfo.ageRange === age
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="ageRange"
                            value={age}
                            checked={formData.basicInfo.ageRange === age}
                            onChange={(e) => handleInputChange('basicInfo', 'ageRange', e.target.value)}
                            className="sr-only"
                          />
                          <span className="font-medium">{age}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Gender</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Male', 'Female', 'Other', 'Prefer not to say'].map((gender) => (
                        <label
                          key={gender}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            formData.basicInfo.gender === gender
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.basicInfo.gender === gender}
                            onChange={(e) => handleInputChange('basicInfo', 'gender', e.target.value)}
                            className="sr-only"
                          />
                          <span className="font-medium">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <span className="text-2xl">💧</span>
                    <h2 className="text-2xl font-bold text-gray-800">Skin Type</h2>
                  </div>

                  {/* Skin Type */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      What best describes your skin type?
                    </h3>
                    <div className="space-y-4">
                      {[
                        { value: 'Oily', description: 'Shiny, greasy appearance, large pores, prone to acne' },
                        { value: 'Dry', description: 'Tight, flaky, rough texture, small pores' },
                        { value: 'Combination', description: 'Oily T-zone (forehead, nose, chin), dry cheeks' },
                        { value: 'Sensitive', description: 'Easily irritated, reactive to products, redness' },
                        { value: 'Normal', description: 'Balanced, not too oily or dry, few imperfections' }
                      ].map((type) => (
                        <label
                          key={type.value}
                          className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            formData.skinType.type === type.value
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="skinType"
                            value={type.value}
                            checked={formData.skinType.type === type.value}
                            onChange={(e) => handleInputChange('skinType', 'type', e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${
                              formData.skinType.type === type.value ? 'text-emerald-700' : 'text-gray-700'
                            }`}>
                              {type.value}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${
                            formData.skinType.type === type.value ? 'text-emerald-600' : 'text-gray-500'
                          }`}>
                            {type.description}
                          </p>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Acne Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Acne Status</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['None', 'Mild', 'Moderate', 'Severe'].map((status) => (
                        <label
                          key={status}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            formData.skinType.acneStatus === status
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="acneStatus"
                            value={status}
                            checked={formData.skinType.acneStatus === status}
                            onChange={(e) => handleInputChange('skinType', 'acneStatus', e.target.value)}
                            className="sr-only"
                          />
                          <span className="font-medium">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <span className="text-2xl">⚠️</span>
                    <h2 className="text-2xl font-bold text-gray-800">Skin Concerns</h2>
                  </div>

                  {/* Main Concerns */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      What are your main skin concerns? (Select all that apply)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Acne/Breakouts', 'Fine lines/Wrinkles', 'Dullness', 'Redness/Rosacea', 'Oily T-zone',
                        'Dark spots/Hyperpigmentation', 'Dark circles', 'Large pores', 'Dry patches', 'Sensitivity/Irritation'
                      ].map((concern) => (
                        <label
                          key={concern}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            formData.skinConcerns.mainConcerns.includes(concern)
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.skinConcerns.mainConcerns.includes(concern)}
                            onChange={() => handleConcernToggle(concern)}
                            className="sr-only"
                          />
                          <span className="font-medium">{concern}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Allergies */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Any known allergies or sensitivities?
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'Fragrances', 'Parabens', 'Alpha Hydroxy Acids', 'Essential oils',
                        'Sulfates', 'Retinoids', 'Beta Hydroxy Acids', 'Alcohol', 'None known'
                      ].map((allergy) => (
                        <label
                          key={allergy}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            formData.skinConcerns.allergies === allergy
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="allergies"
                            value={allergy}
                            checked={formData.skinConcerns.allergies === allergy}
                            onChange={(e) => handleInputChange('skinConcerns', 'allergies', e.target.value)}
                            className="sr-only"
                          />
                          <span className="font-medium">{allergy}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <span className="text-2xl">☀️</span>
                    <h2 className="text-2xl font-bold text-gray-800">Lifestyle Factors</h2>
                  </div>

                  {/* Sun Exposure */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      How much sun exposure do you get daily?
                    </h3>
                    <div className="space-y-3">
                      {[
                        'Minimal (indoors most of the day)',
                        'Moderate (1-2 hours outdoors)',
                        'High (3+ hours outdoors)'
                      ].map((exposure) => (
                        <label
                          key={exposure}
                          className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            formData.lifestyle.sunExposure === exposure
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="sunExposure"
                            value={exposure}
                            checked={formData.lifestyle.sunExposure === exposure}
                            onChange={(e) => handleInputChange('lifestyle', 'sunExposure', e.target.value)}
                            className="sr-only"
                          />
                          <span className="font-medium">{exposure}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Exercise Frequency */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Exercise frequency</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Rarely', '1-2 times per week', '3-4 times per week', 'Daily'].map((frequency) => (
                        <label
                          key={frequency}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            formData.lifestyle.exerciseFrequency === frequency
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="exerciseFrequency"
                            value={frequency}
                            checked={formData.lifestyle.exerciseFrequency === frequency}
                            onChange={(e) => handleInputChange('lifestyle', 'exerciseFrequency', e.target.value)}
                            className="sr-only"
                          />
                          <span className="font-medium">{frequency}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Stress Level */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Stress level</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Low', 'Moderate', 'High', 'Very High'].map((level) => (
                        <label
                          key={level}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            formData.lifestyle.stressLevel === level
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="stressLevel"
                            value={level}
                            checked={formData.lifestyle.stressLevel === level}
                            onChange={(e) => handleInputChange('lifestyle', 'stressLevel', e.target.value)}
                            className="sr-only"
                          />
                          <span className="font-medium">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sleep Quality */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Sleep quality</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Poor', 'Fair', 'Good', 'Excellent'].map((quality) => (
                        <label
                          key={quality}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            formData.lifestyle.sleepQuality === quality
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="sleepQuality"
                            value={quality}
                            checked={formData.lifestyle.sleepQuality === quality}
                            onChange={(e) => handleInputChange('lifestyle', 'sleepQuality', e.target.value)}
                            className="sr-only"
                          />
                          <span className="font-medium">{quality}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <Separator className="my-8" />
            <div className="flex justify-between">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <span>←</span>
                <span>Previous</span>
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  size="lg"
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600"
                >
                  <span>Next</span>
                  <span>→</span>
                </Button>
              ) : (
                <Button
                  onClick={submitAnalysis}
                  disabled={!canProceed() || loading}
                  size="lg"
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <span>Complete Analysis</span>
                      <span>→</span>
                    </>
                  )}
                </Button>
              )}
            </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SkinCarePage;
