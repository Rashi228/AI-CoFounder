import express from 'express';
import aiService from '../services/aiService.js';
import BusinessPlan from '../models/BusinessPlan.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

// Generate business plan from idea
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { 
      idea, 
      apiProvider = 'gemini',
      industry,
      stage,
      challenge,
      inputMethod,
      hasImage
    } = req.body;
    const userId = req.userId;
    
    if (!idea || idea.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Idea is required and cannot be empty'
      });
    }

    if (idea.length > 1000) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Idea is too long. Please keep it under 1000 characters'
      });
    }

    // Create enhanced idea context with additional information
    let enhancedIdea = idea;
    if (industry || stage || challenge) {
      enhancedIdea += `\n\nAdditional Context:\n`;
      if (industry) enhancedIdea += `Industry: ${industry}\n`;
      if (stage) enhancedIdea += `Development Stage: ${stage}\n`;
      if (challenge) enhancedIdea += `Current Challenge: ${challenge}\n`;
      if (inputMethod) enhancedIdea += `Input Method: ${inputMethod}\n`;
      if (hasImage) enhancedIdea += `Includes visual reference\n`;
    }

    const businessPlanData = await aiService.generateBusinessPlan(enhancedIdea, apiProvider);
    
    // Save business plan to database with additional metadata
    const businessPlan = new BusinessPlan({
      userId,
      idea,
      industry,
      stage,
      challenge,
      inputMethod,
      hasImage,
      ...businessPlanData,
      status: 'completed'
    });

    await businessPlan.save();
    
    res.json({
      success: true,
      data: businessPlan,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Business Plan Generation Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate business plan'
    });
  }
});

// Get user's business plans
router.get('/plans', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { userId };
    if (status) {
      query.status = status;
    }
    
    const businessPlans = await BusinessPlan.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'firstName lastName email');
    
    const total = await BusinessPlan.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        businessPlans,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
    
  } catch (error) {
    console.error('Get Business Plans Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch business plans'
    });
  }
});

// Get specific business plan
router.get('/plans/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const businessPlan = await BusinessPlan.findOne({ _id: id, userId })
      .populate('userId', 'firstName lastName email');
    
    if (!businessPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business plan not found'
      });
    }
    
    res.json({
      success: true,
      data: businessPlan
    });
    
  } catch (error) {
    console.error('Get Business Plan Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch business plan'
    });
  }
});

// Update business plan
router.put('/plans/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updateData = req.body;
    
    const businessPlan = await BusinessPlan.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!businessPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business plan not found'
      });
    }
    
    res.json({
      success: true,
      data: businessPlan
    });
    
  } catch (error) {
    console.error('Update Business Plan Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update business plan'
    });
  }
});

// Delete business plan
router.delete('/plans/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const businessPlan = await BusinessPlan.findOneAndDelete({ _id: id, userId });
    
    if (!businessPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business plan not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Business plan deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete Business Plan Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete business plan'
    });
  }
});

// Generate validation content
router.post('/validation/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { idea } = req.body;
    
    if (!idea || idea.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Idea is required and cannot be empty'
      });
    }

    const validTypes = ['survey', 'landingPage', 'adCopy'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid validation type. Must be one of: survey, landingPage, adCopy'
      });
    }

    const validationContent = await aiService.generateValidationContent(idea, type);
    
    res.json({
      success: true,
      data: validationContent,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Validation Content Generation Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate validation content'
    });
  }
});

// Calculate financial projections
router.post('/financials', (req, res) => {
  try {
    const { 
      initialFunding = 10000, 
      growthRate = 20, 
      monthlyCosts = 5000,
      revenuePerUser = 10,
      initialUsers = 100
    } = req.body;

    const projections = [];
    let currentFunding = parseFloat(initialFunding);
    let userBase = parseFloat(initialUsers);
    const monthlyGrowthRate = parseFloat(growthRate) / 100;
    const monthlyCostsNum = parseFloat(monthlyCosts);
    const revenuePerUserNum = parseFloat(revenuePerUser);

    for (let month = 1; month <= 6; month++) {
      const revenue = userBase * revenuePerUserNum;
      const netProfit = revenue - monthlyCostsNum;
      currentFunding += netProfit;
      
      projections.push({
        month,
        users: Math.round(userBase),
        revenue: Math.round(revenue * 100) / 100,
        costs: monthlyCostsNum,
        netProfit: Math.round(netProfit * 100) / 100,
        runway: Math.round(currentFunding * 100) / 100
      });
      
      userBase *= (1 + monthlyGrowthRate);
    }

    const breakEvenMonth = projections.find(p => p.netProfit >= 0)?.month || null;
    const totalRevenue = projections.reduce((sum, p) => sum + p.revenue, 0);
    const totalCosts = projections.reduce((sum, p) => sum + p.costs, 0);

    res.json({
      success: true,
      data: {
        projections,
        summary: {
          breakEvenMonth,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalCosts: Math.round(totalCosts * 100) / 100,
          finalRunway: Math.round(currentFunding * 100) / 100
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Financial Projections Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to calculate financial projections'
    });
  }
});

// Simulate ad campaign
router.post('/ad-simulation', (req, res) => {
  try {
    const { budget = 500, keywords = [] } = req.body;
    
    // Mock data for simulation
    const avgCTR = 0.025; // 2.5% Click-Through Rate
    const avgCPC = 1.50;  // $1.50 Cost-Per-Click
    const budgetNum = parseFloat(budget);
    
    const clicks = budgetNum / avgCPC;
    const impressions = clicks / avgCTR;
    const estimatedLeads = clicks * 0.15; // 15% conversion rate
    
    res.json({
      success: true,
      data: {
        budget: budgetNum,
        impressions: Math.round(impressions),
        clicks: Math.round(clicks),
        leads: Math.round(estimatedLeads),
        metrics: {
          ctr: (avgCTR * 100).toFixed(2) + '%',
          cpc: '$' + avgCPC.toFixed(2),
          conversionRate: '15%'
        },
        keywords: keywords.length > 0 ? keywords : ['startup', 'innovation', 'business', 'technology', 'growth']
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ad Simulation Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to simulate ad campaign'
    });
  }
});

// Get dynamic form data (industries, stages, etc.)
router.get('/form-data', (req, res) => {
  try {
    const formData = {
      industries: [
        { value: 'technology', label: 'Technology' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'education', label: 'Education' },
        { value: 'finance', label: 'Finance' },
        { value: 'ecommerce', label: 'E-commerce' },
        { value: 'sustainability', label: 'Sustainability' },
        { value: 'food-beverage', label: 'Food & Beverage' },
        { value: 'transportation', label: 'Transportation' },
        { value: 'real-estate', label: 'Real Estate' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'sports-fitness', label: 'Sports & Fitness' },
        { value: 'travel-tourism', label: 'Travel & Tourism' },
        { value: 'other', label: 'Other' }
      ],
      stages: [
        { value: 'concept', label: 'Just an idea' },
        { value: 'prototype', label: 'Have a prototype' },
        { value: 'mvp', label: 'Have an MVP' },
        { value: 'early-users', label: 'Have early users' },
        { value: 'revenue', label: 'Generating revenue' },
        { value: 'scaling', label: 'Scaling up' }
      ],
      challenges: [
        'Finding co-founders',
        'Market validation',
        'Funding',
        'Technical development',
        'User acquisition',
        'Product-market fit',
        'Team building',
        'Legal and compliance',
        'Marketing and branding',
        'Operations and logistics'
      ]
    };
    
    res.json({
      success: true,
      data: formData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Form Data Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch form data'
    });
  }
});

// Save business plan progress
router.post('/save-progress', verifyToken, async (req, res) => {
  try {
    const { businessPlanId, section, data } = req.body;
    const userId = req.userId;
    
    if (!businessPlanId || !section || !data) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'businessPlanId, section, and data are required'
      });
    }

    const businessPlan = await BusinessPlan.findOneAndUpdate(
      { _id: businessPlanId, userId },
      { 
        [`${section}Data`]: data,
        lastUpdated: new Date()
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
      message: 'Progress saved successfully'
    });
    
  } catch (error) {
    console.error('Save Progress Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to save progress'
    });
  }
});

