const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Middleware to authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, please login'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

// Middleware to check if user can access student data
const canAccessStudent = async (req, res, next) => {
  const { studentId } = req.params;
  
  // Admin can access all students
  if (req.user.role === 'admin') {
    return next();
  }

  // Teacher can access students in their classes
  if (req.user.role === 'teacher') {
    // This would need to be implemented based on your class assignment logic
    // For now, we'll allow teachers to access any student
    return next();
  }

  // Student can only access their own data
  if (req.user.role === 'student' && req.user._id.toString() === studentId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Not authorized to access this student data'
  });
};

// Middleware to check if user can access exam data
const canAccessExam = async (req, res, next) => {
  const { examId } = req.params;
  
  // Admin can access all exams
  if (req.user.role === 'admin') {
    return next();
  }

  // Teacher can access exams they created or are assigned to
  if (req.user.role === 'teacher') {
    // This would need to be implemented based on your exam assignment logic
    // For now, we'll allow teachers to access any exam
    return next();
  }

  // Student can access exams assigned to their grade/section
  if (req.user.role === 'student') {
    // This would need to be implemented based on your exam assignment logic
    // For now, we'll allow students to access any exam
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Not authorized to access this exam data'
  });
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we don't fail the request
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
};

module.exports = {
  protect,
  authorize,
  canAccessStudent,
  canAccessExam,
  generateToken,
  optionalAuth
}; 