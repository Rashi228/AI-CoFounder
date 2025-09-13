import express from 'express';
import CoFounder from '../models/CoFounder.js';
import User from '../models/User.js';
import BusinessPlan from '../models/BusinessPlan.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

// Get all co-founder profiles with optional filtering
router.get('/', verifyToken, async (req, res) => {
  try {
    const { 
      location, 
      availability, 
      experience, 
      skills, 
      limit = 20, 
      offset = 0 
    } = req.query;

    // Build filter object
    const filters = {};
    if (location && location !== 'any') filters.location = location;
    if (availability && availability !== 'any') filters.availability = availability;
    if (experience && experience !== 'any') filters.experience = experience;

    // Get co-founders from database
    let query = CoFounder.find(filters);
    
    // Apply pagination
    const skip = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || 20;
    query = query.skip(skip).limit(limitNum);

    const cofounders = await query.exec();
    const total = await CoFounder.countDocuments(filters);

    // Filter by skills if provided
    let filteredCofounders = cofounders;
    if (skills) {
      const requiredSkills = skills.split(',').map(s => s.trim().toLowerCase());
      filteredCofounders = cofounders.filter(cofounder => 
        cofounder.skills.some(skill => 
          requiredSkills.some(reqSkill => 
            skill.toLowerCase().includes(reqSkill)
          )
        )
      );
    }

    res.json({
      success: true,
      data: {
        cofounders: filteredCofounders,
        pagination: {
          total: filteredCofounders.length,
          limit: limitNum,
          offset: skip,
          hasMore: skip + limitNum < total
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

// Find co-founder matches based on business plan
router.post('/match', verifyToken, async (req, res) => {
  try {
    const { businessPlanId } = req.body;
    const userId = req.userId;
    
    if (!businessPlanId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Business plan ID is required'
      });
    }

    // Get the business plan
    const businessPlan = await BusinessPlan.findOne({ _id: businessPlanId, userId });
    if (!businessPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business plan not found'
      });
    }

    // Generate matches based on business plan
    const matches = await generateCofounderMatches(businessPlan);
    
    res.json({
      success: true,
      data: {
        matches,
        totalMatches: matches.length,
        businessPlan: {
          id: businessPlan._id,
          idea: businessPlan.idea
        }
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
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const cofounder = await CoFounder.findById(id);
    
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

// Create a new co-founder profile
router.post('/', verifyToken, async (req, res) => {
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
      lookingFor,
      previousStartups,
      image
    } = req.body;

    // Basic validation
    if (!name || !title || !skills || !Array.isArray(skills)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Name, title, and skills are required'
      });
    }

    const newCofounder = new CoFounder({
      name,
      title,
      location: location || 'Remote',
      experience: experience || 'Not specified',
      skills,
      availability: availability || 'Part-time',
      bio: bio || 'No bio provided',
      education: education || 'Not specified',
      lookingFor: lookingFor || 'Open to opportunities',
      previousStartups: previousStartups || 0,
      image: image || 'https://via.placeholder.com/150',
      userId: req.userId,
      rating: 0, // Set initial rating to 0
      isActive: true,
      isVerified: false
    });

    await newCofounder.save();

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

// Update co-founder profile
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const cofounder = await CoFounder.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!cofounder) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Co-founder profile not found or you do not have permission to update it'
      });
    }

    res.json({
      success: true,
      data: cofounder,
      message: 'Co-founder profile updated successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Update Co-founder Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to update co-founder profile'
    });
  }
});

// Get user's co-founder profile
router.get('/profile/me', verifyToken, async (req, res) => {
  try {
    const cofounder = await CoFounder.findOne({ userId: req.userId });
    
    res.json({
      success: true,
      data: cofounder,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get My Profile Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to fetch your co-founder profile'
    });
  }
});

// Save co-founder matching progress
router.post('/save-progress', verifyToken, async (req, res) => {
  try {
    const { businessPlanId, matches, savedProfiles } = req.body;
    const userId = req.userId;

    if (!businessPlanId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Business plan ID is required'
      });
    }

    // Update business plan with co-founder matching data
    const businessPlan = await BusinessPlan.findOneAndUpdate(
      { _id: businessPlanId, userId },
      { 
        cofounderMatches: matches || [],
        savedCofounderProfiles: savedProfiles || [],
        cofounderMatchingCompleted: true,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!businessPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business plan not found'
      });
    }

    res.json({
      success: true,
      data: businessPlan,
      message: 'Co-founder matching progress saved successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Save Progress Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to save co-founder matching progress'
    });
  }
});