// Generate financial projections
router.post('/financial-projections', verifyToken, async (req, res) => {
  try {
    const { 
      businessPlanId,
      initialFunding = 10000, 
      growthRate = 20, 
      monthlyCosts = 5000,
      revenuePerUser = 10,
      initialUsers = 100,
      scenario = 'realistic'
    } = req.body;
    const userId = req.userId;

    // Get business plan to use AI-generated data
    const businessPlan = await BusinessPlan.findOne({ _id: businessPlanId, userId });
    if (!businessPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business plan not found'
      });
    }

    // Generate projections based on business plan data
    const projections = generateFinancialProjections({
      initialFunding: parseFloat(initialFunding),
      growthRate: parseFloat(growthRate),
      monthlyCosts: parseFloat(monthlyCosts),
      revenuePerUser: parseFloat(revenuePerUser),
      initialUsers: parseFloat(initialUsers),
      scenario,
      businessPlan
    });

    // Save projections to business plan
    businessPlan.financialProjections = projections;
    await businessPlan.save();
    
    res.json({
      success: true,
      data: projections,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Financial Projections Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate financial projections'
    });
  }
});

// Generate market research data
router.post('/market-research', verifyToken, async (req, res) => {
  try {
    const { businessPlanId } = req.body;
    const userId = req.userId;

    const businessPlan = await BusinessPlan.findOne({ _id: businessPlanId, userId });
    if (!businessPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business plan not found'
      });
    }

    // Generate market research based on business plan
    const marketResearch = generateMarketResearch(businessPlan);

    // Save to business plan
    businessPlan.marketResearchData = marketResearch;
    await businessPlan.save();
    
    res.json({
      success: true,
      data: marketResearch,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Market Research Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate market research'
    });
  }
});

// Export business plan as PDF/Report
router.post('/export', verifyToken, async (req, res) => {
  try {
    const { businessPlanId, format = 'pdf' } = req.body;
    const userId = req.userId;

    const businessPlan = await BusinessPlan.findOne({ _id: businessPlanId, userId });
    if (!businessPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Business plan not found'
      });
    }

    // Generate export data
    const exportData = generateExportData(businessPlan, format);
    
    res.json({
      success: true,
      data: exportData,
      message: `Business plan exported as ${format.toUpperCase()}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to export business plan'
    });
  }
});

// Generate pitch deck
router.post('/pitch-deck', verifyToken, async (req, res) => {
  try {
    const { businessPlanId, style = 'modern', customMessage } = req.body;
    
    console.log('Pitch deck generation request:', { businessPlanId, style, customMessage, userId: req.userId });
    
    if (!businessPlanId) {
      return res.status(400).json({ message: 'Business plan ID is required' });
    }

    const businessPlan = await BusinessPlan.findOne({ 
      _id: businessPlanId, 
      userId: req.userId 
    });

    if (!businessPlan) {
      console.log('Business plan not found:', businessPlanId);
      return res.status(404).json({ message: 'Business plan not found' });
    }

    console.log('Business plan found:', businessPlan.idea);
    
    const pitchDeck = await generatePitchDeck(businessPlan, style, customMessage);
    console.log('Pitch deck generated with', pitchDeck.slides.length, 'slides');
    
    // Save pitch deck to business plan
    businessPlan.pitchDeck = pitchDeck;
    businessPlan.pitchDeckGeneratedAt = new Date();
    await businessPlan.save();
    
    console.log('Pitch deck saved to database');
    
    res.json({
      success: true,
      data: pitchDeck,
      message: 'Pitch deck generated successfully'
    });
  } catch (error) {
    console.error('Pitch deck generation error:', error);
    res.status(500).json({ message: `Failed to generate pitch deck: ${error.message}` });
  }
});

// Update pitch deck slide
router.put('/pitch-deck/:businessPlanId/slide/:slideId', verifyToken, async (req, res) => {
  try {
    const { businessPlanId, slideId } = req.params;
    const { content } = req.body;
    
    const businessPlan = await BusinessPlan.findOne({ 
      _id: businessPlanId, 
      userId: req.userId 
    });

    if (!businessPlan) {
      return res.status(404).json({ message: 'Business plan not found' });
    }

    if (!businessPlan.pitchDeck) {
      return res.status(404).json({ message: 'Pitch deck not found' });
    }

    // Update the specific slide
    const slideIndex = businessPlan.pitchDeck.slides.findIndex(slide => slide.id === slideId);
    if (slideIndex === -1) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    businessPlan.pitchDeck.slides[slideIndex].content = { ...businessPlan.pitchDeck.slides[slideIndex].content, ...content };
    businessPlan.pitchDeck.lastModified = new Date();
    await businessPlan.save();
    
    res.json({
      success: true,
      data: businessPlan.pitchDeck.slides[slideIndex],
      message: 'Slide updated successfully'
    });
  } catch (error) {
    console.error('Slide update error:', error);
    res.status(500).json({ message: 'Failed to update slide' });
  }
});

// Share pitch deck
router.post('/pitch-deck/:businessPlanId/share', verifyToken, async (req, res) => {
  try {
    const { businessPlanId } = req.params;
    const { permissions = 'view' } = req.body;
    
    console.log('Share pitch deck request:', { businessPlanId, permissions, userId: req.userId });
    
    const businessPlan = await BusinessPlan.findOne({ 
      _id: businessPlanId, 
      userId: req.userId 
    });

    if (!businessPlan) {
      console.log('Business plan not found for sharing:', businessPlanId);
      return res.status(404).json({ message: 'Business plan not found' });
    }

    if (!businessPlan.pitchDeck) {
      console.log('Pitch deck not found for business plan:', businessPlanId);
      return res.status(404).json({ message: 'Pitch deck not found' });
    }

    // Generate shareable link
    const shareToken = require('crypto').randomBytes(32).toString('hex');
    const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pitch-deck/shared/${shareToken}`;
    
    console.log('Generated share URL:', shareUrl);
    
    // Save share token
    businessPlan.pitchDeck.shareToken = shareToken;
    businessPlan.pitchDeck.sharePermissions = permissions;
    businessPlan.pitchDeck.sharedAt = new Date();
    await businessPlan.save();
    
    console.log('Pitch deck shared successfully');
    
    res.json({
      success: true,
      data: {
        shareUrl,
        shareToken,
        permissions,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      message: 'Pitch deck shared successfully'
    });
  } catch (error) {
    console.error('Share error:', error);
    res.status(500).json({ message: `Failed to share pitch deck: ${error.message}` });
  }
});

// Get shared pitch deck
router.get('/pitch-deck/shared/:shareToken', async (req, res) => {
  try {
    const { shareToken } = req.params;
    
    const businessPlan = await BusinessPlan.findOne({ 
      'pitchDeck.shareToken': shareToken 
    });

    if (!businessPlan || !businessPlan.pitchDeck) {
      return res.status(404).json({ message: 'Shared pitch deck not found' });
    }

    // Check if share token is expired (30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (businessPlan.pitchDeck.sharedAt < thirtyDaysAgo) {
      return res.status(410).json({ message: 'Shared link has expired' });
    }

    res.json({
      success: true,
      data: {
        pitchDeck: businessPlan.pitchDeck,
        businessPlan: {
          idea: businessPlan.idea,
          companyName: businessPlan.pitchDeckSummary?.title || 'Startup'
        }
      },
      message: 'Shared pitch deck retrieved successfully'
    });
  } catch (error) {
    console.error('Get shared pitch deck error:', error);
    res.status(500).json({ message: 'Failed to retrieve shared pitch deck' });
  }
});

