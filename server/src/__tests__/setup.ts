import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set test specific environment variables
process.env.NODE_ENV = 'test';
process.env.MONGO_URI_TEST = 'mongodb://localhost:27017/macsys_test';
process.env.JWT_SECRET = 'test-jwt-secret';

// Global setup
beforeAll(async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI_TEST as string);
      console.log('Successfully connected to test MongoDB');
    }
  } catch (error) {
    console.error('Error connecting to test MongoDB:', error);
    process.exit(1);
  }
});

// Global teardown
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('Closed MongoDB connection');
  }
});

// Mocks for environment variables
jest.mock('../config/db', () => ({
  connectDB: jest.fn().mockResolvedValue({}),
}));

// Mock JWT for testing
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn().mockImplementation((token, secret, callback) => {
    if (token === 'invalid-token') {
      return callback(new Error('jwt invalid'), null);
    }
    return callback(null, { id: 'test-user-id' });
  }),
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock the User model
jest.mock('../models/User', () => {
  const mockUser = {
    _id: 'real_user_id',
    name: 'Real User',
    email: 'user@example.com',
    role: 'user',
    permissions: ['view_devices'],
    toObject: jest.fn().mockReturnThis(),
  };

  return {
    __esModule: true,
    default: {
      findById: jest.fn().mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser)
      })),
      findOne: jest.fn().mockResolvedValue(mockUser),
      create: jest.fn().mockResolvedValue(mockUser),
      prototype: {
        save: jest.fn().mockResolvedValue(mockUser),
        matchPassword: jest.fn().mockResolvedValue(true),
      }
    }
  };
});