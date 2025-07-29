const express = require('express');
const { body, validationResult } = require('express-validator');
const Result = require('../models/Result');
const Exam = require('../models/Exam');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get all results
// @route   GET /api/results
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { 
    exam, 
    student, 
    grade, 
    status, 
    search, 
    page = 1, 
    limit = 10 
  } = req.query;

  // Build query
  const query = {};
  
  if (exam) query.exam = exam;
  if (student) query.student = student;
  if (status) query.status = status;
  
  if (search) {
    query.$or = [
      { 'exam.title': { $regex: search, $options: 'i' } },
      { 'student.firstName': { $regex: search, $options: 'i' } },
      { 'student.lastName': { $regex: search, $options: 'i' } }
    ];
  }

  // Filter based on user role
  if (req.user.role === 'teacher') {
    // Teachers can see results for exams they created
    const teacherExams = await Exam.find({ teacher: req.user._id }).select('_id');
    query.exam = { $in: teacherExams.map(e => e._id) };
  } else if (req.user.role === 'student') {
    // Students can only see their own results
    query.student = req.user._id;
  }

  // Pagination
  const skip = (page - 1) * limit;
  
  const results = await Result.find(query)
    .populate('exam', 'title subject date examType totalMarks')
    .populate('student', 'firstName lastName studentId grade section')
    .populate('gradedBy', 'firstName lastName')
    .sort({ submittedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Result.countDocuments(query);

  res.json({
    success: true,
    data: {
      results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get single result
// @route   GET /api/results/:id
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id)
    .populate('exam', 'title subject date examType totalMarks passingMarks')
    .populate('student', 'firstName lastName studentId grade section email')
    .populate('gradedBy', 'firstName lastName')
    .populate('reviewedBy', 'firstName lastName');

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Result not found'
    });
  }

  // Check access permissions
  if (req.user.role === 'student' && result.student._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this result'
    });
  }

  res.json({
    success: true,
    data: { result }
  });
}));

// @desc    Create result (Admin/Teacher only)
// @route   POST /api/results
// @access  Private/Admin/Teacher
router.post('/', authorize('admin', 'teacher'), [
  body('student')
    .isMongoId()
    .withMessage('Valid student ID is required'),
  body('exam')
    .isMongoId()
    .withMessage('Valid exam ID is required'),
  body('marksObtained')
    .isFloat({ min: 0 })
    .withMessage('Marks obtained must be a positive number'),
  body('totalMarks')
    .isFloat({ min: 1 })
    .withMessage('Total marks must be at least 1'),
  body('teacherComments')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comments cannot exceed 500 characters')
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
    student,
    exam,
    marksObtained,
    totalMarks,
    breakdown,
    teacherComments,
    attendance,
    participation
  } = req.body;

  // Check if exam exists
  const examDoc = await Exam.findById(exam);
  if (!examDoc) {
    return res.status(404).json({
      success: false,
      message: 'Exam not found'
    });
  }

  // Check if student exists
  const studentDoc = await User.findById(student);
  if (!studentDoc || studentDoc.role !== 'student') {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  // Check if teacher can grade this exam
  if (req.user.role === 'teacher' && examDoc.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to grade this exam'
    });
  }

  // Check if result already exists
  const existingResult = await Result.findOne({ student, exam });
  if (existingResult) {
    return res.status(400).json({
      success: false,
      message: 'Result already exists for this student and exam'
    });
  }

  // Validate marks
  if (marksObtained > totalMarks) {
    return res.status(400).json({
      success: false,
      message: 'Marks obtained cannot exceed total marks'
    });
  }

  // Create result
  const result = await Result.create({
    student,
    exam,
    marksObtained,
    totalMarks,
    breakdown,
    teacherComments,
    attendance,
    participation,
    gradedBy: req.user._id
  });

  const populatedResult = await Result.findById(result._id)
    .populate('exam', 'title subject date examType')
    .populate('student', 'firstName lastName studentId grade section')
    .populate('gradedBy', 'firstName lastName');

  res.status(201).json({
    success: true,
    message: 'Result created successfully',
    data: {
      result: populatedResult
    }
  });
}));