// Get dashboard data
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Get all business plans for the user
    const businessPlans = await BusinessPlan.find({ userId }).sort({ createdAt: -1 });
    
    // Calculate dashboard stats
    const stats = {
      ideasSubmitted: businessPlans.length,
      problemRefined: businessPlans.filter(bp => bp.problemStatement).length,
      marketResearch: businessPlans.filter(bp => bp.marketResearchData).length,
      businessModel: businessPlans.filter(bp => bp.leanCanvas).length,
      experiments: businessPlans.filter(bp => bp.validation).length,
      cofounders: 0, // This would come from cofounder matching data
      pitchDeck: businessPlans.filter(bp => bp.pitchDeckSummary).length
    };

    // Generate recent activity from business plans
    const recentActivity = businessPlans.slice(0, 5).map((bp, index) => ({
      id: bp._id,
      type: 'idea',
      title: bp.idea || 'Untitled Idea',
      date: formatTimeAgo(bp.createdAt),
      status: bp.status || 'completed'
    }));

    // Generate next steps based on current progress
    const nextSteps = generateNextSteps(businessPlans[0]);

    // Get current business plan for detailed stats
    const currentBusinessPlan = businessPlans[0];
    
    res.json({
      success: true,
      data: {
        stats,
        recentActivity,
        nextSteps,
        currentBusinessPlan: currentBusinessPlan ? {
          id: currentBusinessPlan._id,
          idea: currentBusinessPlan.idea,
          status: currentBusinessPlan.status,
          progress: calculateProgress(currentBusinessPlan),
          businessModel: currentBusinessPlan.leanCanvas?.revenueStreams?.[0] || 'TBD',
          marketScore: currentBusinessPlan.marketResearchData?.opportunityScore?.overall || 0
        } : null,
        totalBusinessPlans: businessPlans.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch dashboard data'
    });
  }
});

