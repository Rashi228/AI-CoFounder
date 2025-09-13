import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acm-cofounder';
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    console.log('Running in fallback mode - some features may be limited');
    // Don't exit the process, allow the app to run with limited functionality
  }
};

export default connectDB;
