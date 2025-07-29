const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true,
    maxlength: [100, 'Exam title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  examType: {
    type: String,
    enum: ['midterm', 'final', 'quiz', 'assignment', 'project'],
    default: 'midterm'
  },
  date: {
    type: Date,
    required: [true, 'Exam date is required']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Exam duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [480, 'Duration cannot exceed 8 hours']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: [1, 'Total marks must be at least 1']
  },
  passingMarks: {
    type: Number,
    required: [true, 'Passing marks is required'],
    min: [1, 'Passing marks must be at least 1']
  },
  venue: {
    type: String,
    trim: true,
    maxlength: [200, 'Venue cannot exceed 200 characters']
  },
  instructions: {
    type: String,
    trim: true,
    maxlength: [1000, 'Instructions cannot exceed 1000 characters']
  },
  // Target grades/sections for this exam
  targetGrades: [{
    type: String,
    trim: true
  }],
  targetSections: [{
    type: String,
    trim: true
  }],
  // Specific students (if not all students in grade/section)
  targetStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Teacher responsible for this exam
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher is required']
  },
  // Status of the exam
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  // Results published or not
  resultsPublished: {
    type: Boolean,
    default: false
  },
  // Additional metadata
  metadata: {
    syllabus: String,
    topics: [String],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  },
  // File attachments (question papers, etc.)
  attachments: [{
    filename: String,
    originalName: String,
    url: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Created by (usually admin or teacher)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for exam status based on date
examSchema.virtual('examStatus').get(function() {
  const now = new Date();
  const examDate = new Date(this.date);
  const endTime = new Date(examDate.getTime() + this.duration * 60000);
  
  if (this.status === 'cancelled') return 'cancelled';
  if (now < examDate) return 'upcoming';
  if (now >= examDate && now <= endTime) return 'ongoing';
  return 'completed';
});

// Virtual for formatted date
examSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for formatted time
examSchema.virtual('formattedTime').get(function() {
  return this.date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for end time
examSchema.virtual('endTime').get(function() {
  const endTime = new Date(this.date.getTime() + this.duration * 60000);
  return endTime;
});

// Indexes for better query performance
examSchema.index({ date: 1 });
examSchema.index({ subject: 1 });
examSchema.index({ teacher: 1 });
examSchema.index({ status: 1 });
examSchema.index({ targetGrades: 1 });
examSchema.index({ 'metadata.difficulty': 1 });

// Pre-save middleware to validate dates
examSchema.pre('save', function(next) {
  if (this.passingMarks > this.totalMarks) {
    return next(new Error('Passing marks cannot exceed total marks'));
  }
  next();
});

// Static method to find upcoming exams
examSchema.statics.findUpcoming = function() {
  return this.find({
    date: { $gte: new Date() },
    status: { $ne: 'cancelled' }
  }).sort({ date: 1 });
};

// Static method to find exams by teacher
examSchema.statics.findByTeacher = function(teacherId) {
  return this.find({ teacher: teacherId }).sort({ date: -1 });
};

// Static method to find exams by grade
examSchema.statics.findByGrade = function(grade) {
  return this.find({ targetGrades: grade }).sort({ date: -1 });
};

// Static method to find completed exams
examSchema.statics.findCompleted = function() {
  return this.find({
    date: { $lt: new Date() },
    status: { $ne: 'cancelled' }
  }).sort({ date: -1 });
};

module.exports = mongoose.model('Exam', examSchema); 