// Save a profile to favorites
router.post('/save-profile', verifyToken, async (req, res) => {
  try {
    const { profileId, businessPlanId } = req.body;
    const userId = req.userId;

    if (!profileId || !businessPlanId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Profile ID and Business Plan ID are required'
      });
    }

    // Get the business plan
    const businessPlan = await BusinessPlan.findOne({ _id: businessPlanId, userId });
    if (!businessPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business plan not found'
      });
    }

    // Get saved profiles array
    const savedProfiles = businessPlan.savedCofounderProfiles || [];
    
    // Check if profile is already saved
    const isAlreadySaved = savedProfiles.some(saved => 
      saved._id === profileId || saved.id === profileId
    );

    if (isAlreadySaved) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Profile is already saved to favorites'
      });
    }

    // Get the profile details (either from database or from matches)
    let profileToSave;
    
    // First try to find in database
    const dbProfile = await CoFounder.findById(profileId);
    if (dbProfile) {
      profileToSave = {
        _id: dbProfile._id,
        name: dbProfile.name,
        title: dbProfile.title,
        location: dbProfile.location,
        experience: dbProfile.experience,
        skills: dbProfile.skills,
        availability: dbProfile.availability,
        bio: dbProfile.bio,
        education: dbProfile.education,
        lookingFor: dbProfile.lookingFor,
        previousStartups: dbProfile.previousStartups,
        image: dbProfile.image,
        matchScore: 0, // Will be calculated when displaying
        savedAt: new Date(),
        isFromDatabase: true
      };
    } else {
      // If not in database, it's an AI-generated match
      const aiMatch = businessPlan.cofounderMatches?.find(match => 
        match._id === profileId || match.id === profileId
      );
      
      if (aiMatch) {
        profileToSave = {
          ...aiMatch,
          savedAt: new Date(),
          isFromDatabase: false
        };
      } else {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Profile not found'
        });
      }
    }

    // Add to saved profiles
    savedProfiles.push(profileToSave);

    // Update business plan
    const updatedBusinessPlan = await BusinessPlan.findOneAndUpdate(
      { _id: businessPlanId, userId },
      { 
        savedCofounderProfiles: savedProfiles,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      data: {
        savedProfile: profileToSave,
        totalSaved: savedProfiles.length
      },
      message: 'Profile saved to favorites successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Save Profile Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to save profile to favorites'
    });
  }
});

// Remove a profile from favorites
router.delete('/remove-profile', verifyToken, async (req, res) => {
  try {
    const { profileId, businessPlanId } = req.body;
    const userId = req.userId;

    if (!profileId || !businessPlanId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Profile ID and Business Plan ID are required'
      });
    }

    // Get the business plan
    const businessPlan = await BusinessPlan.findOne({ _id: businessPlanId, userId });
    if (!businessPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business plan not found'
      });
    }

    // Get saved profiles array
    const savedProfiles = businessPlan.savedCofounderProfiles || [];
    
    // Remove the profile
    const updatedSavedProfiles = savedProfiles.filter(saved => 
      saved._id !== profileId && saved.id !== profileId
    );

    // Update business plan
    const updatedBusinessPlan = await BusinessPlan.findOneAndUpdate(
      { _id: businessPlanId, userId },
      { 
        savedCofounderProfiles: updatedSavedProfiles,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      data: {
        removedProfileId: profileId,
        totalSaved: updatedSavedProfiles.length
      },
      message: 'Profile removed from favorites successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Remove Profile Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to remove profile from favorites'
    });
  }
});

