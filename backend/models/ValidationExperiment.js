import mongoose from 'mongoose';

const validationExperimentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessPlan',
    required: true
  },
  type: {
    type: String,
    enum: ['survey', 'landing_page', 'ad_campaign', 'ab_test', 'interview'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  content: {
    // For survey experiments
    questions: [String],
    targetAudience: String,
    
    // For landing page experiments
    headline: String,
    subheading: String,
    callToAction: String,
    design: String,
    
    // For ad campaign experiments
    adCopy: String,
    keywords: [String],
    platform: String,
    budget: Number,
    
    // For A/B tests
    variantA: mongoose.Schema.Types.Mixed,
    variantB: mongoose.Schema.Types.Mixed,
    testElement: String,
    
    // For interviews
    interviewQuestions: [String],
    targetPersonas: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'paused', 'cancelled'],
    default: 'draft'
  },
  results: {
    responses: Number,
    conversionRate: Number,
    clickThroughRate: Number,
    costPerClick: Number,
    totalCost: Number,
    insights: [String],
    recommendations: [String]
  },
  settings: {
    duration: Number, // in days
    targetResponses: Number,
    budget: Number,
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for better query performance
validationExperimentSchema.index({ userId: 1, type: 1 });
validationExperimentSchema.index({ businessPlanId: 1 });
validationExperimentSchema.index({ status: 1 });
validationExperimentSchema.index({ createdAt: -1 });

export default mongoose.model('ValidationExperiment', validationExperimentSchema);
