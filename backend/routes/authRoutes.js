import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authService from '../services/authService.js';
import mongoose from 'mongoose';

const router = express.Router();

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'acm-cofounder-secret', {
    expiresIn: '7d'
  });
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, university, major, interests, experience } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !university || !major) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    let result;

    if (isMongoConnected()) {
      // Use MongoDB
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        university,
        major,
        interests: interests || [],
        experience: experience || 'beginner'
      });

      await newUser.save();
      const token = generateToken(newUser._id);
      
      result = {
        success: true,
        message: 'User registered successfully',
        data: {
          user: newUser.toJSON(),
          token
        }
      };
    } else {
      // Use fallback service
      result = await authService.register({
        firstName,
        lastName,
        email,
        password,
        university,
        major,
        interests,
        experience
      });
    }
    
    res.status(201).json(result);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during registration'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    let result;

    if (isMongoConnected()) {
      // Use MongoDB
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id);
      
      result = {
        success: true,
        message: 'Login successful',
        data: {
          user: user.toJSON(),
          token
        }
      };
    } else {
      // Use fallback service
      result = await authService.login(email, password);
    }
    
    res.json(result);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during login'
    });
  }
});

// Demo login (for testing)
router.post('/demo-login', async (req, res) => {
  try {
    let result;

    if (isMongoConnected()) {
      // Use MongoDB
      let demoUser = await User.findOne({ email: 'demo@acmcofounder.com' });
      
      if (!demoUser) {
        demoUser = new User({
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@acmcofounder.com',
          password: 'demo123',
          university: 'Demo University',
          major: 'Computer Science',
          interests: ['Technology', 'AI/ML', 'Business'],
          experience: 'intermediate'
        });
        
        await demoUser.save();
      } else {
        demoUser.lastLogin = new Date();
        await demoUser.save();
      }

      const token = generateToken(demoUser._id);
      
      result = {
        success: true,
        message: 'Demo login successful',
        data: {
          user: demoUser.toJSON(),
          token
        }
      };
    } else {
      // Use fallback service
      result = await authService.demoLogin();
    }
    
    res.json(result);

  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during demo login'
    });
  }
});

// Verify token middleware
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'acm-cofounder-secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    let user;

    if (isMongoConnected()) {
      user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      user = user.toJSON();
    } else {
      user = await authService.getUserById(req.userId);
    }
    
    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Forgot password (placeholder)
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // In a real application, you would send an email here
    // For now, we'll just return a success message
    res.json({
      success: true,
      message: 'Password reset instructions have been sent to your email.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
