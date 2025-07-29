const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Send notification to users
// @route   POST /api/notifications/send
// @access  Private/Admin/Teacher
router.post('/send', authorize('admin', 'teacher'), [
  body('type')
    .isIn(['email', 'sms', 'both'])
    .withMessage('Type must be email, sms, or both'),
  body('recipients')
    .isArray({ min: 1 })
    .withMessage('At least one recipient is required'),
  body('subject')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Subject must be between 3 and 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
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

  const { type, recipients, subject, message } = req.body;

  // Get recipient users
  const users = await User.find({
    _id: { $in: recipients },
    isActive: true
  });

  if (users.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid recipients found'
    });
  }

  const results = {
    sent: 0,
    failed: 0,
    errors: []
  };

  // Send notifications based on type
  for (const user of users) {
    try {
      if (type === 'email' || type === 'both') {
        if (user.preferences?.notifications?.email) {
          await sendEmail(user.email, subject, message);
          results.sent++;
        } else {
          results.errors.push({
            user: user._id,
            type: 'email',
            reason: 'Email notifications disabled'
          });
        }
      }

      if (type === 'sms' || type === 'both') {
        if (user.phone && user.preferences?.notifications?.sms) {
          await sendSMS(user.phone, message);
          results.sent++;
        } else {
          results.errors.push({
            user: user._id,
            type: 'sms',
            reason: 'SMS notifications disabled or no phone number'
          });
        }
      }
    } catch (error) {
      results.failed++;
      results.errors.push({
        user: user._id,
        type: type,
        reason: error.message
      });
    }
  }

  res.json({
    success: true,
    message: `Notifications sent. ${results.sent} successful, ${results.failed} failed.`,
    data: results
  });
}));

// @desc    Send exam reminder
// @route   POST /api/notifications/exam-reminder
// @access  Private/Admin/Teacher
router.post('/exam-reminder', authorize('admin', 'teacher'), [
  body('examId')
    .isMongoId()
    .withMessage('Valid exam ID is required'),
  body('type')
    .isIn(['email', 'sms', 'both'])
    .withMessage('Type must be email, sms, or both')
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

  const { examId, type } = req.body;

  // Get exam details
  const Exam = require('../models/Exam');
  const exam = await Exam.findById(examId)
    .populate('teacher', 'firstName lastName');

  if (!exam) {
    return res.status(404).json({
      success: false,
      message: 'Exam not found'
    });
  }

  // Check if teacher can send reminders for this exam
  if (req.user.role === 'teacher' && exam.teacher._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to send reminders for this exam'
    });
  }

  // Get students for this exam
  const students = await User.find({
    $or: [
      { grade: { $in: exam.targetGrades } },
      { _id: { $in: exam.targetStudents } }
    ],
    role: 'student',
    isActive: true
  });

  if (students.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No students found for this exam'
    });
  }

  const results = {
    sent: 0,
    failed: 0,
    errors: []
  };

  const subject = `Exam Reminder: ${exam.title}`;
  const message = `
Dear Student,

This is a reminder for your upcoming exam:

Exam: ${exam.title}
Subject: ${exam.subject}
Date: ${exam.formattedDate}
Time: ${exam.formattedTime}
Duration: ${exam.duration} minutes
Venue: ${exam.venue || 'To be announced'}

Please ensure you arrive on time and bring all necessary materials.

Good luck!

Best regards,
${exam.teacher.firstName} ${exam.teacher.lastName}
  `.trim();

  // Send notifications
  for (const student of students) {
    try {
      if (type === 'email' || type === 'both') {
        if (student.preferences?.notifications?.email) {
          await sendEmail(student.email, subject, message);
          results.sent++;
        } else {
          results.errors.push({
            user: student._id,
            type: 'email',
            reason: 'Email notifications disabled'
          });
        }
      }

      if (type === 'sms' || type === 'both') {
        if (student.phone && student.preferences?.notifications?.sms) {
          const smsMessage = `Exam Reminder: ${exam.title} on ${exam.formattedDate} at ${exam.formattedTime}. Venue: ${exam.venue || 'TBA'}`;
          await sendSMS(student.phone, smsMessage);
          results.sent++;
        } else {
          results.errors.push({
            user: student._id,
            type: 'sms',
            reason: 'SMS notifications disabled or no phone number'
          });
        }
      }
    } catch (error) {
      results.failed++;
      results.errors.push({
        user: student._id,
        type: type,
        reason: error.message
      });
    }
  }

  res.json({
    success: true,
    message: `Exam reminders sent. ${results.sent} successful, ${results.failed} failed.`,
    data: results
  });
}));