// Helper functions
function generateFinancialProjections({ initialFunding, growthRate, monthlyCosts, revenuePerUser, initialUsers, scenario, businessPlan }) {
  const industry = detectIndustryFromIdea(businessPlan?.idea || 'technology');
  
  // Industry-specific parameters
  const industryParams = getIndustryFinancialParams(industry);
  
  // Scenario configurations
  const scenarios = {
    conservative: { 
      multiplier: 0.7, 
      growthFactor: 0.8, 
      costFactor: 1.1,
      marketPenetration: 0.5
    },
    realistic: { 
      multiplier: 1.0, 
      growthFactor: 1.0, 
      costFactor: 1.0,
      marketPenetration: 1.0
    },
    optimistic: { 
      multiplier: 1.3, 
      growthFactor: 1.2, 
      costFactor: 0.9,
      marketPenetration: 1.5
    }
  };

  const config = scenarios[scenario] || scenarios.realistic;
  
  // Calculate dynamic parameters based on business plan and industry
  const adjustedGrowthRate = (growthRate || industryParams.defaultGrowthRate) * config.growthFactor;
  const adjustedRevenuePerUser = (revenuePerUser || industryParams.defaultARPU) * config.multiplier;
  const adjustedMonthlyCosts = (monthlyCosts || industryParams.defaultMonthlyCosts) * config.costFactor;
  
  // Calculate market potential
  const marketSize = industryParams.marketSize;
  const targetMarketShare = industryParams.targetMarketShare * config.marketPenetration;
  const maxUsers = Math.round((marketSize * targetMarketShare) / adjustedRevenuePerUser);

  const projections = [];
  let currentFunding = initialFunding || industryParams.defaultInitialFunding;
  let userBase = initialUsers || industryParams.defaultInitialUsers;
  const monthlyGrowthRate = adjustedGrowthRate / 100;
  const churnRate = industryParams.churnRate / 100;

  // Generate 3-year monthly projections
  for (let month = 1; month <= 36; month++) {
    // Apply growth with market saturation
    const growthFactor = Math.min(1 + monthlyGrowthRate, 1 + (monthlyGrowthRate * (1 - userBase / maxUsers)));
    userBase *= growthFactor;
    
    // Apply churn
    userBase *= (1 - churnRate);
    
    // Cap at market potential
    userBase = Math.min(userBase, maxUsers);
    
    // Calculate revenue with seasonality
    const seasonalityFactor = getSeasonalityFactor(month, industry);
    const monthlyRevenue = userBase * adjustedRevenuePerUser * seasonalityFactor;
    
    // Calculate costs with scaling
    const scalingFactor = Math.min(1 + (month * 0.02), 1.5); // Costs increase over time
    const monthlyCosts = adjustedMonthlyCosts * scalingFactor;
    
    const netProfit = monthlyRevenue - monthlyCosts;
    currentFunding += netProfit;
    
    projections.push({
      month,
      users: Math.round(userBase),
      revenue: Math.round(monthlyRevenue * 100) / 100,
      costs: Math.round(monthlyCosts * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      runway: Math.round(currentFunding * 100) / 100,
      marketShare: Math.round((userBase / maxUsers) * 100 * 100) / 100
    });
  }

  // Calculate key metrics
  const breakEvenMonth = projections.find(p => p.netProfit >= 0)?.month || null;
  const totalRevenue = projections.reduce((sum, p) => sum + p.revenue, 0);
  const totalCosts = projections.reduce((sum, p) => sum + p.costs, 0);
  const finalUsers = projections[projections.length - 1]?.users || 0;
  
  // Calculate funding requirements
  const fundingRequirements = calculateFundingRequirements(projections, industryParams);
  
  // Generate expense breakdown
  const expenseBreakdown = generateExpenseBreakdown(industry, scenario, totalCosts);
  
  // Generate revenue breakdown
  const revenueBreakdown = generateRevenueBreakdown(businessPlan, totalRevenue);

  return {
    projections: projections.filter((_, index) => index % 12 === 11), // Yearly data
    monthlyProjections: projections, // Full monthly data
    summary: {
      breakEvenMonth,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalCosts: Math.round(totalCosts * 100) / 100,
      finalRunway: Math.round(currentFunding * 100) / 100,
      finalUsers,
      maxMarketShare: Math.round((finalUsers / maxUsers) * 100 * 100) / 100,
      scenario,
      industry
    },
    metrics: {
      arpu: Math.round(adjustedRevenuePerUser * 100) / 100,
      churnRate: industryParams.churnRate,
      cac: industryParams.cac,
      ltvCac: Math.round((adjustedRevenuePerUser * 12) / industryParams.cac * 100) / 100,
      ltv: Math.round((adjustedRevenuePerUser * 12) * 100) / 100,
      grossMargin: Math.round(((adjustedRevenuePerUser - industryParams.costPerUser) / adjustedRevenuePerUser) * 100 * 100) / 100
    },
    fundingRequirements,
    expenseBreakdown,
    revenueBreakdown,
    marketAnalysis: {
      marketSize,
      targetMarketShare: Math.round(targetMarketShare * 100 * 100) / 100,
      maxUsers,
      industry
    }
  };
}

function generateMarketResearch(businessPlan) {
  const idea = businessPlan.idea || 'Your startup idea';
  const industry = detectIndustryFromIdea(idea);
  
  return {
    marketSize: {
      current: businessPlan.pitchDeckSummary?.marketSize || generateMarketSize(industry),
      projected: generateProjectedGrowth(industry),
      unit: 'USD',
      growth: generateGrowthRate(industry),
      cagr: generateCAGR(industry)
    },
    competitors: generateCompetitors(industry, businessPlan.marketResearch?.competitors || []),
    trends: generateMarketTrends(industry, businessPlan.marketResearch?.trends || []),
    customerSegments: generateCustomerSegments(industry, businessPlan.customerPersona),
    opportunityScore: generateOpportunityScore(industry),
    insights: generateMarketInsights(industry, businessPlan.leanCanvas),
    generatedAt: new Date().toISOString()
  };
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

function getIndustryFinancialParams(industry) {
  const params = {
    food: {
      marketSize: 2300000000, // $2.3B
      defaultGrowthRate: 15,
      defaultARPU: 25,
      defaultMonthlyCosts: 15000,
      defaultInitialFunding: 100000,
      defaultInitialUsers: 50,
      churnRate: 8,
      cac: 35,
      costPerUser: 8,
      targetMarketShare: 0.001 // 0.1%
    },
    healthcare: {
      marketSize: 4200000000000, // $4.2T
      defaultGrowthRate: 12,
      defaultARPU: 150,
      defaultMonthlyCosts: 25000,
      defaultInitialFunding: 200000,
      defaultInitialUsers: 25,
      churnRate: 5,
      cac: 75,
      costPerUser: 45,
      targetMarketShare: 0.0001 // 0.01%
    },
    education: {
      marketSize: 6300000000000, // $6.3T
      defaultGrowthRate: 18,
      defaultARPU: 45,
      defaultMonthlyCosts: 12000,
      defaultInitialFunding: 75000,
      defaultInitialUsers: 100,
      churnRate: 6,
      cac: 50,
      costPerUser: 15,
      targetMarketShare: 0.0005 // 0.05%
    },
    finance: {
      marketSize: 12600000000000, // $12.6T
      defaultGrowthRate: 20,
      defaultARPU: 80,
      defaultMonthlyCosts: 20000,
      defaultInitialFunding: 150000,
      defaultInitialUsers: 75,
      churnRate: 4,
      cac: 60,
      costPerUser: 20,
      targetMarketShare: 0.0001 // 0.01%
    },
    technology: {
      marketSize: 5000000000000, // $5T
      defaultGrowthRate: 25,
      defaultARPU: 30,
      defaultMonthlyCosts: 10000,
      defaultInitialFunding: 50000,
      defaultInitialUsers: 200,
      churnRate: 7,
      cac: 40,
      costPerUser: 10,
      targetMarketShare: 0.001 // 0.1%
    },
    transportation: {
      marketSize: 800000000000, // $800B
      defaultGrowthRate: 16,
      defaultARPU: 60,
      defaultMonthlyCosts: 18000,
      defaultInitialFunding: 120000,
      defaultInitialUsers: 80,
      churnRate: 6,
      cac: 55,
      costPerUser: 25,
      targetMarketShare: 0.0005 // 0.05%
    }
  };
  
  return params[industry] || params.technology;
}

function getSeasonalityFactor(month, industry) {
  const seasonality = {
    food: [0.8, 0.7, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8], // Higher in summer
    healthcare: [1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.2], // Higher in winter
    education: [0.3, 0.3, 1.2, 1.0, 1.0, 0.8, 0.2, 0.2, 1.2, 1.0, 1.0, 0.8], // School year cycles
    finance: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], // No seasonality
    technology: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], // No seasonality
    transportation: [0.9, 0.8, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 1.0, 0.9, 0.8] // Higher in summer
  };
  
  return seasonality[industry]?.[month - 1] || 1.0;
}

function calculateFundingRequirements(projections, industryParams) {
  const negativeMonths = projections.filter(p => p.netProfit < 0);
  const totalLoss = Math.abs(negativeMonths.reduce((sum, p) => sum + p.netProfit, 0));
  const runwayMonths = projections.findIndex(p => p.runway <= 0);
  
  return {
    seedRound: Math.max(totalLoss * 1.5, industryParams.defaultInitialFunding),
    seriesA: Math.max(totalLoss * 3, industryParams.defaultInitialFunding * 5),
    runwayMonths: runwayMonths > 0 ? runwayMonths : 36,
    burnRate: Math.abs(negativeMonths.reduce((sum, p) => sum + p.netProfit, 0) / Math.max(negativeMonths.length, 1)),
    profitabilityMonth: projections.find(p => p.netProfit >= 0)?.month || null
  };
}

function generateExpenseBreakdown(industry, scenario, totalCosts) {
  const baseBreakdowns = {
    food: { development: 30, marketing: 35, operations: 25, admin: 10 },
    healthcare: { development: 40, marketing: 25, operations: 20, admin: 15 },
    education: { development: 35, marketing: 30, operations: 25, admin: 10 },
    finance: { development: 45, marketing: 20, operations: 20, admin: 15 },
    technology: { development: 40, marketing: 30, operations: 20, admin: 10 },
    transportation: { development: 35, marketing: 30, operations: 25, admin: 10 }
  };
  
  const scenarioMultipliers = {
    conservative: { development: 1.1, marketing: 0.9, operations: 1.0, admin: 1.0 },
    realistic: { development: 1.0, marketing: 1.0, operations: 1.0, admin: 1.0 },
    optimistic: { development: 0.9, marketing: 1.1, operations: 0.9, admin: 0.9 }
  };
  
  const base = baseBreakdowns[industry] || baseBreakdowns.technology;
  const multiplier = scenarioMultipliers[scenario] || scenarioMultipliers.realistic;
  
  return {
    development: Math.round(base.development * multiplier.development),
    marketing: Math.round(base.marketing * multiplier.marketing),
    operations: Math.round(base.operations * multiplier.operations),
    admin: Math.round(base.admin * multiplier.admin)
  };
}

