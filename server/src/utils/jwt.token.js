import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// Generate both tokens with user details
export const generateToken = (user) => {  // Accept full user object
  const payload = {
    id: user._id,       // Use MongoDB's _id field
    name: user.name,
    role: 'user'        // Hardcode role or use user.role if available
  };

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN
  });

  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {  // Fixed syntax
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  });

  return { accessToken, refreshToken };
};

// Verify access token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const decoded = verifyAccessToken(token);
    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role
    };
    next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.name === 'TokenExpiredError' 
        ? 'Token expired' 
        : 'Invalid token'
    });
  }
};
