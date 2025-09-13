import express from 'express';
import CoFounder from '../models/CoFounder.js';
import User from '../models/User.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

// Get all co-founders with optional filtering
router.get('/', (req, res) => {
  try {
    const { 
      location, 
      availability, 
      experience, 
      skills, 
      limit = 20, 
      offset = 0 
    } = req.query;

    const filters = {
      location,
      availability,
      experience
    };

    let cofounders = cofounderService.getAll(filters);

    // Filter by skills if provided
    if (skills) {
      const requiredSkills = skills.split(',').map(s => s.trim());
      cofounders = cofounderService.findMatches(requiredSkills)
        .filter(c => c.matchScore > 0);
    }

    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedCofounders = cofounders.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        cofounders: paginatedCofounders,
        pagination: {
          total: cofounders.length,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: endIndex < cofounders.length
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get Co-founders Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to fetch co-founders'
    });
  }
});

// Find co-founder matches based on skills
router.post('/match', (req, res) => {
  try {
    const { requiredSkills, userSkills = [], idea } = req.body;
    
    if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Required skills array is required and cannot be empty'
      });
    }

    const matches = cofounderService.findMatches(requiredSkills, userSkills);
    
    // Get skills suggestions if idea is provided
    let skillsSuggestions = [];
    if (idea) {
      skillsSuggestions = cofounderService.getSkillsSuggestions(idea);
    }

    res.json({
      success: true,
      data: {
        matches,
        skillsSuggestions,
        totalMatches: matches.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Co-founder Matching Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to find co-founder matches'
    });
  }
});

// Get co-founder by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const cofounder = cofounderService.getById(id);
    
    if (!cofounder) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Co-founder not found'
      });
    }

    res.json({
      success: true,
      data: cofounder,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get Co-founder Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to fetch co-founder details'
    });
  }
});

// Get skills suggestions based on idea
router.post('/skills-suggestions', (req, res) => {
  try {
    const { idea } = req.body;
    
    if (!idea || idea.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Idea is required for skills suggestions'
      });
    }

    const suggestions = cofounderService.getSkillsSuggestions(idea);

    res.json({
      success: true,
      data: {
        suggestions,
        totalSuggestions: suggestions.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Skills Suggestions Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate skills suggestions'
    });
  }
});

// Create a new co-founder profile (for demo purposes)
router.post('/', (req, res) => {
  try {
    const {
      name,
      title,
      location,
      experience,
      skills,
      availability,
      bio,
      education,
      lookingFor
    } = req.body;

    // Basic validation
    if (!name || !title || !skills || !Array.isArray(skills)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Name, title, and skills are required'
      });
    }

    // In a real app, this would save to a database
    const newCofounder = {
      id: Date.now(), // Simple ID generation for demo
      name,
      title,
      location: location || 'Not specified',
      experience: experience || 'Not specified',
      skills,
      availability: availability || 'Not specified',
      bio: bio || 'No bio provided',
      education: education || 'Not specified',
      lookingFor: lookingFor || 'Open to opportunities',
      matchScore: 0,
      image: 'https://via.placeholder.com/150'
    };

    res.status(201).json({
      success: true,
      data: newCofounder,
      message: 'Co-founder profile created successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Create Co-founder Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to create co-founder profile'
    });
  }
});

export default router;
