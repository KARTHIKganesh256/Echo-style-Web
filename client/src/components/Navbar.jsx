import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white border-opacity-20"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-white font-display"
            >
              Echo<span className="gradient-text">Style</span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/analyze">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-white hover:text-purple-200 transition-colors text-sm"
                  >
                    Color Analysis
                  </motion.button>
                </Link>
                <Link to="/skin-care">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-white hover:text-purple-200 transition-colors text-sm"
                  >
                    Skin Care
                  </motion.button>
                </Link>
                <Link to="/upload">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-white hover:text-purple-200 transition-colors text-sm"
                  >
                    📸 Photo Analysis
                  </motion.button>
                </Link>
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-white hover:text-purple-200 transition-colors text-sm"
                  >
                    Products
                  </motion.button>
                </Link>
                <Link to="/photo-history">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-white hover:text-purple-200 transition-colors text-sm"
                  >
                    History
                  </motion.button>
                </Link>
                <Link to="/profile">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-white hover:text-purple-200 transition-colors text-sm"
                  >
                    Profile
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleLogout}
                  className="btn-primary bg-red-500 text-white btn-glow text-sm px-4 py-2"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-white hover:text-purple-200 transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="btn-primary bg-white text-purple-600 btn-glow"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
