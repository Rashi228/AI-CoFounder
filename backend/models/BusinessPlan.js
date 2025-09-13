import mongoose from 'mongoose';

const businessPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  idea: {
    type: String,
    required: true,
    trim: true
  },
  problemStatement: {
    type: String,
    required: true
  },
  customerPersona: {
    name: String,
    age: String,
    occupation: String,
    painPoints: [String],
    goals: [String]
  },
  leanCanvas: {
    keyPartners: [String],
    keyActivities: [String],
    valuePropositions: [String],
    customerRelationships: [String],
    customerSegments: [String],
    keyResources: [String],
    channels: [String],
    costStructure: [String],
    revenueStreams: [String]
  },
  pitchDeckSummary: {
    title: String,
    tagline: String,
    problem: String,
    solution: String,
    marketSize: String,
    businessModel: String,
    theAsk: String
  },
  validation: {
    surveyQuestions: [String],
    landingPage: {
      headline: String,
      subheading: String,
      callToAction: String
    },
    adCampaign: {
      adCopy: String,
      keywords: [String]
    }
  },
  marketResearch: {
    marketSize: String,
    competitors: [String],
    trends: [String],
    opportunityScore: Number
  },
  financialProjections: {
    startupCosts: Number,
    monthlyExpenses: Number,
    revenuePerUser: Number,
    breakEvenMonths: Number
  },
  status: {
    type: String,
    enum: ['draft', 'in_progress', 'completed', 'archived'],
    default: 'draft'
  },
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
businessPlanSchema.index({ userId: 1, createdAt: -1 });
businessPlanSchema.index({ status: 1 });
businessPlanSchema.index({ tags: 1 });

export default mongoose.model('BusinessPlan', businessPlanSchema);