function generateRevenueBreakdown(businessPlan, totalRevenue) {
  const revenueStreams = businessPlan?.leanCanvas?.revenueStreams || ['Subscription Revenue', 'Premium Features', 'Enterprise Sales'];
  
  const breakdowns = {
    'Subscription Revenue': 60,
    'Premium Features': 25,
    'Enterprise Sales': 15,
    'Transaction Fees': 40,
    'Advertising': 20,
    'Data Licensing': 10,
    'Consulting': 30
  };
  
  const result = {};
  let remainingPercentage = 100;
  
  revenueStreams.slice(0, 3).forEach((stream, index) => {
    const percentage = breakdowns[stream] || (remainingPercentage / (revenueStreams.length - index));
    result[stream] = Math.min(percentage, remainingPercentage);
    remainingPercentage -= result[stream];
  });
  
  return result;
}

function generateMarketSize(industry) {
  const sizes = {
    food: '$2.3B campus food market',
    healthcare: '$4.2T global healthcare market',
    education: '$6.3T global education market',
    finance: '$12.6T global fintech market',
    technology: '$5.2T global technology market',
    transportation: '$8.1T global transportation market'
  };
  return sizes[industry] || '$1.2B addressable market';
}

function generateProjectedGrowth(industry) {
  const growth = {
    food: '12% CAGR over next 5 years',
    healthcare: '8% CAGR over next 5 years',
    education: '15% CAGR over next 5 years',
    finance: '20% CAGR over next 5 years',
    technology: '18% CAGR over next 5 years',
    transportation: '10% CAGR over next 5 years'
  };
  return growth[industry] || '15% CAGR over next 5 years';
}

function generateGrowthRate(industry) {
  const rates = {
    food: '12%',
    healthcare: '8%',
    education: '15%',
    finance: '20%',
    technology: '18%',
    transportation: '10%'
  };
  return rates[industry] || '15%';
}

function generateCAGR(industry) {
  const cagr = {
    food: 12,
    healthcare: 8,
    education: 15,
    finance: 20,
    technology: 18,
    transportation: 10
  };
  return cagr[industry] || 15;
}

function generateCompetitors(industry, existingCompetitors) {
  const competitorTemplates = {
    food: [
      { name: 'Grubhub', analysis: 'Market leader in food delivery with strong restaurant network', strengths: ['Large restaurant network', 'Brand recognition', 'Established logistics'], weaknesses: ['High commission fees', 'Limited healthy options', 'Poor customer service'] },
      { name: 'Uber Eats', analysis: 'Tech-driven food delivery platform with global reach', strengths: ['Advanced technology', 'Global presence', 'Driver network'], weaknesses: ['High fees', 'Competition with drivers', 'Limited restaurant partnerships'] },
      { name: 'DoorDash', analysis: 'Fast-growing delivery platform with focus on local restaurants', strengths: ['Local restaurant focus', 'Fast delivery', 'Good customer experience'], weaknesses: ['High costs', 'Limited market share', 'Dependent on gig economy'] }
    ],
    healthcare: [
      { name: 'Teladoc', analysis: 'Leading telemedicine platform with comprehensive healthcare services', strengths: ['Comprehensive services', 'Insurance partnerships', 'Quality providers'], weaknesses: ['High costs', 'Limited availability', 'Technology barriers'] },
      { name: 'Amwell', analysis: 'Telehealth platform focusing on urgent care and primary care', strengths: ['Urgent care focus', 'Insurance coverage', 'Quality providers'], weaknesses: ['Limited specialty care', 'High costs', 'Technology requirements'] }
    ],
    education: [
      { name: 'Coursera', analysis: 'Online learning platform with university partnerships', strengths: ['University partnerships', 'Quality content', 'Certifications'], weaknesses: ['High costs', 'Limited interaction', 'Self-paced only'] },
      { name: 'Udemy', analysis: 'Marketplace for online courses with diverse content', strengths: ['Diverse content', 'Affordable pricing', 'Large selection'], weaknesses: ['Quality varies', 'No credentials', 'Limited support'] }
    ],
    finance: [
      { name: 'PayPal', analysis: 'Digital payment platform with global reach', strengths: ['Global reach', 'Security', 'Ease of use'], weaknesses: ['High fees', 'Limited features', 'Competition'] },
      { name: 'Stripe', analysis: 'Payment processing platform for online businesses', strengths: ['Developer-friendly', 'Global reach', 'Advanced features'], weaknesses: ['Complex setup', 'High fees', 'Limited support'] }
    ],
    technology: [
      { name: 'Microsoft', analysis: 'Technology giant with comprehensive software solutions', strengths: ['Comprehensive solutions', 'Enterprise focus', 'Strong ecosystem'], weaknesses: ['High costs', 'Complex licensing', 'Limited innovation'] },
      { name: 'Google', analysis: 'Tech leader with cloud and productivity solutions', strengths: ['Innovation', 'Cloud infrastructure', 'AI capabilities'], weaknesses: ['Privacy concerns', 'Complex pricing', 'Limited support'] }
    ],
    transportation: [
      { name: 'Uber', analysis: 'Ride-sharing platform with global presence', strengths: ['Global network', 'Technology platform', 'Diverse services'], weaknesses: ['Regulatory issues', 'Driver relations', 'High costs'] },
      { name: 'Lyft', analysis: 'Ride-sharing platform focusing on North American market', strengths: ['Driver-friendly', 'Safety focus', 'Local partnerships'], weaknesses: ['Limited global reach', 'High costs', 'Competition'] }
    ]
  };

  const templates = competitorTemplates[industry] || competitorTemplates.technology;
  
  // Use existing competitors if available, otherwise use templates
  if (existingCompetitors.length > 0) {
    return existingCompetitors.slice(0, 3).map((comp, index) => ({
      name: comp,
      analysis: templates[index]?.analysis || 'AI-generated competitive analysis',
      strengths: templates[index]?.strengths || ['Market presence', 'Brand recognition'],
      weaknesses: templates[index]?.weaknesses || ['High costs', 'Limited innovation']
    }));
  }
  
  return templates.slice(0, 3);
}

