import express from 'express';
import aiService from '../services/aiService.js';

const router = express.Router();

// Generate survey questions for idea validation
router.post('/survey', async (req, res) => {
  try {
    const { idea, targetAudience } = req.body;
    
    if (!idea || idea.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Idea is required for survey generation'
      });
    }

    const surveyContent = await aiService.generateValidationContent(idea, 'survey');
    
    // Add additional survey suggestions
    const additionalQuestions = [
      "How often do you currently face this problem?",
      "What solutions have you tried before?",
      "How much would you be willing to pay for a solution?",
      "What would make you choose this solution over alternatives?",
      "How would you prefer to be contacted about this solution?"
    ];

    res.json({
      success: true,
      data: {
        questions: surveyContent,
        additionalQuestions,
        surveyTools: [
          { name: 'Google Forms', url: 'https://forms.google.com', free: true },
          { name: 'Typeform', url: 'https://typeform.com', free: true },
          { name: 'SurveyMonkey', url: 'https://surveymonkey.com', free: true }
        ],
        targetAudience: targetAudience || 'General audience'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Survey Generation Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate survey questions'
    });
  }
});

// Generate landing page content
router.post('/landing-page', async (req, res) => {
  try {
    const { idea, valueProposition } = req.body;
    
    if (!idea || idea.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Idea is required for landing page generation'
      });
    }

    const landingPageContent = await aiService.generateValidationContent(idea, 'landingPage');
    
    // Add additional landing page elements
    const additionalElements = {
      features: [
        "Easy to use interface",
        "Quick setup process",
        "24/7 customer support",
        "Money-back guarantee"
      ],
      testimonials: [
        "This solution changed how I approach this problem!",
        "Finally, a tool that actually works for students.",
        "I wish I had found this sooner!"
      ],
      pricing: {
        free: "Free trial available",
        paid: "Starting at $9.99/month"
      }
    };

    res.json({
      success: true,
      data: {
        ...landingPageContent,
        additionalElements,
        tools: [
          { name: 'Unbounce', url: 'https://unbounce.com', free: false },
          { name: 'Leadpages', url: 'https://leadpages.com', free: false },
          { name: 'Carrd', url: 'https://carrd.co', free: true },
          { name: 'Landing Page Builder', url: 'https://landingpagebuilder.com', free: true }
        ]
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Landing Page Generation Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate landing page content'
    });
  }
});

// Generate ad campaign content
router.post('/ad-campaign', async (req, res) => {
  try {
    const { idea, budget = 500, platform = 'google' } = req.body;
    
    if (!idea || idea.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Idea is required for ad campaign generation'
      });
    }

    const adContent = await aiService.generateValidationContent(idea, 'adCopy');
    
    // Simulate ad performance based on budget
    const platforms = {
      google: {
        avgCPC: 1.50,
        avgCTR: 0.025,
        conversionRate: 0.15
      },
      facebook: {
        avgCPC: 0.80,
        avgCTR: 0.015,
        conversionRate: 0.12
      },
      instagram: {
        avgCPC: 0.60,
        avgCTR: 0.020,
        conversionRate: 0.18
      }
    };

    const platformData = platforms[platform] || platforms.google;
    const budgetNum = parseFloat(budget);
    
    const clicks = budgetNum / platformData.avgCPC;
    const impressions = clicks / platformData.avgCTR;
    const leads = clicks * platformData.conversionRate;

    res.json({
      success: true,
      data: {
        ...adContent,
        performance: {
          budget: budgetNum,
          platform,
          impressions: Math.round(impressions),
          clicks: Math.round(clicks),
          leads: Math.round(leads),
          ctr: (platformData.avgCTR * 100).toFixed(2) + '%',
          cpc: '$' + platformData.avgCPC.toFixed(2),
          conversionRate: (platformData.conversionRate * 100).toFixed(1) + '%'
        },
        platforms: Object.keys(platforms).map(name => ({
          name,
          ...platforms[name]
        }))
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Ad Campaign Generation Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate ad campaign content'
    });
  }
});

// Generate A/B test suggestions
router.post('/ab-test', (req, res) => {
  try {
    const { idea, element } = req.body;
    
    if (!idea || idea.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Idea is required for A/B test suggestions'
      });
    }

    const testSuggestions = {
      headlines: [
        `Solve ${idea.split(' ')[0]} problems instantly`,
        `The ${idea.split(' ')[0]} solution you've been waiting for`,
        `Transform your ${idea.split(' ')[0]} experience today`
      ],
      callToActions: [
        "Get Started Free",
        "Try It Now",
        "Learn More",
        "Sign Up Today",
        "Start Your Journey"
      ],
      pricing: [
        "Free to start",
        "No credit card required",
        "14-day free trial",
        "Cancel anytime"
      ],
      socialProof: [
        "Join 10,000+ satisfied users",
        "Trusted by students worldwide",
        "4.8/5 star rating",
        "Featured in top publications"
      ]
    };

    res.json({
      success: true,
      data: {
        idea,
        testSuggestions,
        testingTools: [
          { name: 'Google Optimize', url: 'https://optimize.google.com', free: true },
          { name: 'Optimizely', url: 'https://optimizely.com', free: false },
          { name: 'VWO', url: 'https://vwo.com', free: false },
          { name: 'Unbounce', url: 'https://unbounce.com', free: false }
        ],
        bestPractices: [
          "Test one element at a time",
          "Run tests for at least 2 weeks",
          "Ensure statistical significance",
          "Document all results",
          "Iterate based on findings"
        ]
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('A/B Test Generation Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate A/B test suggestions'
    });
  }
});

// Get validation experiment templates
router.get('/templates', (req, res) => {
  try {
    const templates = {
      customerInterviews: {
        title: "Customer Interview Template",
        questions: [
          "Tell me about your current process for [problem area]",
          "What's the biggest challenge you face with this?",
          "How do you currently solve this problem?",
          "What would an ideal solution look like to you?",
          "How much would you pay for a solution like this?"
        ],
        tips: [
          "Ask open-ended questions",
          "Listen more than you talk",
          "Ask follow-up questions",
          "Take detailed notes",
          "Thank them for their time"
        ]
      },
      landingPageTest: {
        title: "Landing Page Test Template",
        elements: [
          "Headline and subheadline",
          "Value proposition",
          "Call-to-action button",
          "Social proof",
          "Pricing information"
        ],
        metrics: [
          "Page views",
          "Time on page",
          "Bounce rate",
          "Conversion rate",
          "Email signups"
        ]
      },
      mvpTest: {
        title: "MVP Test Template",
        features: [
          "Core functionality only",
          "Simple user interface",
          "Basic user feedback",
          "Essential integrations"
        ],
        metrics: [
          "User engagement",
          "Feature usage",
          "User retention",
          "Feedback quality",
          "Bug reports"
        ]
      }
    };

    res.json({
      success: true,
      data: templates,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Templates Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to fetch validation templates'
    });
  }
});

export default router;