// @desc    Update result (Admin/Teacher only)
// @route   PUT /api/results/:id
// @access  Private/Admin/Teacher
router.put('/:id', authorize('admin', 'teacher'), [
  body('marksObtained')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Marks obtained must be a positive number'),
  body('totalMarks')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Total marks must be at least 1'),
  body('teacherComments')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comments cannot exceed 500 characters')
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

  const result = await Result.findById(req.params.id)
    .populate('exam', 'teacher');

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Result not found'
    });
  }

  // Check if teacher can update this result
  if (req.user.role === 'teacher' && result.exam.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this result'
    });
  }

  // Validate marks if provided
  if (req.body.marksObtained && req.body.totalMarks) {
    if (req.body.marksObtained > req.body.totalMarks) {
      return res.status(400).json({
        success: false,
        message: 'Marks obtained cannot exceed total marks'
      });
    }
  }

  // Update result
  const updatedResult = await Result.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate('exam', 'title subject date examType')
    .populate('student', 'firstName lastName studentId grade section')
    .populate('gradedBy', 'firstName lastName');

  res.json({
    success: true,
    message: 'Result updated successfully',
    data: {
      result: updatedResult
    }
  });
}));

// @desc    Delete result (Admin/Teacher only)
// @route   DELETE /api/results/:id
// @access  Private/Admin/Teacher
router.delete('/:id', authorize('admin', 'teacher'), asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id)
    .populate('exam', 'teacher');

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Result not found'
    });
  }

  // Check if teacher can delete this result
  if (req.user.role === 'teacher' && result.exam.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this result'
    });
  }

  await Result.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Result deleted successfully'
  });
}));

// @desc    Get results by exam
// @route   GET /api/results/exam/:examId
// @access  Private
router.get('/exam/:examId', asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check if exam exists
  const exam = await Exam.findById(examId);
  if (!exam) {
    return res.status(404).json({
      success: false,
      message: 'Exam not found'
    });
  }

  // Check access permissions
  if (req.user.role === 'teacher' && exam.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access results for this exam'
    });
  }

  const skip = (page - 1) * limit;
  
  const results = await Result.findByExam(examId)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Result.countDocuments({ exam: examId });

  res.json({
    success: true,
    data: {
      results,
      exam: {
        title: exam.title,
        subject: exam.subject,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get results by student
// @route   GET /api/results/student/:studentId
// @access  Private
router.get('/student/:studentId', asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check access permissions
  if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this student\'s results'
    });
  }

  const skip = (page - 1) * limit;
  
  const results = await Result.findByStudent(studentId)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Result.countDocuments({ student: studentId });

  res.json({
    success: true,
    data: {
      results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Bulk upload results
// @route   POST /api/results/bulk
// @access  Private/Admin/Teacher
router.post('/bulk', authorize('admin', 'teacher'), [
  body('exam')
    .isMongoId()
    .withMessage('Valid exam ID is required'),
  body('results')
    .isArray({ min: 1 })
    .withMessage('At least one result is required'),
  body('results.*.student')
    .isMongoId()
    .withMessage('Valid student ID is required'),
  body('results.*.marksObtained')
    .isFloat({ min: 0 })
    .withMessage('Marks obtained must be a positive number')
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

  const { exam: examId, results } = req.body;

  // Check if exam exists
  const exam = await Exam.findById(examId);
  if (!exam) {
    return res.status(404).json({
      success: false,
      message: 'Exam not found'
    });
  }

  // Check if teacher can grade this exam
  if (req.user.role === 'teacher' && exam.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to grade this exam'
    });
  }

  const createdResults = [];
  const bulkErrors = [];

  for (const resultData of results) {
    try {
      // Check if result already exists
      const existingResult = await Result.findOne({ 
        student: resultData.student, 
        exam: examId 
      });

      if (existingResult) {
        bulkErrors.push({
          student: resultData.student,
          message: 'Result already exists'
        });
        continue;
      }

      // Validate marks
      if (resultData.marksObtained > exam.totalMarks) {
        bulkErrors.push({
          student: resultData.student,
          message: 'Marks obtained cannot exceed total marks'
        });
        continue;
      }

      // Create result
      const result = await Result.create({
        student: resultData.student,
        exam: examId,
        marksObtained: resultData.marksObtained,
        totalMarks: exam.totalMarks,
        breakdown: resultData.breakdown,
        teacherComments: resultData.teacherComments,
        attendance: resultData.attendance,
        participation: resultData.participation,
        gradedBy: req.user._id
      });

      createdResults.push(result);
    } catch (error) {
      bulkErrors.push({
        student: resultData.student,
        message: error.message
      });
    }
  }

  res.status(201).json({
    success: true,
    message: `Bulk upload completed. ${createdResults.length} results created.`,
    data: {
      created: createdResults.length,
      errors: bulkErrors.length,
      errorDetails: bulkErrors
    }
  });
}));

module.exports = router; 