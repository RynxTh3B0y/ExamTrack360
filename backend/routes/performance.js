const express = require('express');
const Result = require('../models/Result');
const Exam = require('../models/Exam');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// @desc    Get student performance overview
// @route   GET /api/performance/student/:studentId
// @access  Private
router.get('/student/:studentId', asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { period = 'all' } = req.query;

  // Check access permissions
  if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this student\'s performance'
    });
  }

  // Build date filter
  let dateFilter = {};
  if (period !== 'all') {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    dateFilter = { 'exam.date': { $gte: startDate } };
  }

  // Get student results
  const results = await Result.find({
    student: studentId,
    ...dateFilter
  })
    .populate('exam', 'title subject date examType totalMarks')
    .sort({ 'exam.date': 1 });

  if (results.length === 0) {
    return res.json({
      success: true,
      data: {
        overview: {
          totalExams: 0,
          averagePercentage: 0,
          highestPercentage: 0,
          lowestPercentage: 0,
          passRate: 0,
          totalMarks: 0,
          obtainedMarks: 0
        },
        subjectPerformance: [],
        recentResults: [],
        performanceTrend: []
      }
    });
  }

  // Calculate overview statistics
  const totalExams = results.length;
  const totalMarks = results.reduce((sum, result) => sum + result.totalMarks, 0);
  const obtainedMarks = results.reduce((sum, result) => sum + result.marksObtained, 0);
  const averagePercentage = Math.round((obtainedMarks / totalMarks) * 100);
  const highestPercentage = Math.max(...results.map(r => r.percentage));
  const lowestPercentage = Math.min(...results.map(r => r.percentage));
  const passCount = results.filter(r => r.status === 'pass').length;
  const passRate = Math.round((passCount / totalExams) * 100);

  // Calculate subject performance
  const subjectStats = {};
  results.forEach(result => {
    const subject = result.exam.subject;
    if (!subjectStats[subject]) {
      subjectStats[subject] = {
        subject,
        totalExams: 0,
        totalMarks: 0,
        obtainedMarks: 0,
        averagePercentage: 0
      };
    }
    subjectStats[subject].totalExams++;
    subjectStats[subject].totalMarks += result.totalMarks;
    subjectStats[subject].obtainedMarks += result.marksObtained;
  });

  const subjectPerformance = Object.values(subjectStats).map(stats => ({
    ...stats,
    averagePercentage: Math.round((stats.obtainedMarks / stats.totalMarks) * 100)
  }));

  // Get recent results (last 5)
  const recentResults = results
    .slice(-5)
    .reverse()
    .map(result => ({
      examTitle: result.exam.title,
      subject: result.exam.subject,
      date: result.exam.date,
      percentage: result.percentage,
      grade: result.grade,
      status: result.status
    }));

  // Performance trend (monthly averages)
  const monthlyStats = {};
  results.forEach(result => {
    const month = result.exam.date.toISOString().slice(0, 7); // YYYY-MM
    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        month,
        totalExams: 0,
        totalPercentage: 0,
        averagePercentage: 0
      };
    }
    monthlyStats[month].totalExams++;
    monthlyStats[month].totalPercentage += result.percentage;
  });

  const performanceTrend = Object.values(monthlyStats)
    .map(stats => ({
      ...stats,
      averagePercentage: Math.round(stats.totalPercentage / stats.totalExams)
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  res.json({
    success: true,
    data: {
      overview: {
        totalExams,
        averagePercentage,
        highestPercentage,
        lowestPercentage,
        passRate,
        totalMarks,
        obtainedMarks
      },
      subjectPerformance,
      recentResults,
      performanceTrend
    }
  });
}));

