import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Try to verify as JWT token first
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        return next();
      } catch (jwtError) {
        // If JWT verification fails, try Supabase token
        // For Supabase, we'll decode the token without verification
        // and create a temporary user object
        const decoded = jwt.decode(token);
        if (decoded && decoded.sub) {
          // Create a temporary user object for Supabase users
          req.user = {
            _id: decoded.sub,
            email: decoded.email,
            name: decoded.user_metadata?.name || decoded.email,
            isSupabaseUser: true
          };
          return next();
        }
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
