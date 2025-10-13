import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { isAdmin } from '../utils/adminAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [isAuthenticated, user]);

  const checkAdminStatus = async () => {
    if (isAuthenticated && user) {
      const adminStatus = await isAdmin();
      setIsAdminUser(adminStatus);
    } else {
      setIsAdminUser(false);
    }
  };

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

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/analyze">
                    <Button variant="ghost" size="sm" className="text-white hover:text-purple-200 hover:bg-white/10">
                      🎨 Color Analysis
                    </Button>
                  </Link>
                  <Link to="/skin-care">
                    <Button variant="ghost" size="sm" className="text-white hover:text-purple-200 hover:bg-white/10">
                      ✨ Skin Care
                    </Button>
                  </Link>
                  <Link to="/upload">
                    <Button variant="ghost" size="sm" className="text-white hover:text-purple-200 hover:bg-white/10">
                      📸 Photo Analysis
                    </Button>
                  </Link>
                  <Link to="/products">
                    <Button variant="ghost" size="sm" className="text-white hover:text-purple-200 hover:bg-white/10">
                      🛍️ Products
                    </Button>
                  </Link>
                  <Link to="/photo-history">
                    <Button variant="ghost" size="sm" className="text-white hover:text-purple-200 hover:bg-white/10">
                      📚 History
                    </Button>
                  </Link>
                  <Link to="/orders">
                    <Button variant="ghost" size="sm" className="text-white hover:text-purple-200 hover:bg-white/10">
                      📦 Orders
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center gap-3">
                  <Link to="/cart">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button variant="ghost" size="sm" className="text-white hover:text-purple-200 hover:bg-white/10">
                        🛒 Cart
                      </Button>
                    </motion.div>
                  </Link>
                  
                  {/* Admin link - only visible to admin users */}
                  {isAdminUser && (
                    <Link to="/admin">
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button variant="ghost" size="sm" className="text-white hover:text-purple-200 hover:bg-white/10 border border-yellow-400/30">
                          👑 Admin
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                  
                  <Link to="/profile">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Avatar className="h-8 w-8 border-2 border-white/20">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                          {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  </Link>
                  
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      onClick={handleLogout}
                      variant="destructive" 
                      size="sm"
                      className="bg-red-500/90 hover:bg-red-600"
                    >
                      Logout
                    </Button>
                  </motion.div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-purple-200 hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    className="bg-white text-purple-600 hover:bg-purple-50 font-semibold"
                    size="sm"
                  >
                    Sign Up
                  </Button>
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
