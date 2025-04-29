import { Request, Response } from 'express';

import { User } from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_here', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'user', // Default role
      permissions: ['view_devices', 'view_profiles'], // Default permissions
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      token: generateToken(user._id),
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    // User should be attached to req by auth middleware
    const user = {
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      permissions: req.user.permissions,
    };

    res.json(user);
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
