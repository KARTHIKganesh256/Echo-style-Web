import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'lg', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const containerClasses = size === 'lg' ? 'min-h-screen' : '';

  return (
    <div className={`flex items-center justify-center ${containerClasses} ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-white border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export default LoadingSpinner;
