// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Check user permissions
exports.checkPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if user has any of the required permissions
    const hasPermission = req.user.permissions.some((permission) =>
      permissions.includes(permission)
    );

    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: 'Access denied, insufficient permissions' });
    }

    next();
  };
};
