import mongoose from 'mongoose';

const coFounderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Consulting', 'Contract', 'Unavailable'],
    default: 'Part-time'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  education: {
    type: String,
    trim: true
  },
  lookingFor: {
    type: String,
    trim: true
  },
  previousStartups: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  portfolio: {
    website: String,
    github: String,
    linkedin: String,
    projects: [String]
  },
  preferences: {
    lookingFor: [String], // skills they're looking for in co-founders
    industry: [String],
    stage: [String], // startup stage they prefer
    commitment: String
  },
  contact: {
    email: String,
    phone: String,
    preferredContact: {
      type: String,
      enum: ['email', 'phone', 'linkedin', 'github'],
      default: 'email'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
coFounderSchema.index({ skills: 1 });
coFounderSchema.index({ location: 1 });
coFounderSchema.index({ availability: 1 });
coFounderSchema.index({ isActive: 1 });
coFounderSchema.index({ rating: -1 });

export default mongoose.model('CoFounder', coFounderSchema);
