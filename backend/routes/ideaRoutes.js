import express from 'express';
import aiService from '../services/aiService.js';
import BusinessPlan from '../models/BusinessPlan.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

// Generate business plan from idea
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { idea, apiProvider = 'gemini' } = req.body;
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

    const businessPlanData = await aiService.generateBusinessPlan(idea, apiProvider);
    
    // Save business plan to database
    const businessPlan = new BusinessPlan({
      userId,
      idea,
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

export default router;
