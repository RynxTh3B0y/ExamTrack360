const express = require('express');
const { body, validationResult } = require('express-validator');
const Exam = require('../models/Exam');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { 
    subject, 
    examType, 
    status, 
    teacher, 
    grade, 
    search, 
    page = 1, 
    limit = 10 
  } = req.query;

  // Build query
  const query = {};
  
  if (subject) query.subject = { $regex: subject, $options: 'i' };
  if (examType) query.examType = examType;
  if (status) query.status = status;
  if (teacher) query.teacher = teacher;
  if (grade) query.targetGrades = grade;
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter based on user role
  if (req.user.role === 'teacher') {
    query.teacher = req.user._id;
  } else if (req.user.role === 'student') {
    query.$or = [
      { targetGrades: req.user.grade },
      { targetStudents: req.user._id }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;
  
  const exams = await Exam.find(query)
    .populate('teacher', 'firstName lastName teacherId')
    .populate('createdBy', 'firstName lastName')
    .sort({ date: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Exam.countDocuments(query);

  res.json({
    success: true,
    data: {
      exams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id)
    .populate('teacher', 'firstName lastName teacherId email')
    .populate('createdBy', 'firstName lastName')
    .populate('targetStudents', 'firstName lastName studentId grade section');

  if (!exam) {
    return res.status(404).json({
      success: false,
      message: 'Exam not found'
    });
  }

  res.json({
    success: true,
    data: { exam }
  });
}));

// @desc    Create exam (Admin/Teacher only)
// @route   POST /api/exams
// @access  Private/Admin/Teacher
router.post('/', authorize('admin', 'teacher'), [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),
  body('examType')
    .isIn(['midterm', 'final', 'quiz', 'assignment', 'project'])
    .withMessage('Invalid exam type'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('duration')
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 and 480 minutes'),
  body('totalMarks')
    .isInt({ min: 1 })
    .withMessage('Total marks must be at least 1'),
  body('passingMarks')
    .isInt({ min: 1 })
    .withMessage('Passing marks must be at least 1'),
  body('targetGrades')
    .isArray({ min: 1 })
    .withMessage('At least one target grade is required'),
  body('targetGrades.*')
    .trim()
    .notEmpty()
    .withMessage('Target grade cannot be empty')
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
    title,
    description,
    subject,
    examType,
    date,
    duration,
    totalMarks,
    passingMarks,
    venue,
    instructions,
    targetGrades,
    targetSections,
    targetStudents,
    metadata
  } = req.body;

  // Validate passing marks
  if (passingMarks > totalMarks) {
    return res.status(400).json({
      success: false,
      message: 'Passing marks cannot exceed total marks'
    });
  }

  // Validate date is in the future
  if (new Date(date) <= new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Exam date must be in the future'
    });
  }

  // Create exam
  const exam = await Exam.create({
    title,
    description,
    subject,
    examType,
    date,
    duration,
    totalMarks,
    passingMarks,
    venue,
    instructions,
    targetGrades,
    targetSections,
    targetStudents,
    metadata,
    teacher: req.user.role === 'teacher' ? req.user._id : req.body.teacher,
    createdBy: req.user._id
  });

  const populatedExam = await Exam.findById(exam._id)
    .populate('teacher', 'firstName lastName teacherId')
    .populate('createdBy', 'firstName lastName');

  res.status(201).json({
    success: true,
    message: 'Exam created successfully',
    data: {
      exam: populatedExam
    }
  });
}));

// @desc    Update exam (Admin/Teacher only)
// @route   PUT /api/exams/:id
// @access  Private/Admin/Teacher
router.put('/:id', authorize('admin', 'teacher'), [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('subject')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Subject cannot be empty'),
  body('examType')
    .optional()
    .isIn(['midterm', 'final', 'quiz', 'assignment', 'project'])
    .withMessage('Invalid exam type'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Valid date is required'),
  body('duration')
    .optional()
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 and 480 minutes'),
  body('totalMarks')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total marks must be at least 1'),
  body('passingMarks')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Passing marks must be at least 1')
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

  const exam = await Exam.findById(req.params.id);
  
  if (!exam) {
    return res.status(404).json({
      success: false,
      message: 'Exam not found'
    });
  }

  // Check if teacher can update this exam
  if (req.user.role === 'teacher' && exam.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this exam'
    });
  }

  // Validate passing marks if both are provided
  if (req.body.passingMarks && req.body.totalMarks) {
    if (req.body.passingMarks > req.body.totalMarks) {
      return res.status(400).json({
        success: false,
        message: 'Passing marks cannot exceed total marks'
      });
    }
  }

  // Update exam
  const updatedExam = await Exam.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate('teacher', 'firstName lastName teacherId')
    .populate('createdBy', 'firstName lastName');

  res.json({
    success: true,
    message: 'Exam updated successfully',
    data: {
      exam: updatedExam
    }
  });
}));

// @desc    Delete exam (Admin/Teacher only)
// @route   DELETE /api/exams/:id
// @access  Private/Admin/Teacher
router.delete('/:id', authorize('admin', 'teacher'), asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  
  if (!exam) {
    return res.status(404).json({
      success: false,
      message: 'Exam not found'
    });
  }

  // Check if teacher can delete this exam
  if (req.user.role === 'teacher' && exam.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this exam'
    });
  }

  // Check if exam has results
  const Result = require('../models/Result');
  const hasResults = await Result.exists({ exam: req.params.id });
  
  if (hasResults) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete exam with existing results'
    });
  }

  await Exam.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Exam deleted successfully'
  });
}));

// @desc    Get upcoming exams
// @route   GET /api/exams/upcoming
// @access  Private
router.get('/upcoming', asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const query = {
    date: { $gte: new Date() },
    status: { $ne: 'cancelled' }
  };

  // Filter based on user role
  if (req.user.role === 'teacher') {
    query.teacher = req.user._id;
  } else if (req.user.role === 'student') {
    query.$or = [
      { targetGrades: req.user.grade },
      { targetStudents: req.user._id }
    ];
  }

  const exams = await Exam.find(query)
    .populate('teacher', 'firstName lastName teacherId')
    .sort({ date: 1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: { exams }
  });
}));

// @desc    Get completed exams
// @route   GET /api/exams/completed
// @access  Private
router.get('/completed', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const query = {
    date: { $lt: new Date() },
    status: { $ne: 'cancelled' }
  };

  // Filter based on user role
  if (req.user.role === 'teacher') {
    query.teacher = req.user._id;
  } else if (req.user.role === 'student') {
    query.$or = [
      { targetGrades: req.user.grade },
      { targetStudents: req.user._id }
    ];
  }

  const skip = (page - 1) * limit;
  
  const exams = await Exam.find(query)
    .populate('teacher', 'firstName lastName teacherId')
    .sort({ date: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Exam.countDocuments(query);

  res.json({
    success: true,
    data: {
      exams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Publish exam results
// @route   PUT /api/exams/:id/publish-results
// @access  Private/Admin/Teacher
router.put('/:id/publish-results', authorize('admin', 'teacher'), asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  
  if (!exam) {
    return res.status(404).json({
      success: false,
      message: 'Exam not found'
    });
  }

  // Check if teacher can publish results for this exam
  if (req.user.role === 'teacher' && exam.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to publish results for this exam'
    });
  }

  exam.resultsPublished = true;
  await exam.save();

  res.json({
    success: true,
    message: 'Exam results published successfully'
  });
}));

module.exports = router; 