// @desc    Get class performance for exam
// @route   GET /api/performance/exam/:examId
// @access  Private
router.get('/exam/:examId', asyncHandler(async (req, res) => {
  const { examId } = req.params;

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

  // Get all results for this exam
  const results = await Result.findByExam(examId);

  if (results.length === 0) {
    return res.json({
      success: true,
      data: {
        examInfo: {
          title: exam.title,
          subject: exam.subject,
          totalMarks: exam.totalMarks,
          passingMarks: exam.passingMarks
        },
        overview: {
          totalStudents: 0,
          averagePercentage: 0,
          highestPercentage: 0,
          lowestPercentage: 0,
          passRate: 0
        },
        gradeDistribution: [],
        topPerformers: [],
        bottomPerformers: []
      }
    });
  }

  // Calculate overview statistics
  const totalStudents = results.length;
  const totalPercentage = results.reduce((sum, result) => sum + result.percentage, 0);
  const averagePercentage = Math.round(totalPercentage / totalStudents);
  const highestPercentage = Math.max(...results.map(r => r.percentage));
  const lowestPercentage = Math.min(...results.map(r => r.percentage));
  const passCount = results.filter(r => r.status === 'pass').length;
  const passRate = Math.round((passCount / totalStudents) * 100);

  // Grade distribution
  const gradeCounts = {};
  results.forEach(result => {
    gradeCounts[result.grade] = (gradeCounts[result.grade] || 0) + 1;
  });

  const gradeDistribution = Object.entries(gradeCounts).map(([grade, count]) => ({
    grade,
    count,
    percentage: Math.round((count / totalStudents) * 100)
  }));

  // Top performers (top 10)
  const topPerformers = results
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10)
    .map(result => ({
      studentName: `${result.student.firstName} ${result.student.lastName}`,
      studentId: result.student.studentId,
      percentage: result.percentage,
      grade: result.grade,
      marksObtained: result.marksObtained
    }));

  // Bottom performers (bottom 10)
  const bottomPerformers = results
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 10)
    .map(result => ({
      studentName: `${result.student.firstName} ${result.student.lastName}`,
      studentId: result.student.studentId,
      percentage: result.percentage,
      grade: result.grade,
      marksObtained: result.marksObtained
    }));

  res.json({
    success: true,
    data: {
      examInfo: {
        title: exam.title,
        subject: exam.subject,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks
      },
      overview: {
        totalStudents,
        averagePercentage,
        highestPercentage,
        lowestPercentage,
        passRate
      },
      gradeDistribution,
      topPerformers,
      bottomPerformers
    }
  });
}));

// @desc    Get teacher performance overview
// @route   GET /api/performance/teacher/:teacherId
// @access  Private/Admin
router.get('/teacher/:teacherId', authorize('admin'), asyncHandler(async (req, res) => {
  const { teacherId } = req.params;
  const { period = 'all' } = req.query;

  // Build date filter
  let dateFilter = {};
  if (period !== 'all') {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    dateFilter = { date: { $gte: startDate } };
  }

  // Get teacher's exams
  const exams = await Exam.find({
    teacher: teacherId,
    ...dateFilter
  }).sort({ date: 1 });

  if (exams.length === 0) {
    return res.json({
      success: true,
      data: {
        overview: {
          totalExams: 0,
          totalStudents: 0,
          averageClassPerformance: 0,
          totalResults: 0
        },
        examPerformance: [],
        subjectPerformance: []
      }
    });
  }

  // Get all results for these exams
  const examIds = exams.map(exam => exam._id);
  const results = await Result.find({ exam: { $in: examIds } })
    .populate('exam', 'title subject date totalMarks');

  // Calculate overview
  const totalExams = exams.length;
  const totalResults = results.length;
  const totalStudents = new Set(results.map(r => r.student.toString())).size;
  const averageClassPerformance = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0;

  // Calculate exam performance
  const examStats = {};
  results.forEach(result => {
    const examId = result.exam._id.toString();
    if (!examStats[examId]) {
      examStats[examId] = {
        examTitle: result.exam.title,
        subject: result.exam.subject,
        date: result.exam.date,
        totalStudents: 0,
        totalPercentage: 0,
        averagePercentage: 0,
        passCount: 0,
        passRate: 0
      };
    }
    examStats[examId].totalStudents++;
    examStats[examId].totalPercentage += result.percentage;
    if (result.status === 'pass') {
      examStats[examId].passCount++;
    }
  });

  const examPerformance = Object.values(examStats).map(stats => ({
    ...stats,
    averagePercentage: Math.round(stats.totalPercentage / stats.totalStudents),
    passRate: Math.round((stats.passCount / stats.totalStudents) * 100)
  }));

  // Calculate subject performance
  const subjectStats = {};
  results.forEach(result => {
    const subject = result.exam.subject;
    if (!subjectStats[subject]) {
      subjectStats[subject] = {
        subject,
        totalExams: 0,
        totalStudents: 0,
        totalPercentage: 0,
        averagePercentage: 0
      };
    }
    subjectStats[subject].totalStudents++;
    subjectStats[subject].totalPercentage += result.percentage;
  });

  // Count unique exams per subject
  const subjectExamCounts = {};
  exams.forEach(exam => {
    subjectExamCounts[exam.subject] = (subjectExamCounts[exam.subject] || 0) + 1;
  });

  const subjectPerformance = Object.values(subjectStats).map(stats => ({
    ...stats,
    totalExams: subjectExamCounts[stats.subject] || 0,
    averagePercentage: Math.round(stats.totalPercentage / stats.totalStudents)
  }));

  res.json({
    success: true,
    data: {
      overview: {
        totalExams,
        totalStudents,
        averageClassPerformance,
        totalResults
      },
      examPerformance,
      subjectPerformance
    }
  });
}));