function generateMarketTrends(industry, existingTrends) {
  const trendTemplates = {
    food: [
      { name: 'Healthy Eating Focus', impact: 'High', description: 'Growing demand for nutritious, organic, and locally-sourced food options' },
      { name: 'Mobile Ordering', impact: 'High', description: 'Rapid adoption of mobile apps for food ordering and delivery' },
      { name: 'Sustainability', impact: 'Medium', description: 'Increasing focus on eco-friendly packaging and sustainable practices' }
    ],
    healthcare: [
      { name: 'Telemedicine Growth', impact: 'High', description: 'Accelerated adoption of remote healthcare services post-pandemic' },
      { name: 'AI in Healthcare', impact: 'High', description: 'Integration of artificial intelligence in diagnosis and treatment' },
      { name: 'Preventive Care', impact: 'Medium', description: 'Shift towards preventive healthcare and wellness programs' }
    ],
    education: [
      { name: 'Online Learning', impact: 'High', description: 'Permanent shift towards digital and hybrid learning models' },
      { name: 'Microlearning', impact: 'Medium', description: 'Growing preference for bite-sized, focused learning content' },
      { name: 'Skills-Based Education', impact: 'High', description: 'Focus on practical skills and job-ready competencies' }
    ],
    finance: [
      { name: 'Digital Payments', impact: 'High', description: 'Rapid adoption of digital and contactless payment methods' },
      { name: 'Cryptocurrency', impact: 'Medium', description: 'Growing acceptance and integration of digital currencies' },
      { name: 'Financial Inclusion', impact: 'High', description: 'Efforts to provide financial services to underserved populations' }
    ],
    technology: [
      { name: 'AI Integration', impact: 'High', description: 'Widespread adoption of artificial intelligence across industries' },
      { name: 'Cloud Computing', impact: 'High', description: 'Continued migration to cloud-based solutions and services' },
      { name: 'Cybersecurity', impact: 'High', description: 'Increased focus on data protection and security measures' }
    ],
    transportation: [
      { name: 'Electric Vehicles', impact: 'High', description: 'Rapid adoption of electric and hybrid vehicles' },
      { name: 'Autonomous Vehicles', impact: 'Medium', description: 'Development and testing of self-driving technology' },
      { name: 'Shared Mobility', impact: 'High', description: 'Growth in car-sharing, bike-sharing, and ride-sharing services' }
    ]
  };

  const templates = trendTemplates[industry] || trendTemplates.technology;
  
  if (existingTrends.length > 0) {
    return existingTrends.slice(0, 3).map((trend, index) => ({
      name: trend,
      impact: templates[index]?.impact || 'High',
      description: templates[index]?.description || 'AI-analyzed market trend'
    }));
  }
  
  return templates;
}

function generateCustomerSegments(industry, customerPersona) {
  const segmentTemplates = {
    food: [
      { segment: 'College Students', size: '20M+', willingness: 'Medium', painPoints: ['Budget constraints', 'Time limitations', 'Limited healthy options'] },
      { segment: 'Young Professionals', size: '15M+', willingness: 'High', painPoints: ['Busy schedules', 'Health consciousness', 'Convenience needs'] },
      { segment: 'Health-Conscious Consumers', size: '25M+', willingness: 'High', painPoints: ['Finding healthy options', 'Nutritional information', 'Quality assurance'] }
    ],
    healthcare: [
      { segment: 'Remote Workers', size: '40M+', willingness: 'High', painPoints: ['Limited time for appointments', 'Need for convenience', 'Cost concerns'] },
      { segment: 'Elderly Population', size: '50M+', willingness: 'Medium', painPoints: ['Technology barriers', 'Accessibility issues', 'Cost sensitivity'] },
      { segment: 'Chronic Disease Patients', size: '30M+', willingness: 'High', painPoints: ['Regular monitoring needs', 'Cost of care', 'Access to specialists'] }
    ],
    education: [
      { segment: 'Working Professionals', size: '60M+', willingness: 'High', painPoints: ['Time constraints', 'Career advancement', 'Skill gaps'] },
      { segment: 'Students', size: '20M+', willingness: 'Medium', painPoints: ['Cost of education', 'Relevance of content', 'Flexibility needs'] },
      { segment: 'Career Changers', size: '15M+', willingness: 'High', painPoints: ['Skill transition', 'Industry knowledge', 'Networking opportunities'] }
    ],
    finance: [
      { segment: 'Small Businesses', size: '30M+', willingness: 'High', painPoints: ['High transaction fees', 'Complex processes', 'Limited features'] },
      { segment: 'Freelancers', size: '20M+', willingness: 'High', painPoints: ['Irregular income', 'Tax complexity', 'Payment delays'] },
      { segment: 'Underbanked Individuals', size: '25M+', willingness: 'Medium', painPoints: ['Limited access', 'High fees', 'Complex requirements'] }
    ],
    technology: [
      { segment: 'Small Businesses', size: '30M+', willingness: 'High', painPoints: ['Limited IT resources', 'High costs', 'Complexity'] },
      { segment: 'Startups', size: '5M+', willingness: 'High', painPoints: ['Budget constraints', 'Scalability needs', 'Time to market'] },
      { segment: 'Enterprises', size: '10M+', willingness: 'Medium', painPoints: ['Integration challenges', 'Security concerns', 'Compliance requirements'] }
    ],
    transportation: [
      { segment: 'Urban Commuters', size: '50M+', willingness: 'High', painPoints: ['Traffic congestion', 'High costs', 'Limited options'] },
      { segment: 'Business Travelers', size: '20M+', willingness: 'High', painPoints: ['Reliability needs', 'Time efficiency', 'Cost management'] },
      { segment: 'Eco-Conscious Users', size: '15M+', willingness: 'High', painPoints: ['Environmental impact', 'Sustainability', 'Carbon footprint'] }
    ]
  };

  const templates = segmentTemplates[industry] || segmentTemplates.technology;
  
  // If we have customer persona data, use it to enhance the segments
  if (customerPersona) {
    return templates.map(segment => ({
      ...segment,
      painPoints: [...segment.painPoints, ...(customerPersona.painPoints || []).slice(0, 2)]
    }));
  }
  
  return templates;
}

function generateOpportunityScore(industry) {
  const scores = {
    food: { overall: 8.5, marketSize: 9, competition: 7, growth: 9 },
    healthcare: { overall: 8.8, marketSize: 9, competition: 6, growth: 8 },
    education: { overall: 8.2, marketSize: 8, competition: 8, growth: 9 },
    finance: { overall: 9.1, marketSize: 9, competition: 7, growth: 9 },
    technology: { overall: 8.7, marketSize: 9, competition: 8, growth: 9 },
    transportation: { overall: 8.3, marketSize: 8, competition: 7, growth: 8 }
  };
  return scores[industry] || { overall: 8.2, marketSize: 8, competition: 7, growth: 8 };
}

