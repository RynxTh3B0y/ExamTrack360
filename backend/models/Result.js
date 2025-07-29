const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam is required']
  },
  marksObtained: {
    type: Number,
    required: [true, 'Marks obtained is required'],
    min: [0, 'Marks cannot be negative'],
    max: [1000, 'Marks cannot exceed 1000']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: [1, 'Total marks must be at least 1']
  },
  percentage: {
    type: Number,
    required: [true, 'Percentage is required'],
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100']
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'],
    required: [true, 'Grade is required']
  },
  status: {
    type: String,
    enum: ['pass', 'fail'],
    required: [true, 'Status is required']
  },
  // Detailed breakdown of marks (optional)
  breakdown: {
    theory: {
      marks: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    practical: {
      marks: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    assignment: {
      marks: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    }
  },
  // Comments from teacher
  teacherComments: {
    type: String,
    trim: true,
    maxlength: [500, 'Comments cannot exceed 500 characters']
  },
  // Student remarks (optional)
  studentRemarks: {
    type: String,
    trim: true,
    maxlength: [500, 'Remarks cannot exceed 500 characters']
  },
  // Attendance and participation
  attendance: {
    type: Boolean,
    default: true
  },
  participation: {
    type: Number,
    min: [0, 'Participation cannot be negative'],
    max: [10, 'Participation cannot exceed 10'],
    default: 0
  },
  // Submission details
  submittedAt: {
    type: Date,
    default: Date.now
  },
  // Graded by
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Graded by is required']
  },
  // Review status
  reviewed: {
    type: Boolean,
    default: false
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Appeal status
  appealed: {
    type: Boolean,
    default: false
  },
  appealReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Appeal reason cannot exceed 500 characters']
  },
  appealStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for grade point
resultSchema.virtual('gradePoint').get(function() {
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };
  return gradePoints[this.grade] || 0;
});

// Virtual for performance level
resultSchema.virtual('performanceLevel').get(function() {
  if (this.percentage >= 90) return 'Excellent';
  if (this.percentage >= 80) return 'Very Good';
  if (this.percentage >= 70) return 'Good';
  if (this.percentage >= 60) return 'Satisfactory';
  if (this.percentage >= 50) return 'Average';
  return 'Needs Improvement';
});

// Virtual for color based on performance
resultSchema.virtual('performanceColor').get(function() {
  if (this.percentage >= 90) return 'green';
  if (this.percentage >= 80) return 'blue';
  if (this.percentage >= 70) return 'yellow';
  if (this.percentage >= 60) return 'orange';
  return 'red';
});

// Indexes for better query performance
resultSchema.index({ student: 1, exam: 1 }, { unique: true });
resultSchema.index({ exam: 1 });
resultSchema.index({ student: 1 });
resultSchema.index({ grade: 1 });
resultSchema.index({ status: 1 });
resultSchema.index({ submittedAt: -1 });

// Pre-save middleware to calculate percentage and grade
resultSchema.pre('save', function(next) {
  // Calculate percentage
  this.percentage = Math.round((this.marksObtained / this.totalMarks) * 100);
  
  // Determine grade based on percentage
  if (this.percentage >= 97) this.grade = 'A+';
  else if (this.percentage >= 93) this.grade = 'A';
  else if (this.percentage >= 90) this.grade = 'A-';
  else if (this.percentage >= 87) this.grade = 'B+';
  else if (this.percentage >= 83) this.grade = 'B';
  else if (this.percentage >= 80) this.grade = 'B-';
  else if (this.percentage >= 77) this.grade = 'C+';
  else if (this.percentage >= 73) this.grade = 'C';
  else if (this.percentage >= 70) this.grade = 'C-';
  else if (this.percentage >= 67) this.grade = 'D+';
  else if (this.percentage >= 60) this.grade = 'D';
  else this.grade = 'F';
  
  // Determine pass/fail status
  this.status = this.percentage >= 60 ? 'pass' : 'fail';
  
  next();
});

// Static method to find results by student
resultSchema.statics.findByStudent = function(studentId) {
  return this.find({ student: studentId })
    .populate('exam', 'title subject date examType')
    .sort({ 'exam.date': -1 });
};

// Static method to find results by exam
resultSchema.statics.findByExam = function(examId) {
  return this.find({ exam: examId })
    .populate('student', 'firstName lastName studentId grade section')
    .populate('gradedBy', 'firstName lastName')
    .sort({ marksObtained: -1 });
};

// Static method to find top performers
resultSchema.statics.findTopPerformers = function(limit = 10) {
  return this.find()
    .populate('student', 'firstName lastName studentId grade section')
    .populate('exam', 'title subject')
    .sort({ percentage: -1 })
    .limit(limit);
};

// Static method to calculate class average
resultSchema.statics.getClassAverage = function(examId) {
  return this.aggregate([
    { $match: { exam: mongoose.Types.ObjectId(examId) } },
    { $group: { _id: null, avgPercentage: { $avg: '$percentage' } } }
  ]);
};

// Static method to find failing students
resultSchema.statics.findFailingStudents = function(examId) {
  return this.find({ exam: examId, status: 'fail' })
    .populate('student', 'firstName lastName studentId grade section')
    .sort({ percentage: 1 });
};

module.exports = mongoose.model('Result', resultSchema); 