// @desc    Get dashboard statistics
// @route   GET /api/performance/dashboard
// @access  Private
router.get('/dashboard', asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  let stats = {};

  if (req.user.role === 'admin') {
    // Admin dashboard stats
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalTeachers = await User.countDocuments({ role: 'teacher', isActive: true });
    const totalExams = await Exam.countDocuments();
    const totalResults = await Result.countDocuments();

    const monthlyExams = await Exam.countDocuments({ 
      createdAt: { $gte: startOfMonth } 
    });
    const monthlyResults = await Result.countDocuments({ 
      createdAt: { $gte: startOfMonth } 
    });

    stats = {
      totalStudents,
      totalTeachers,
      totalExams,
      totalResults,
      monthlyExams,
      monthlyResults
    };
  } else if (req.user.role === 'teacher') {
    // Teacher dashboard stats
    const teacherExams = await Exam.find({ teacher: req.user._id });
    const examIds = teacherExams.map(exam => exam._id);
    
    const totalExams = teacherExams.length;
    const totalResults = await Result.countDocuments({ exam: { $in: examIds } });
    const monthlyExams = await Exam.countDocuments({ 
      teacher: req.user._id,
      createdAt: { $gte: startOfMonth } 
    });
    const monthlyResults = await Result.countDocuments({ 
      exam: { $in: examIds },
      createdAt: { $gte: startOfMonth } 
    });

    // Average class performance
    const results = await Result.find({ exam: { $in: examIds } });
    const averagePerformance = results.length > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : 0;

    stats = {
      totalExams,
      totalResults,
      monthlyExams,
      monthlyResults,
      averagePerformance
    };
  } else if (req.user.role === 'student') {
    // Student dashboard stats
    const totalExams = await Exam.countDocuments({
      $or: [
        { targetGrades: req.user.grade },
        { targetStudents: req.user._id }
      ]
    });

    const results = await Result.find({ student: req.user._id });
    const totalResults = results.length;
    const averagePerformance = results.length > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : 0;

    const upcomingExams = await Exam.countDocuments({
      $or: [
        { targetGrades: req.user.grade },
        { targetStudents: req.user._id }
      ],
      date: { $gte: now },
      status: { $ne: 'cancelled' }
    });

    stats = {
      totalExams,
      totalResults,
      averagePerformance,
      upcomingExams
    };
  }

  res.json({
    success: true,
    data: stats
  });
}));

module.exports = router; 