function generateMarketInsights(industry, leanCanvas) {
  const insights = {
    food: [
      'Large, growing market with high demand',
      'Underserved student segment with specific needs',
      'Moderate competition with room for innovation',
      'Strong growth trends in healthy eating'
    ],
    healthcare: [
      'Massive market with high growth potential',
      'Technology adoption accelerating post-pandemic',
      'Moderate competition in specialized areas',
      'Strong regulatory support for innovation'
    ],
    education: [
      'Large market with diverse needs',
      'Technology disruption creating opportunities',
      'High competition but room for specialization',
      'Strong growth in online learning adoption'
    ],
    finance: [
      'Huge market with high growth potential',
      'Technology disruption creating new opportunities',
      'Moderate competition in specialized areas',
      'Strong regulatory support for innovation'
    ],
    technology: [
      'Large, fast-growing market',
      'High demand for innovative solutions',
      'Competitive but with room for specialization',
      'Strong growth trends in digital transformation'
    ],
    transportation: [
      'Large market with evolving needs',
      'Technology disruption creating opportunities',
      'Moderate competition with room for innovation',
      'Strong growth in shared mobility'
    ]
  };
  return insights[industry] || insights.technology;
}

function generateExportData(businessPlan, format) {
  return {
    format,
    businessPlan: {
      idea: businessPlan.idea,
      problemStatement: businessPlan.problemStatement,
      customerPersona: businessPlan.customerPersona,
      leanCanvas: businessPlan.leanCanvas,
      pitchDeckSummary: businessPlan.pitchDeckSummary,
      marketResearch: businessPlan.marketResearch,
      validation: businessPlan.validation,
      financialProjections: businessPlan.financialProjections,
      marketResearchData: businessPlan.marketResearchData
    },
    exportUrl: `/api/ideas/download/${businessPlan._id}/${format}`,
    generatedAt: new Date().toISOString()
  };
}

function formatTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}

function calculateProgress(businessPlan) {
  if (!businessPlan) return 0;
  
  let completedSteps = 0;
  const totalSteps = 7;
  
  if (businessPlan.idea) completedSteps++;
  if (businessPlan.problemStatement) completedSteps++;
  if (businessPlan.marketResearchData) completedSteps++;
  if (businessPlan.leanCanvas) completedSteps++;
  if (businessPlan.validation) completedSteps++;
  if (businessPlan.financialProjections) completedSteps++;
  if (businessPlan.pitchDeckSummary) completedSteps++;
  
  return Math.round((completedSteps / totalSteps) * 100);
}

function generateNextSteps(businessPlan) {
  if (!businessPlan) {
    return [
      {
        id: 1,
        title: 'Submit Your First Idea',
        description: 'Start your startup journey by submitting your business idea',
        priority: 'high',
        dueDate: 'Today',
        progress: 0
      }
    ];
  }

  const nextSteps = [];
  
  if (!businessPlan.problemStatement) {
    nextSteps.push({
      id: 1,
      title: 'Refine Problem Statement',
      description: 'Define and validate your problem statement',
      priority: 'high',
      dueDate: 'In 2 days',
      progress: 0
    });
  }
  
  if (!businessPlan.marketResearchData) {
    nextSteps.push({
      id: 2,
      title: 'Complete Market Research',
      description: 'Analyze market size, competitors, and trends',
      priority: 'high',
      dueDate: 'In 1 week',
      progress: 0
    });
  }
  
  if (!businessPlan.leanCanvas) {
    nextSteps.push({
      id: 3,
      title: 'Define Business Model',
      description: 'Create your lean canvas and business model',
      priority: 'medium',
      dueDate: 'In 1 week',
      progress: 0
    });
  }
  
  if (!businessPlan.validation) {
    nextSteps.push({
      id: 4,
      title: 'Run Validation Experiments',
      description: 'Test your assumptions with real users',
      priority: 'medium',
      dueDate: 'In 2 weeks',
      progress: 0
    });
  }
  
  if (!businessPlan.financialProjections) {
    nextSteps.push({
      id: 5,
      title: 'Create Financial Projections',
      description: 'Build financial models and projections',
      priority: 'low',
      dueDate: 'In 2 weeks',
      progress: 0
    });
  }
  
  if (!businessPlan.pitchDeckSummary) {
    nextSteps.push({
      id: 6,
      title: 'Create Pitch Deck',
      description: 'Build your investor presentation',
      priority: 'low',
      dueDate: 'In 3 weeks',
      progress: 0
    });
  }
  
  return nextSteps.slice(0, 3); // Return top 3 next steps
}