// Get saved profiles (favorites)
router.get('/saved-profiles/:businessPlanId', verifyToken, async (req, res) => {
  try {
    const { businessPlanId } = req.params;
    const userId = req.userId;

    // Get the business plan
    const businessPlan = await BusinessPlan.findOne({ _id: businessPlanId, userId });
    if (!businessPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business plan not found'
      });
    }

    const savedProfiles = businessPlan.savedCofounderProfiles || [];

    res.json({
      success: true,
      data: {
        savedProfiles,
        totalSaved: savedProfiles.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get Saved Profiles Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to get saved profiles'
    });
  }
});

// Schedule a call with a co-founder
router.post('/schedule-call', verifyToken, async (req, res) => {
  try {
    const { profileId, businessPlanId, preferredDate, preferredTime, message } = req.body;
    const userId = req.userId;

    if (!profileId || !businessPlanId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Profile ID and Business Plan ID are required'
      });
    }

    // Get the business plan
    const businessPlan = await BusinessPlan.findOne({ _id: businessPlanId, userId });
    if (!businessPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business plan not found'
      });
    }

    // Create call request
    const callRequest = {
      profileId,
      businessPlanId,
      userId,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: preferredTime || '10:00 AM',
      message: message || 'I would like to schedule a call to discuss potential collaboration.',
      status: 'pending',
      createdAt: new Date()
    };

    // Add to business plan's call requests
    const callRequests = businessPlan.cofounderCallRequests || [];
    callRequests.push(callRequest);

    // Update business plan
    const updatedBusinessPlan = await BusinessPlan.findOneAndUpdate(
      { _id: businessPlanId, userId },
      { 
        cofounderCallRequests: callRequests,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      data: {
        callRequest,
        totalRequests: callRequests.length
      },
      message: 'Call request sent successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Schedule Call Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to schedule call'
    });
  }
});

// Helper function to generate co-founder matches based on business plan
async function generateCofounderMatches(businessPlan) {
  const idea = businessPlan.idea || 'Your startup idea';
  const industry = detectIndustryFromIdea(idea);
  
  // Get existing co-founder profiles from database
  const existingProfiles = await CoFounder.find({}).limit(10);
  
  // If we have existing profiles, use them with enhanced matching
  if (existingProfiles.length > 0) {
    return existingProfiles.map(profile => ({
      ...profile.toObject(),
      matchScore: calculateMatchScore(profile, businessPlan, industry)
    })).sort((a, b) => b.matchScore - a.matchScore);
  }
  
  // Generate AI-based matches if no existing profiles
  return generateAICofounderMatches(businessPlan, industry);
}

function detectIndustryFromIdea(idea) {
  const ideaLower = idea.toLowerCase();
  if (ideaLower.includes('food') || ideaLower.includes('restaurant') || ideaLower.includes('meal')) return 'food';
  if (ideaLower.includes('health') || ideaLower.includes('medical') || ideaLower.includes('fitness')) return 'healthcare';
  if (ideaLower.includes('education') || ideaLower.includes('student') || ideaLower.includes('learning')) return 'education';
  if (ideaLower.includes('finance') || ideaLower.includes('money') || ideaLower.includes('payment')) return 'finance';
  if (ideaLower.includes('tech') || ideaLower.includes('app') || ideaLower.includes('software')) return 'technology';
  if (ideaLower.includes('transport') || ideaLower.includes('delivery') || ideaLower.includes('logistics')) return 'transportation';
  return 'technology';
}

function calculateMatchScore(profile, businessPlan, industry) {
  let score = 0;
  
  // Base score
  score += 20;
  
  // Skills matching
  const requiredSkills = getRequiredSkillsForIndustry(industry);
  const matchingSkills = profile.skills.filter(skill => 
    requiredSkills.some(reqSkill => 
      skill.toLowerCase().includes(reqSkill.toLowerCase())
    )
  );
  score += (matchingSkills.length / requiredSkills.length) * 40;
  
  // Experience level
  if (profile.experience.includes('5+') || profile.experience.includes('6+')) score += 15;
  else if (profile.experience.includes('3+') || profile.experience.includes('4+')) score += 10;
  else if (profile.experience.includes('1+') || profile.experience.includes('2+')) score += 5;
  
  // Previous startups
  if (profile.previousStartups >= 3) score += 10;
  else if (profile.previousStartups >= 1) score += 5;
  
  // Availability
  if (profile.availability === 'Full-time') score += 10;
  else if (profile.availability === 'Part-time') score += 5;
  
  return Math.min(Math.round(score), 100);
}

