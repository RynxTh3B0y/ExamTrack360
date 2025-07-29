const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', authorize('admin'), asyncHandler(async (req, res) => {
  const { role, grade, section, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query = { isActive: true };
  
  if (role) query.role = role;
  if (grade) query.grade = grade;
  if (section) query.section = section;
  
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
      { teacherId: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;
  
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', authorize('admin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: { user }
  });
}));

// @desc    Create user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
router.post('/', authorize('admin'), [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['admin', 'teacher', 'student'])
    .withMessage('Role must be admin, teacher, or student'),
  body('studentId')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Student ID must be between 3 and 20 characters'),
  body('teacherId')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Teacher ID must be between 3 and 20 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    role,
    studentId,
    teacherId,
    phone,
    grade,
    section,
    subjects
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Check if studentId/teacherId already exists
  if (studentId) {
    const existingStudent = await User.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student ID already exists'
      });
    }
  }

  if (teacherId) {
    const existingTeacher = await User.findOne({ teacherId });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher ID already exists'
      });
    }
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    studentId,
    teacherId,
    phone,
    grade,
    section,
    subjects
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: user.getPublicProfile()
    }
  });
}));

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', authorize('admin'), [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['admin', 'teacher', 'student'])
    .withMessage('Role must be admin, teacher, or student'),
  body('studentId')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Student ID must be between 3 and 20 characters'),
  body('teacherId')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Teacher ID must be between 3 and 20 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be boolean')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    firstName,
    lastName,
    email,
    role,
    studentId,
    teacherId,
    phone,
    grade,
    section,
    subjects,
    isActive
  } = req.body;

  // Check if user exists
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if email is being changed and if it already exists
  if (email && email !== user.email) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
  }

  // Check if studentId/teacherId is being changed and if it already exists
  if (studentId && studentId !== user.studentId) {
    const existingStudent = await User.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student ID already exists'
      });
    }
  }

  if (teacherId && teacherId !== user.teacherId) {
    const existingTeacher = await User.findOne({ teacherId });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher ID already exists'
      });
    }
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName,
      lastName,
      email,
      role,
      studentId,
      teacherId,
      phone,
      grade,
      section,
      subjects,
      isActive
    },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: updatedUser
    }
  });
}));

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', authorize('admin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Soft delete - set isActive to false
  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'User deactivated successfully'
  });
}));

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private/Admin
router.get('/role/:role', authorize('admin'), asyncHandler(async (req, res) => {
  const { role } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  
  const users = await User.findByRole(role)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments({ role, isActive: true });

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get students by grade
// @route   GET /api/users/students/grade/:grade
// @access  Private/Admin
router.get('/students/grade/:grade', authorize('admin'), asyncHandler(async (req, res) => {
  const { grade } = req.params;
  const { section } = req.query;

  const query = { role: 'student', grade, isActive: true };
  if (section) query.section = section;

  const students = await User.find(query)
    .select('-password')
    .sort({ firstName: 1, lastName: 1 });

  res.json({
    success: true,
    data: { students }
  });
}));

module.exports = router; 