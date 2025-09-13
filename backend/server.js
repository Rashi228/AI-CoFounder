// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import ideaRoutes from './routes/ideaRoutes.js';
import cofounderRoutes from './routes/cofounderRoutes.js';
import validationRoutes from './routes/validationRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Debug environment variables
console.log('🔍 Server Environment Debug:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - PORT:', process.env.PORT);
console.log('  - GOOGLE_GEMINI_API_KEY exists:', !!process.env.GOOGLE_GEMINI_API_KEY);
console.log('  - GOOGLE_GEMINI_API_KEY length:', process.env.GOOGLE_GEMINI_API_KEY ? process.env.GOOGLE_GEMINI_API_KEY.length : 0);
console.log('  - MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('  - JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('  - Current working directory:', process.cwd());
console.log('  - .env file path:', process.cwd() + '/.env');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://ai-cofounder-frontend.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

console.log('🌐 CORS Configuration:');
console.log('  - Allowed Origins:', allowedOrigins);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/cofounders', cofounderRoutes);
app.use('/api/validation', validationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ACM Co-Founder API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ACM Co-Founder Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
