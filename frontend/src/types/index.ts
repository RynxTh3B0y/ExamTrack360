// User types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  studentId?: string;
  teacherId?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  grade?: string;
  section?: string;
  subjects?: string[];
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
    };
    theme: 'light' | 'dark';
  };
  fullName: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

// Exam types
export interface Exam {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  examType: 'midterm' | 'final' | 'quiz' | 'assignment' | 'project';
  date: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  venue?: string;
  instructions?: string;
  targetGrades: string[];
  targetSections: string[];
  targetStudents?: string[];
  teacher: User;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  resultsPublished: boolean;
  metadata?: {
    syllabus?: string;
    topics?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
  };
  attachments?: Array<{
    filename: string;
    originalName: string;
    url: string;
    size: number;
    uploadedAt: string;
  }>;
  createdBy: User;
  examStatus: string;
  formattedDate: string;
  formattedTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

// Result types
export interface Result {
  _id: string;
  student: User;
  exam: Exam;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';
  status: 'pass' | 'fail';
  breakdown?: {
    theory: { marks: number; total: number };
    practical: { marks: number; total: number };
    assignment: { marks: number; total: number };
  };
  teacherComments?: string;
  studentRemarks?: string;
  attendance: boolean;
  participation: number;
  submittedAt: string;
  gradedBy: User;
  reviewed: boolean;
  reviewedAt?: string;
  reviewedBy?: User;
  appealed: boolean;
  appealReason?: string;
  appealStatus?: 'pending' | 'approved' | 'rejected';
  gradePoint: number;
  performanceLevel: string;
  performanceColor: string;
  createdAt: string;
  updatedAt: string;
}

// Performance types
export interface PerformanceOverview {
  totalExams: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  passRate: number;
  totalMarks: number;
  obtainedMarks: number;
}

export interface SubjectPerformance {
  subject: string;
  totalExams: number;
  totalMarks: number;
  obtainedMarks: number;
  averagePercentage: number;
}

export interface RecentResult {
  examTitle: string;
  subject: string;
  date: string;
  percentage: number;
  grade: string;
  status: string;
}

export interface PerformanceTrend {
  month: string;
  totalExams: number;
  totalPercentage: number;
  averagePercentage: number;
}

export interface ClassPerformance {
  examInfo: {
    title: string;
    subject: string;
    totalMarks: number;
    passingMarks: number;
  };
  overview: {
    totalStudents: number;
    averagePercentage: number;
    highestPercentage: number;
    lowestPercentage: number;
    passRate: number;
  };
  gradeDistribution: Array<{
    grade: string;
    count: number;
    percentage: number;
  }>;
  topPerformers: Array<{
    studentName: string;
    studentId: string;
    percentage: number;
    grade: string;
    marksObtained: number;
  }>;
  bottomPerformers: Array<{
    studentName: string;
    studentId: string;
    percentage: number;
    grade: string;
    marksObtained: number;
  }>;
}

// Dashboard types
export interface DashboardStats {
  totalStudents?: number;
  totalTeachers?: number;
  totalExams?: number;
  totalResults?: number;
  monthlyExams?: number;
  monthlyResults?: number;
  averagePerformance?: number;
  upcomingExams?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  studentId?: string;
  teacherId?: string;
  phone?: string;
  grade?: string;
  section?: string;
  subjects?: string[];
}

export interface ExamForm {
  title: string;
  description?: string;
  subject: string;
  examType: 'midterm' | 'final' | 'quiz' | 'assignment' | 'project';
  date: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  venue?: string;
  instructions?: string;
  targetGrades: string[];
  targetSections?: string[];
  targetStudents?: string[];
  metadata?: {
    syllabus?: string;
    topics?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
  };
}

export interface ResultForm {
  student: string;
  exam: string;
  marksObtained: number;
  totalMarks: number;
  breakdown?: {
    theory: { marks: number; total: number };
    practical: { marks: number; total: number };
    assignment: { marks: number; total: number };
  };
  teacherComments?: string;
  attendance: boolean;
  participation: number;
}

// Notification types
export interface NotificationForm {
  type: 'email' | 'sms' | 'both';
  recipients: string[];
  subject: string;
  message: string;
}

// Filter types
export interface ExamFilters {
  subject?: string;
  examType?: string;
  status?: string;
  teacher?: string;
  grade?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ResultFilters {
  exam?: string;
  student?: string;
  grade?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserFilters {
  role?: string;
  grade?: string;
  section?: string;
  search?: string;
  page?: number;
  limit?: number;
} 