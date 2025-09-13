import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

class AIService {
  constructor() {
    this.geminiAPI = process.env.GOOGLE_GEMINI_API_KEY ? 
      new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY) : null;
    this.openaiAPIKey = process.env.OPENAI_API_KEY;
  }

  async generateBusinessPlan(idea, apiProvider = 'gemini') {
    const prompt = this.createBusinessPlanPrompt(idea);
    
    try {
      if (apiProvider === 'gemini' && this.geminiAPI) {
        return await this.callGeminiAPI(prompt);
      } else if (apiProvider === 'openai' && this.openaiAPIKey) {
        return await this.callOpenAIAPI(prompt);
      } else {
        console.log('No AI API key configured, returning mock data for demonstration');
        return this.getMockBusinessPlan(idea);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
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

  async callOpenAIAPI(prompt) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert startup consultant. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiAPIKey}`,
          'Content-Type': 'application/json'
        }
      });

      const text = response.data.choices[0].message.content;
      const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  async generateValidationContent(idea, validationType) {
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
      } else if (this.openaiAPIKey) {
        return await this.callOpenAIAPI(prompt);
      } else {
        console.log('No AI API key configured, returning mock validation data');
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
    let problemStatement, customerPersona, leanCanvas, pitchDeckSummary, validation;
    
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

      // marketResearch and financialProjections removed to match new prompt structure
    } else {
      // Generic mock data for other ideas
      problemStatement = `The current market lacks an effective solution for "${idea}", leaving users frustrated with existing alternatives that are either too expensive, complex, or don't address the core needs.`;
      
      customerPersona = {
        name: "Alex Johnson",
        age: "25",
        occupation: "Young Professional",
        painPoints: ["Time constraints", "High costs", "Complex solutions", "Poor user experience"],
        goals: ["Save time", "Reduce costs", "Simplify processes", "Improve efficiency"]
      };
      
      leanCanvas = {
        keyPartners: ["Technology providers", "Industry experts", "Distribution partners", "Strategic alliances"],
        keyActivities: ["Product development", "User acquisition", "Customer support", "Market research"],
        valuePropositions: ["Simplified solution", "Cost-effective approach", "Better user experience", "Time-saving features"],
        customerRelationships: ["Self-service platform", "Community support", "Personalized experience", "Mobile-first design"],
        customerSegments: ["Young professionals", "Tech-savvy users", "Cost-conscious consumers", "Early adopters"],
        keyResources: ["Development team", "Technology platform", "User data", "Brand recognition"],
        channels: ["Mobile app", "Web platform", "Social media", "Partnerships"],
        costStructure: ["Development costs", "Marketing expenses", "Operational overhead", "Technology infrastructure"],
        revenueStreams: ["Subscription fees", "Transaction fees", "Premium features", "Advertising revenue"]
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
}

export default new AIService();
