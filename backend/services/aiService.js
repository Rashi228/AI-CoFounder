import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    this.geminiAPI = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    
    // Deep debugging for API key loading
    console.log('🔍 AIService Initialize Debug:');
    console.log('  - process.env keys:', Object.keys(process.env).filter(key => key.includes('GEMINI') || key.includes('GOOGLE')));
    console.log('  - GOOGLE_GEMINI_API_KEY exists:', !!process.env.GOOGLE_GEMINI_API_KEY);
    console.log('  - GOOGLE_GEMINI_API_KEY value:', process.env.GOOGLE_GEMINI_API_KEY ? `${process.env.GOOGLE_GEMINI_API_KEY.substring(0, 10)}...` : 'undefined');
    console.log('  - GOOGLE_GEMINI_API_KEY length:', process.env.GOOGLE_GEMINI_API_KEY ? process.env.GOOGLE_GEMINI_API_KEY.length : 0);
    console.log('  - NODE_ENV:', process.env.NODE_ENV);
    console.log('  - Current working directory:', process.cwd());
    
    this.geminiAPI = process.env.GOOGLE_GEMINI_API_KEY ? 
      new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY) : null;
    
    // Log API key status
    if (this.geminiAPI) {
      console.log('✅ Google Gemini API key configured - AI generation enabled');
      console.log('  - Gemini API instance created successfully');
    } else {
      console.log('⚠️  No Gemini API key configured - using enhanced mock data');
      console.log('  - Reason: process.env.GOOGLE_GEMINI_API_KEY is falsy');
    }
    
    this.initialized = true;
  }

  async generateBusinessPlan(idea, apiProvider = 'gemini') {
    // Initialize the service (lazy loading)
    this.initialize();
    
    const prompt = this.createBusinessPlanPrompt(idea);
    
    // Debug current state
    console.log('🔍 generateBusinessPlan Debug:');
    console.log('  - this.geminiAPI exists:', !!this.geminiAPI);
    console.log('  - process.env.GOOGLE_GEMINI_API_KEY exists:', !!process.env.GOOGLE_GEMINI_API_KEY);
    console.log('  - API Provider requested:', apiProvider);
    
    try {
      if (this.geminiAPI) {
        console.log('✅ Using Gemini API for business plan generation');
        return await this.callGeminiAPI(prompt);
      } else {
        console.log('⚠️  No Gemini API key configured, returning enhanced mock data for demonstration');
        console.log('📋 To get real AI-generated content, configure GOOGLE_GEMINI_API_KEY in your .env file');
        console.log('🔗 See API_SETUP_GUIDE.md for setup instructions');
        console.log('  - Current API key status:', process.env.GOOGLE_GEMINI_API_KEY ? 'Present but not working' : 'Missing');
        return this.getMockBusinessPlan(idea);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      console.log('  - Error details:', error.message);
      // Return mock data if API fails
      return this.getMockBusinessPlan(idea);
    }
  }

  createBusinessPlanPrompt(idea) {
    return `
You are "AI Co-Founder," an expert startup consultant for students. Your task is to refine a raw startup idea into a comprehensive and actionable plan.
For the idea: "${idea}", provide the following outputs in a single, clean JSON format. Do not include any text, notes, or markdown formatting like \`\`\`json before or after the JSON object.

The JSON object should have these exact keys:
1. "problemStatement": A concise, powerful paragraph detailing the core problem the startup solves.
2. "customerPersona": A brief profile of the primary target customer. Include keys for "name", "age", "occupation", "painPoints" (an array of strings), and "goals" (an array of strings).
3. "leanCanvas": An object where each key is a component of the Lean Business Model Canvas. The keys must be: "keyPartners", "keyActivities", "valuePropositions", "customerRelationships", "customerSegments", "keyResources", "channels", "costStructure", "revenueStreams". Each value should be an array of actionable bullet points (strings).
4. "pitchDeckSummary": An object representing a one-page investor pitch. The keys must be: "title", "tagline", "problem", "solution", "marketSize", "businessModel", "theAsk". Each value should be a short, compelling string.
5. "marketResearch": An object containing market analysis data. It must contain these keys:
   - "marketSize": A string describing the total addressable market size (e.g., "$2.3B addressable market").
   - "competitors": An array of 3-5 competitor names or companies in this space.
   - "trends": An array of 3-5 key market trends affecting this industry.
6. "validation": An object for idea validation assets. It must contain these keys:
   - "surveyQuestions": An array of 5 insightful questions to ask potential customers.
   - "landingPage": An object with keys "headline", "subheading", and "callToAction".
   - "adCampaign": An object with keys "adCopy" (a short, punchy ad text) and "keywords" (an array of 5 relevant keywords).
    `;
  }

  async callGeminiAPI(prompt) {
    try {
      const model = this.geminiAPI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response in case the LLM wraps it in markdown
      const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }


  async generateValidationContent(idea, validationType) {
    // Initialize the service (lazy loading)
    this.initialize();
    
    const prompts = {
      survey: `Generate 5 insightful survey questions to validate the startup idea: "${idea}". Focus on understanding customer pain points, willingness to pay, and market demand. Return as JSON array.`,
      landingPage: `Create compelling landing page content for the startup idea: "${idea}". Include headline, subheading, and call-to-action. Return as JSON object with keys: headline, subheading, callToAction.`,
      adCopy: `Create effective ad copy and keywords for the startup idea: "${idea}". Return as JSON object with keys: adCopy (string) and keywords (array of 5 strings).`
    };

    const prompt = prompts[validationType];
    if (!prompt) {
      throw new Error('Invalid validation type');
    }

    try {
      if (this.geminiAPI) {
        return await this.callGeminiAPI(prompt);
      } else {
        console.log('No Gemini API key configured, returning mock validation data');
        return this.getMockValidationContent(idea, validationType);
      }
    } catch (error) {
      console.error('Validation Content Generation Error:', error);
      return this.getMockValidationContent(idea, validationType);
    }
  }

  // Mock data generator for demonstration purposes
  getMockBusinessPlan(idea) {
    const ideaLower = idea.toLowerCase();
    
    // Generate contextual mock data based on the idea
    let problemStatement, customerPersona, leanCanvas, pitchDeckSummary, validation, marketResearch;
    
    if (ideaLower.includes('food') || ideaLower.includes('restaurant') || ideaLower.includes('meal')) {
      problemStatement = "Students struggle to find affordable, healthy food options near campus, often settling for expensive fast food or unhealthy choices due to limited time and budget constraints.";
      
      customerPersona = {
        name: "Sarah Chen",
        age: "22",
        occupation: "Computer Science Student",
        painPoints: ["High food costs", "Limited healthy options", "Time constraints between classes", "Budget management"],
        goals: ["Eat healthy on a budget", "Save time finding food", "Discover new affordable restaurants", "Maintain good nutrition"]
      };
      
      leanCanvas = {
        keyPartners: ["Local restaurants", "University dining services", "Food delivery platforms", "Student organizations"],
        keyActivities: ["Restaurant discovery", "Price comparison", "Menu analysis", "User reviews and ratings"],
        valuePropositions: ["Affordable healthy food discovery", "Real-time price comparison", "Student-friendly discounts", "Time-saving food search"],
        customerRelationships: ["Self-service platform", "Community reviews", "Personalized recommendations", "Mobile app experience"],
        customerSegments: ["College students", "Budget-conscious individuals", "Health-conscious eaters", "Time-pressed professionals"],
        keyResources: ["Restaurant database", "User review system", "Mobile application", "Partnership agreements"],
        channels: ["Mobile app", "University partnerships", "Social media", "Word of mouth"],
        costStructure: ["App development", "Restaurant partnerships", "Marketing", "Server maintenance"],
        revenueStreams: ["Restaurant commission fees", "Premium features", "Advertising revenue", "Partnership deals"]
      };
      
      pitchDeckSummary = {
        title: "CampusBites",
        tagline: "Affordable healthy food discovery for students",
        problem: "Students waste time and money finding affordable, healthy food near campus",
        solution: "AI-powered app that finds the best healthy food deals within walking distance",
        marketSize: "$2.3B campus food market with 20M+ college students",
        businessModel: "Commission-based revenue from restaurant partnerships and premium features",
        theAsk: "$500K seed funding to expand to 50+ universities and build restaurant network"
      };
      
      validation = {
        surveyQuestions: [
          "How much do you typically spend on food per week?",
          "What's your biggest challenge when finding food near campus?",
          "How important is healthy food vs. convenience for you?",
          "Would you use an app that shows healthy food deals nearby?",
          "What features would make you choose one food app over another?"
        ],
        landingPage: {
          headline: "Find Healthy Food Deals Near Campus",
          subheading: "Discover affordable, nutritious meals within walking distance of your university",
          callToAction: "Get Early Access - Join 1,000+ Students Already Saving Money"
        },
        adCampaign: {
          adCopy: "Tired of expensive campus food? Find healthy deals nearby! Save 30% on meals with CampusBites.",
          keywords: ["student food deals", "campus dining", "healthy food near me", "college meal planning", "affordable student meals"]
        }
      };

      marketResearch = {
        marketSize: "$2.3B campus food market with 20M+ college students",
        competitors: [
          "Grubhub",
          "Uber Eats", 
          "DoorDash",
          "Campus dining services",
          "Local restaurant apps"
        ],
        trends: [
          "Growing demand for healthy food options",
          "Mobile ordering becoming standard",
          "Student budget constraints driving innovation",
          "Sustainability focus in food choices",
          "Personalized nutrition recommendations"
        ]
      };
    } else {
      // Generate more contextual mock data based on the idea
      const ideaWords = idea.toLowerCase().split(' ');
      const industry = this.detectIndustry(ideaWords);
      const targetAge = this.detectTargetAge(ideaWords);
      
      problemStatement = `The current market lacks an effective solution for "${idea}", leaving users frustrated with existing alternatives that are either too expensive, complex, or don't address the core needs.`;
      
      customerPersona = {
        name: this.generatePersonaName(industry),
        age: targetAge,
        occupation: this.generateOccupation(industry, targetAge),
        painPoints: this.generatePainPoints(ideaWords, industry),
        goals: this.generateGoals(ideaWords, industry)
      };
      
      leanCanvas = {
        keyPartners: this.generateKeyPartners(industry),
        keyActivities: this.generateKeyActivities(industry),
        valuePropositions: this.generateValuePropositions(industry),
        customerRelationships: this.generateCustomerRelationships(industry),
        customerSegments: this.generateCustomerSegments(industry, targetAge),
        keyResources: this.generateKeyResources(industry),
        channels: this.generateChannels(industry),
        costStructure: this.generateCostStructure(industry),
        revenueStreams: this.generateRevenueStreams(industry)
      };
      
      pitchDeckSummary = {
        title: "InnovateApp",
        tagline: "Revolutionizing the way we approach everyday problems",
        problem: "Current solutions are outdated and don't meet modern user needs",
        solution: "A modern, user-friendly platform that addresses the core problem effectively",
        marketSize: "$1.2B addressable market with 10M+ potential users",
        businessModel: "Freemium model with premium features and subscription tiers",
        theAsk: "$300K seed funding to accelerate development and user acquisition"
      };
      
      validation = {
        surveyQuestions: [
          "What's your biggest pain point with current solutions?",
          "How much would you pay for a better solution?",
          "What features are most important to you?",
          "How often do you encounter this problem?",
          "Would you recommend this solution to others?"
        ],
        landingPage: {
          headline: "Solve Your Problem Better",
          subheading: "A modern solution that actually works for your needs",
          callToAction: "Try It Free - Join 500+ Early Users"
        },
        adCampaign: {
          adCopy: "Tired of broken solutions? Try our modern approach! Free trial available.",
          keywords: ["problem solving", "modern solution", "user friendly", "cost effective", "time saving"]
        }
      };

      marketResearch = {
        marketSize: "$1.2B addressable market with 10M+ potential users",
        competitors: [
          "Existing solution providers in this space",
          "Traditional market leaders",
          "Emerging startups with similar solutions",
          "Alternative approaches and substitutes"
        ],
        trends: [
          "Growing demand for innovative solutions",
          "Technology adoption accelerating",
          "Market consolidation expected",
          "Regulatory changes affecting the industry",
          "Consumer behavior shifts post-pandemic"
        ]
      };
    }
    
    return {
      problemStatement,
      customerPersona,
      leanCanvas,
      pitchDeckSummary,
      marketResearch,
      validation
    };
  }

  getMockValidationContent(idea, validationType) {
    const ideaLower = idea.toLowerCase();
    
    if (validationType === 'survey') {
      return [
        "What's your biggest challenge with current solutions?",
        "How much would you pay for a better solution?",
        "What features are most important to you?",
        "How often do you encounter this problem?",
        "Would you recommend this solution to others?"
      ];
    } else if (validationType === 'landingPage') {
      return {
        headline: `Revolutionary Solution for ${idea}`,
        subheading: "The modern approach you've been waiting for",
        callToAction: "Get Started Free - Join 1,000+ Early Users"
      };
    } else if (validationType === 'adCopy') {
      return {
        adCopy: `Transform your experience with ${idea}! Try our innovative solution today.`,
        keywords: ["innovation", "solution", "modern", "effective", "user-friendly"]
      };
    }
    
    return {};
  }

  // Helper methods for dynamic mock data generation
  detectIndustry(ideaWords) {
    const industryKeywords = {
      'healthcare': ['health', 'medical', 'doctor', 'patient', 'hospital', 'clinic', 'wellness', 'fitness'],
      'education': ['education', 'school', 'student', 'teacher', 'learning', 'course', 'university', 'college'],
      'finance': ['finance', 'money', 'bank', 'payment', 'investment', 'trading', 'crypto', 'fintech'],
      'ecommerce': ['shop', 'buy', 'sell', 'marketplace', 'retail', 'product', 'store', 'commerce'],
      'technology': ['app', 'software', 'tech', 'ai', 'data', 'cloud', 'mobile', 'web', 'platform'],
      'transportation': ['transport', 'delivery', 'ride', 'travel', 'logistics', 'shipping', 'uber', 'taxi'],
      'entertainment': ['entertainment', 'game', 'music', 'video', 'streaming', 'media', 'content', 'social']
    };

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some(keyword => ideaWords.some(word => word.includes(keyword)))) {
        return industry;
      }
    }
    return 'technology';
  }

  detectTargetAge(ideaWords) {
    if (ideaWords.some(word => ['student', 'college', 'university', 'school'].includes(word))) {
      return "22";
    } else if (ideaWords.some(word => ['senior', 'elderly', 'retirement'].includes(word))) {
      return "65";
    } else if (ideaWords.some(word => ['child', 'kid', 'baby', 'toddler'].includes(word))) {
      return "8";
    }
    return "28";
  }

  generatePersonaName(industry) {
    const names = {
      'healthcare': ['Dr. Sarah Martinez', 'Dr. Michael Chen', 'Dr. Emily Rodriguez'],
      'education': ['Professor Alex Johnson', 'Dr. Lisa Wang', 'Dr. David Kim'],
      'finance': ['James Thompson', 'Maria Garcia', 'Robert Wilson'],
      'ecommerce': ['Jennifer Lee', 'Chris Anderson', 'Amanda Taylor'],
      'technology': ['Alex Chen', 'Sarah Johnson', 'Michael Rodriguez'],
      'transportation': ['David Martinez', 'Lisa Chen', 'Robert Garcia'],
      'entertainment': ['Emma Wilson', 'Jake Thompson', 'Sophia Lee']
    };
    
    const industryNames = names[industry] || names['technology'];
    return industryNames[Math.floor(Math.random() * industryNames.length)];
  }

  generateOccupation(industry, age) {
    const occupations = {
      'healthcare': ['Medical Professional', 'Healthcare Administrator', 'Nurse Practitioner'],
      'education': ['Educator', 'Academic Researcher', 'Curriculum Developer'],
      'finance': ['Financial Analyst', 'Investment Advisor', 'Banking Professional'],
      'ecommerce': ['E-commerce Manager', 'Digital Marketing Specialist', 'Retail Operations Manager'],
      'technology': ['Software Engineer', 'Product Manager', 'Data Scientist'],
      'transportation': ['Logistics Coordinator', 'Transportation Manager', 'Supply Chain Analyst'],
      'entertainment': ['Content Creator', 'Media Producer', 'Entertainment Professional']
    };
    
    const industryOccupations = occupations[industry] || occupations['technology'];
    return industryOccupations[Math.floor(Math.random() * industryOccupations.length)];
  }

  generatePainPoints(ideaWords, industry) {
    const painPoints = {
      'healthcare': ['Long wait times', 'High medical costs', 'Complex insurance processes', 'Limited access to specialists'],
      'education': ['Expensive tuition', 'Outdated curriculum', 'Limited practical experience', 'Poor student engagement'],
      'finance': ['High fees', 'Complex processes', 'Limited transparency', 'Poor customer service'],
      'ecommerce': ['High shipping costs', 'Limited product variety', 'Poor return policies', 'Slow delivery'],
      'technology': ['Complex interfaces', 'High subscription costs', 'Poor customer support', 'Data security concerns'],
      'transportation': ['High costs', 'Unreliable service', 'Limited availability', 'Poor user experience'],
      'entertainment': ['High subscription costs', 'Limited content variety', 'Poor streaming quality', 'Complex navigation']
    };
    
    return painPoints[industry] || painPoints['technology'];
  }

  generateGoals(ideaWords, industry) {
    const goals = {
      'healthcare': ['Improve health outcomes', 'Reduce medical costs', 'Increase accessibility', 'Enhance patient experience'],
      'education': ['Improve learning outcomes', 'Reduce educational costs', 'Increase accessibility', 'Enhance student engagement'],
      'finance': ['Save money', 'Increase financial security', 'Simplify financial management', 'Improve investment returns'],
      'ecommerce': ['Save money on purchases', 'Find better products', 'Simplify shopping experience', 'Get faster delivery'],
      'technology': ['Increase productivity', 'Simplify workflows', 'Reduce costs', 'Improve user experience'],
      'transportation': ['Save time on travel', 'Reduce transportation costs', 'Improve reliability', 'Enhance convenience'],
      'entertainment': ['Access better content', 'Reduce entertainment costs', 'Improve streaming quality', 'Simplify content discovery']
    };
    
    return goals[industry] || goals['technology'];
  }

  generateKeyPartners(industry) {
    const partners = {
      'healthcare': ['Medical institutions', 'Healthcare providers', 'Insurance companies', 'Medical device manufacturers'],
      'education': ['Educational institutions', 'Content providers', 'Technology partners', 'Accreditation bodies'],
      'finance': ['Banks', 'Payment processors', 'Financial institutions', 'Regulatory bodies'],
      'ecommerce': ['Suppliers', 'Logistics partners', 'Payment gateways', 'Marketing agencies'],
      'technology': ['Cloud providers', 'API partners', 'Development tools', 'Security providers'],
      'transportation': ['Vehicle manufacturers', 'Fuel suppliers', 'Insurance providers', 'Maintenance partners'],
      'entertainment': ['Content creators', 'Streaming platforms', 'Media companies', 'Distribution partners']
    };
    return partners[industry] || partners['technology'];
  }

  generateKeyActivities(industry) {
    const activities = {
      'healthcare': ['Patient care delivery', 'Medical research', 'Health monitoring', 'Treatment optimization'],
      'education': ['Curriculum development', 'Student assessment', 'Learning analytics', 'Content creation'],
      'finance': ['Risk assessment', 'Transaction processing', 'Compliance monitoring', 'Customer onboarding'],
      'ecommerce': ['Inventory management', 'Order fulfillment', 'Customer service', 'Market analysis'],
      'technology': ['Software development', 'User experience design', 'Data analysis', 'System maintenance'],
      'transportation': ['Route optimization', 'Fleet management', 'Customer service', 'Safety monitoring'],
      'entertainment': ['Content production', 'User engagement', 'Platform optimization', 'Content curation']
    };
    return activities[industry] || activities['technology'];
  }

  generateValuePropositions(industry) {
    const propositions = {
      'healthcare': ['Improved patient outcomes', 'Reduced healthcare costs', 'Enhanced accessibility', 'Better care coordination'],
      'education': ['Personalized learning', 'Improved outcomes', 'Cost-effective education', 'Flexible learning options'],
      'finance': ['Lower fees', 'Better returns', 'Simplified processes', 'Enhanced security'],
      'ecommerce': ['Better prices', 'Faster delivery', 'Wider selection', 'Superior customer service'],
      'technology': ['Increased efficiency', 'Cost reduction', 'Better user experience', 'Scalable solutions'],
      'transportation': ['Reliable service', 'Cost savings', 'Convenience', 'Safety assurance'],
      'entertainment': ['High-quality content', 'Affordable pricing', 'Seamless experience', 'Personalized recommendations']
    };
    return propositions[industry] || propositions['technology'];
  }

  generateCustomerRelationships(industry) {
    const relationships = {
      'healthcare': ['Personalized care', '24/7 support', 'Health monitoring', 'Community engagement'],
      'education': ['Mentorship programs', 'Peer learning', 'Progress tracking', 'Support communities'],
      'finance': ['Personalized advice', 'Automated services', 'Customer support', 'Educational resources'],
      'ecommerce': ['Personalized recommendations', 'Customer support', 'Loyalty programs', 'Community features'],
      'technology': ['Self-service platform', 'Community support', 'Personalized experience', 'Proactive assistance'],
      'transportation': ['Reliable service', 'Customer support', 'Loyalty programs', 'Real-time updates'],
      'entertainment': ['Personalized content', 'Community features', 'Customer support', 'Social sharing']
    };
    return relationships[industry] || relationships['technology'];
  }

  generateCustomerSegments(industry, age) {
    const segments = {
      'healthcare': ['Patients', 'Healthcare providers', 'Insurance companies', 'Medical institutions'],
      'education': ['Students', 'Educators', 'Educational institutions', 'Parents'],
      'finance': ['Individual investors', 'Small businesses', 'Financial institutions', 'Retail customers'],
      'ecommerce': ['Online shoppers', 'Small businesses', 'Retailers', 'Consumers'],
      'technology': ['Tech professionals', 'Small businesses', 'Enterprises', 'Developers'],
      'transportation': ['Commuters', 'Business travelers', 'Logistics companies', 'Individual users'],
      'entertainment': ['Content consumers', 'Content creators', 'Advertisers', 'Streaming enthusiasts']
    };
    return segments[industry] || segments['technology'];
  }

  generateKeyResources(industry) {
    const resources = {
      'healthcare': ['Medical expertise', 'Technology platform', 'Patient data', 'Regulatory compliance'],
      'education': ['Educational content', 'Learning platform', 'Student data', 'Accreditation'],
      'finance': ['Financial expertise', 'Technology platform', 'Customer data', 'Regulatory compliance'],
      'ecommerce': ['Product inventory', 'Technology platform', 'Customer data', 'Supply chain'],
      'technology': ['Development team', 'Technology platform', 'User data', 'Intellectual property'],
      'transportation': ['Fleet vehicles', 'Technology platform', 'Customer data', 'Operational expertise'],
      'entertainment': ['Content library', 'Streaming platform', 'User data', 'Content partnerships']
    };
    return resources[industry] || resources['technology'];
  }

  generateChannels(industry) {
    const channels = {
      'healthcare': ['Medical platforms', 'Healthcare networks', 'Mobile apps', 'Direct partnerships'],
      'education': ['Learning platforms', 'Educational institutions', 'Mobile apps', 'Online communities'],
      'finance': ['Banking platforms', 'Financial networks', 'Mobile apps', 'Partner channels'],
      'ecommerce': ['Online marketplace', 'Mobile apps', 'Social media', 'Partner networks'],
      'technology': ['Web platform', 'Mobile apps', 'API integrations', 'Partner channels'],
      'transportation': ['Mobile apps', 'Web platform', 'Partner networks', 'Direct bookings'],
      'entertainment': ['Streaming platforms', 'Mobile apps', 'Social media', 'Content networks']
    };
    return channels[industry] || channels['technology'];
  }

  generateCostStructure(industry) {
    const costs = {
      'healthcare': ['Medical staff', 'Technology infrastructure', 'Regulatory compliance', 'Insurance'],
      'education': ['Content development', 'Technology platform', 'Instructor costs', 'Accreditation'],
      'finance': ['Technology infrastructure', 'Compliance costs', 'Security measures', 'Staff costs'],
      'ecommerce': ['Inventory costs', 'Technology platform', 'Marketing expenses', 'Logistics'],
      'technology': ['Development costs', 'Technology infrastructure', 'Marketing expenses', 'Operational costs'],
      'transportation': ['Vehicle costs', 'Fuel expenses', 'Maintenance', 'Insurance'],
      'entertainment': ['Content licensing', 'Technology platform', 'Marketing expenses', 'Operational costs']
    };
    return costs[industry] || costs['technology'];
  }

  generateRevenueStreams(industry) {
    const revenue = {
      'healthcare': ['Service fees', 'Subscription plans', 'Insurance partnerships', 'Premium features'],
      'education': ['Course fees', 'Subscription plans', 'Certification fees', 'Corporate training'],
      'finance': ['Transaction fees', 'Subscription plans', 'Investment fees', 'Premium services'],
      'ecommerce': ['Commission fees', 'Subscription plans', 'Advertising revenue', 'Premium listings'],
      'technology': ['Subscription fees', 'Transaction fees', 'Premium features', 'Enterprise licenses'],
      'transportation': ['Service fees', 'Subscription plans', 'Premium services', 'Corporate partnerships'],
      'entertainment': ['Subscription fees', 'Advertising revenue', 'Premium content', 'Transaction fees']
    };
    return revenue[industry] || revenue['technology'];
  }
}

export default new AIService();