function getRequiredSkillsForIndustry(industry) {
  const skillsMap = {
    food: ['business development', 'operations', 'marketing', 'technology', 'logistics'],
    healthcare: ['medical', 'technology', 'compliance', 'data analysis', 'user experience'],
    education: ['education', 'technology', 'content creation', 'user research', 'product management'],
    finance: ['finance', 'technology', 'compliance', 'data analysis', 'security'],
    technology: ['software development', 'product management', 'user experience', 'data analysis', 'cloud computing'],
    transportation: ['logistics', 'technology', 'operations', 'data analysis', 'user experience']
  };
  return skillsMap[industry] || skillsMap.technology;
}

function generateAICofounderMatches(businessPlan, industry) {
  const idea = businessPlan.idea || 'Your startup idea';
  const requiredSkills = getRequiredSkillsForIndustry(industry);
  
  const cofounderTypes = [
    {
      title: 'Technical Co-founder',
      skills: ['Full-Stack Development', 'AI/ML', 'Cloud Architecture', 'DevOps', 'Database Design'],
      experience: '5+ years',
      availability: 'Part-time',
      bio: `Perfect technical partner for your ${idea}. Specialized in building scalable solutions and technical architecture.`,
      education: 'Computer Science',
      lookingFor: `Technical co-founder for ${idea}`,
      previousStartups: 2
    },
    {
      title: 'Business Co-founder',
      skills: ['Business Strategy', 'Market Analysis', 'Operations', 'Sales', 'Partnerships'],
      experience: '7+ years',
      availability: 'Full-time',
      bio: `Ideal business partner for your ${idea}. Experienced in scaling startups and building strategic partnerships.`,
      education: 'Business Administration',
      lookingFor: `Business co-founder for ${idea}`,
      previousStartups: 3
    },
    {
      title: 'Design Co-founder',
      skills: ['UX/UI Design', 'User Research', 'Prototyping', 'Design Systems', 'Brand Design'],
      experience: '4+ years',
      availability: 'Part-time',
      bio: `Perfect design partner for your ${idea}. Specialized in creating user-centered experiences and building strong brands.`,
      education: 'Design',
      lookingFor: `Design co-founder for ${idea}`,
      previousStartups: 1
    },
    {
      title: 'Marketing Co-founder',
      skills: ['Digital Marketing', 'Growth Hacking', 'Content Strategy', 'SEO', 'Social Media'],
      experience: '6+ years',
      availability: 'Full-time',
      bio: `Marketing expert for your ${idea}. Experienced in building brand awareness and driving user acquisition.`,
      education: 'Marketing',
      lookingFor: `Marketing co-founder for ${idea}`,
      previousStartups: 2
    },
    {
      title: 'Data & Analytics Co-founder',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Statistics'],
      experience: '3+ years',
      availability: 'Part-time',
      bio: `Data expert for your ${idea}. Specialized in analytics, machine learning, and data-driven decision making.`,
      education: 'Data Science',
      lookingFor: `Data co-founder for ${idea}`,
      previousStartups: 1
    }
  ];
  
  return cofounderTypes.map((type, index) => ({
    _id: `ai-generated-${index + 1}`,
    name: `AI-Generated Match #${index + 1}`,
    title: type.title,
    location: 'Remote',
    experience: type.experience,
    skills: type.skills,
    availability: type.availability,
    matchScore: 95 - (index * 5), // Decreasing match scores
    bio: type.bio,
    previousStartups: type.previousStartups,
    education: type.education,
    lookingFor: type.lookingFor,
    image: 'https://via.placeholder.com/150',
    isAIGenerated: true,
    createdAt: new Date()
  }));
}

export default router;