// @desc    Send result notification
// @route   POST /api/notifications/result-notification
// @access  Private/Admin/Teacher
router.post('/result-notification', authorize('admin', 'teacher'), [
  body('resultId')
    .isMongoId()
    .withMessage('Valid result ID is required'),
  body('type')
    .isIn(['email', 'sms', 'both'])
    .withMessage('Type must be email, sms, or both')
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

  const { resultId, type } = req.body;

  // Get result details
  const Result = require('../models/Result');
  const result = await Result.findById(resultId)
    .populate('student', 'firstName lastName email phone preferences')
    .populate('exam', 'title subject totalMarks');

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Result not found'
    });
  }

  // Check if teacher can send notifications for this result
  const Exam = require('../models/Exam');
  const exam = await Exam.findById(result.exam._id);
  
  if (req.user.role === 'teacher' && exam.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to send notifications for this result'
    });
  }

  const results = {
    sent: 0,
    failed: 0,
    errors: []
  };

  const subject = `Exam Result: ${result.exam.title}`;
  const message = `
Dear ${result.student.firstName} ${result.student.lastName},

Your exam result is now available:

Exam: ${result.exam.title}
Subject: ${result.exam.subject}
Marks Obtained: ${result.marksObtained}/${result.exam.totalMarks}
Percentage: ${result.percentage}%
Grade: ${result.grade}
Status: ${result.status === 'pass' ? 'PASS' : 'FAIL'}

${result.teacherComments ? `Teacher Comments: ${result.teacherComments}` : ''}

Keep up the good work!

Best regards,
ExamTrack360 Team
  `.trim();

  try {
    if (type === 'email' || type === 'both') {
      if (result.student.preferences?.notifications?.email) {
        await sendEmail(result.student.email, subject, message);
        results.sent++;
      } else {
        results.errors.push({
          user: result.student._id,
          type: 'email',
          reason: 'Email notifications disabled'
        });
      }
    }

    if (type === 'sms' || type === 'both') {
      if (result.student.phone && result.student.preferences?.notifications?.sms) {
        const smsMessage = `Result: ${result.exam.title} - ${result.percentage}% (${result.grade}) - ${result.status.toUpperCase()}`;
        await sendSMS(result.student.phone, smsMessage);
        results.sent++;
      } else {
        results.errors.push({
          user: result.student._id,
          type: 'sms',
          reason: 'SMS notifications disabled or no phone number'
        });
      }
    }
  } catch (error) {
    results.failed++;
    results.errors.push({
      user: result.student._id,
      type: type,
      reason: error.message
    });
  }

  res.json({
    success: true,
    message: `Result notification sent. ${results.sent} successful, ${results.failed} failed.`,
    data: results
  });
}));

// Helper function to send email
async function sendEmail(to, subject, message) {
  // This is a placeholder implementation
  // In production, you would use a service like Nodemailer, SendGrid, or Resend
  
  if (!process.env.EMAIL_HOST) {
    throw new Error('Email service not configured');
  }

  // Simulate email sending
  console.log(`Email sent to ${to}:`, { subject, message });
  
  // For now, we'll just return success
  return Promise.resolve();
}

// Helper function to send SMS
async function sendSMS(to, message) {
  // This is a placeholder implementation
  // In production, you would use a service like Twilio
  
  if (!process.env.TWILIO_ACCOUNT_SID) {
    throw new Error('SMS service not configured');
  }

  // Simulate SMS sending
  console.log(`SMS sent to ${to}:`, message);
  
  // For now, we'll just return success
  return Promise.resolve();
}

module.exports = router; 