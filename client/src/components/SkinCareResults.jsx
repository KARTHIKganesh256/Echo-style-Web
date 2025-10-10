import { motion } from 'framer-motion';

const SkinCareResults = ({ analysis, onStartNew }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Your Personalized Skin Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Based on your responses, here are your customized skincare recommendations
          </p>
          <button
            onClick={onStartNew}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg"
          >
            Start New Analysis
          </button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Your Skin Profile */}
          <motion.div variants={cardVariants} className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">👤</span>
                <h2 className="text-2xl font-bold text-gray-800">Your Skin Profile</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Skin Type:</span>
                      <span className="ml-2 inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {analysis.analysis.skinProfile.skinType}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Primary Concerns:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.analysis.skinProfile.primaryConcerns.map((concern, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {concern}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Factors</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{analysis.analysis.skinProfile.keyFactors.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sun exposure:</span>
                      <span className="font-medium">{analysis.analysis.skinProfile.keyFactors.sunExposure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stress level:</span>
                      <span className="font-medium">{analysis.analysis.skinProfile.keyFactors.stressLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sleep quality:</span>
                      <span className="font-medium">{analysis.analysis.skinProfile.keyFactors.sleepQuality}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Routines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Morning Routine */}
            <motion.div variants={cardVariants}>
              <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">☀️</span>
                  <h2 className="text-2xl font-bold text-gray-800">Morning Routine</h2>
                </div>
                <ol className="space-y-3">
                  {analysis.analysis.morningRoutine.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>

            {/* Evening Routine */}
            <motion.div variants={cardVariants}>
              <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">🌙</span>
                  <h2 className="text-2xl font-bold text-gray-800">Evening Routine</h2>
                </div>
                <ol className="space-y-3">
                  {analysis.analysis.eveningRoutine.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </div>

          {/* Ingredients */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Beneficial Ingredients */}
            <motion.div variants={cardVariants}>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">✅</span>
                  <h2 className="text-2xl font-bold text-gray-800">Beneficial Ingredients</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {analysis.analysis.beneficialIngredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Ingredients to Avoid */}
            <motion.div variants={cardVariants}>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">❌</span>
                  <h2 className="text-2xl font-bold text-gray-800">Ingredients to Avoid</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {analysis.analysis.ingredientsToAvoid.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Weekly Treatments and Lifestyle Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Treatments */}
            <motion.div variants={cardVariants}>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">⏰</span>
                  <h2 className="text-2xl font-bold text-gray-800">Weekly Treatments</h2>
                </div>
                <ul className="space-y-3">
                  {analysis.analysis.weeklyTreatments.map((treatment, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
                      <span className="text-gray-700">{treatment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Lifestyle Tips */}
            <motion.div variants={cardVariants}>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">💡</span>
                  <h2 className="text-2xl font-bold text-gray-800">Lifestyle Tips</h2>
                </div>
                <ul className="space-y-3">
                  {analysis.analysis.lifestyleTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-5 h-5 text-emerald-500 mt-0.5">✓</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkinCareResults;