// Generate comprehensive pitch deck
async function generatePitchDeck(businessPlan, style = 'modern', customMessage = '') {
  const idea = businessPlan.idea || 'Your startup idea';
  const industry = detectIndustryFromIdea(idea);
  
  // If custom message is provided, incorporate it into the content
  const messageContext = customMessage ? `\n\nCustom requirements: ${customMessage}` : '';
  
  // Generate AI-powered content for each slide
  const slides = [
    {
      id: 'title',
      title: 'Title Slide',
      content: {
        companyName: businessPlan.pitchDeckSummary?.title || generateCompanyName(idea),
        tagline: businessPlan.pitchDeckSummary?.tagline || generateTagline(idea, industry),
        presenter: 'Founder & CEO',
        date: new Date().getFullYear(),
        location: 'Global'
      }
    },
    {
      id: 'problem',
      title: 'Problem',
      content: {
        headline: businessPlan.pitchDeckSummary?.problem || generateProblemHeadline(idea, industry),
        description: (businessPlan.problemStatement || generateProblemDescription(idea, industry)) + messageContext,
        stats: generateProblemStats(industry),
        impact: generateProblemImpact(industry)
      }
    },
    {
      id: 'solution',
      title: 'Solution',
      content: {
        headline: businessPlan.pitchDeckSummary?.solution || generateSolutionHeadline(idea, industry),
        description: (businessPlan.pitchDeckSummary?.solution || generateSolutionDescription(idea, industry)) + messageContext,
        features: businessPlan.leanCanvas?.valuePropositions?.slice(0, 4) || generateSolutionFeatures(idea, industry),
        benefits: generateSolutionBenefits(industry)
      }
    },
    {
      id: 'market',
      title: 'Market',
      content: {
        headline: 'Market Opportunity',
        description: `The ${industry} market represents a massive opportunity with strong growth trends and increasing demand for innovative solutions.`,
        marketSize: businessPlan.pitchDeckSummary?.marketSize || generateMarketSize(industry),
        growth: '10% CAGR',
        segments: businessPlan.leanCanvas?.customerSegments || ['Enterprise', 'SMB', 'Consumer', 'Government'],
        trends: generateMarketTrends(industry, [])
      }
    },
    {
      id: 'business-model',
      title: 'Business Model',
      content: {
        headline: businessPlan.pitchDeckSummary?.businessModel || `${industry} Business Model`,
        description: `Our revenue model is designed for scalability and sustainability, with multiple revenue streams and strong unit economics.`,
        pricing: businessPlan.leanCanvas?.revenueStreams || ['Subscription', 'Transaction Fees', 'Licensing', 'Services'],
        revenue: 'Year 1: $500K | Year 2: $2M | Year 3: $8M',
        unitEconomics: 'LTV: $2,400 | CAC: $120 | LTV/CAC: 20x | Payback: 6 months'
      }
    },
    {
      id: 'traction',
      title: 'Traction',
      content: {
        headline: 'Early Traction & Validation',
        description: `We've achieved strong early traction with validated demand and growing user engagement.`,
        metrics: ['500+ beta users', '85% user satisfaction', '40% month-over-month growth', '3 pilot customers'],
        milestones: ['Product development completed', 'Beta testing launched', 'First paying customers', 'Series A funding secured'],
        partnerships: ['Strategic industry partnerships', 'Technology integrations', 'Channel partnerships', 'Academic collaborations']
      }
    },
    {
      id: 'competition',
      title: 'Competition',
      content: {
        headline: 'Competitive Landscape',
        description: `While competition exists, our unique approach and technology give us significant advantages.`,
        competitors: businessPlan.leanCanvas?.keyPartners || generateCompetitors(industry, []),
        advantage: `Our proprietary technology, deep industry expertise, and customer-first approach create sustainable competitive advantages.`,
        differentiation: `We differentiate through superior technology, better user experience, and proven results.`
      }
    },
    {
      id: 'team',
      title: 'Team',
      content: {
        headline: 'Team & Advisors',
        description: `Our team combines deep ${industry.toLowerCase()} expertise with proven technology and business experience.`,
        members: ['CEO - Former industry executive', 'CTO - Technology leader with 10+ years experience', 'Head of Product - Product management expert', 'Head of Sales - Sales leader with proven track record'],
        advisors: ['Industry veteran advisor', 'Technology expert advisor', 'Business development advisor', 'Financial advisor'],
        hiring: ['Engineering team expansion', 'Sales and marketing hires', 'Customer success team', 'Operations and support']
      }
    },
    {
      id: 'financials',
      title: 'Financial Projections',
      content: {
        headline: 'Financial Projections',
        description: `Our financial projections show strong growth potential with healthy unit economics and clear path to profitability.`,
        projections: ['Year 1: $500K revenue, $1.2M expenses', 'Year 2: $2M revenue, $2.5M expenses', 'Year 3: $8M revenue, $6M expenses', 'Break-even: Month 18'],
        unitEconomics: 'LTV: $2,400 | CAC: $120 | LTV/CAC: 20x | Payback: 6 months',
        assumptions: ['Customer acquisition cost: $120', 'Customer lifetime value: $2,400', 'Monthly churn rate: 5%', 'Gross margin: 80%']
      }
    },
    {
      id: 'funding',
      title: 'Funding Ask',
      content: {
        headline: businessPlan.pitchDeckSummary?.theAsk || '$2M Series A Funding',
        description: `We're seeking $2M in Series A funding to accelerate growth and capture market opportunity.`,
        useOfFunds: ['40% - Product development', '30% - Sales and marketing', '20% - Team expansion', '10% - Operations and infrastructure'],
        milestones: ['Scale to 10,000 users', 'Achieve $1M ARR', 'Expand to 3 new markets', 'Build strategic partnerships'],
        timeline: '18-month runway with clear milestones and metrics for Series B.'
      }
    }
  ];

  return {
    id: `pitch-deck-${Date.now()}`,
    title: businessPlan.pitchDeckSummary?.title || generateCompanyName(idea),
    style,
    slides,
    generatedAt: new Date(),
    lastModified: new Date(),
    version: '1.0',
    metadata: {
      industry,
      idea,
      businessPlanId: businessPlan._id,
      totalSlides: slides.length
    }
  };
}

// Helper functions for generating pitch deck content
function generateCompanyName(idea) {
  const words = idea.toLowerCase().split(' ').slice(0, 2);
  const suffixes = ['Tech', 'Solutions', 'Labs', 'Innovations', 'Systems', 'Platform'];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('') + suffix;
}

function generateTagline(idea, industry) {
  const taglines = {
    technology: ['Innovating the Future', 'Technology That Matters', 'Building Tomorrow Today'],
    healthcare: ['Transforming Healthcare', 'Better Health for Everyone', 'Healthcare Innovation'],
    education: ['Empowering Learning', 'Education for All', 'Learning Reimagined'],
    finance: ['Financial Innovation', 'Banking the Future', 'Smart Finance Solutions'],
    food: ['Fresh Ideas, Better Food', 'Food Innovation', 'Nourishing Communities'],
    transportation: ['Moving Forward', 'Smart Transportation', 'Connected Mobility']
  };
  const options = taglines[industry] || taglines.technology;
  return options[Math.floor(Math.random() * options.length)];
}

function generateProblemHeadline(idea, industry) {
  const headlines = {
    technology: 'The Problem with Current Technology Solutions',
    healthcare: 'Healthcare Access and Quality Challenges',
    education: 'Education Gaps and Learning Barriers',
    finance: 'Financial Services Need Modernization',
    food: 'Food Industry Inefficiencies',
    transportation: 'Transportation and Mobility Issues'
  };
  return headlines[industry] || headlines.technology;
}

function generateProblemDescription(idea, industry) {
  return `Current solutions in the ${industry} industry are inadequate, creating significant pain points for users and businesses. Our research shows that ${idea.toLowerCase()} addresses a critical gap in the market.`;
}

function generateProblemStats(industry) {
  const stats = {
    technology: ['$2.3T market with 15% annual growth', '73% of businesses struggle with digital transformation', '89% of users report poor user experience'],
    healthcare: ['$4.1T healthcare market globally', '60% of patients face access barriers', '45% of healthcare costs are administrative'],
    education: ['$6T global education market', '1.6B students affected by learning gaps', '67% of teachers need better tools'],
    finance: ['$12.6T global financial services market', '1.7B adults are unbanked', '78% of consumers want better digital banking'],
    food: ['$8.7T global food industry', '30% of food is wasted annually', '2B people face food insecurity'],
    transportation: ['$8.4T global transportation market', '1.3M traffic deaths annually', '40% of urban space is used for parking']
  };
  return stats[industry] || stats.technology;
}

function generateProblemImpact(industry) {
  return `This problem affects millions of users and costs the industry billions annually. Solving it represents a massive opportunity for innovation and growth.`;
}

function generateSolutionHeadline(idea, industry) {
  return `Our ${industry} Solution`;
}

function generateSolutionDescription(idea, industry) {
  return `We've developed an innovative ${industry.toLowerCase()} solution that addresses the core problems through cutting-edge technology and user-centered design.`;
}

function generateSolutionFeatures(idea, industry) {
  const features = {
    technology: ['AI-powered automation', 'Real-time analytics', 'Seamless integration', 'Scalable architecture'],
    healthcare: ['Telemedicine platform', 'AI diagnostics', 'Patient management', 'Secure data handling'],
    education: ['Personalized learning', 'Interactive content', 'Progress tracking', 'Collaborative tools'],
    finance: ['Digital banking', 'AI fraud detection', 'Mobile payments', 'Investment tools'],
    food: ['Supply chain optimization', 'Quality tracking', 'Waste reduction', 'Consumer insights'],
    transportation: ['Smart routing', 'Real-time tracking', 'Eco-friendly options', 'Integrated payments']
  };
  return features[industry] || features.technology;
}

function generateSolutionBenefits(industry) {
  return `Our solution delivers measurable improvements in efficiency, cost reduction, and user satisfaction, creating significant value for all stakeholders.`;
}


export default router;
