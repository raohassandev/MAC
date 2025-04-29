import Alert from './Alert';
import Device from './Device';
import Profile from './Profile';
import User from './User';
import mongoose from 'mongoose';

// Export all models
export { User, Device, Profile, Alert };

// Initialize MongoDB connection
export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/macsys'
    );
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
