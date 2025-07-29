import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Award, 
  Target,
  Calendar,
  Filter,
  Download,
  Eye,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  Clock
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PerformanceData {
  subjectPerformance: Array<{
    subject: string;
    averageScore: number;
    totalStudents: number;
    passRate: number;
    improvement: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    averageScore: number;
    totalExams: number;
    passRate: number;
  }>;
  gradeDistribution: Array<{
    grade: string;
    count: number;
    percentage: number;
  }>;
  topPerformers: Array<{
    studentId: string;
    studentName: string;
    subject: string;
    averageScore: number;
    totalExams: number;
    improvement: number;
  }>;
  needsAttention: Array<{
    studentId: string;
    studentName: string;
    subject: string;
    currentScore: number;
    trend: 'up' | 'down';
    lastExam: string;
  }>;
  examPerformance: Array<{
    examTitle: string;
    subject: string;
    date: string;
    averageScore: number;
    totalStudents: number;
    passRate: number;
  }>;
}

const Performance: React.FC = () => {
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [timeRange, setTimeRange] = useState('3months');

  useEffect(() => {
    // Simulate loading performance data
    const loadPerformanceData = async () => {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock performance data - filter by teacher's subjects if teacher
      const mockData: PerformanceData = {
        subjectPerformance: [
          {
            subject: 'Mathematics',
            averageScore: 82.5,
            totalStudents: 45,
            passRate: 91.1,
            improvement: 5.2
          },
          {
            subject: 'Physics',
            averageScore: 78.3,
            totalStudents: 38,
            passRate: 86.8,
            improvement: 3.8
          },
          {
            subject: 'Chemistry',
            averageScore: 85.7,
            totalStudents: 42,
            passRate: 95.2,
            improvement: 7.1
          },
          {
            subject: 'Biology',
            averageScore: 79.2,
            totalStudents: 35,
            passRate: 88.6,
            improvement: 2.9
          }
        ],
        monthlyTrends: [
          { month: 'Jan', averageScore: 75.2, totalExams: 8, passRate: 82.5 },
          { month: 'Feb', averageScore: 78.1, totalExams: 12, passRate: 85.3 },
          { month: 'Mar', averageScore: 81.4, totalExams: 15, passRate: 88.7 },
          { month: 'Apr', averageScore: 83.2, totalExams: 18, passRate: 91.2 },
          { month: 'May', averageScore: 85.7, totalExams: 22, passRate: 93.8 },
          { month: 'Jun', averageScore: 87.3, totalExams: 25, passRate: 95.1 }
        ],
        gradeDistribution: [
          { grade: 'A+', count: 25, percentage: 15.6 },
          { grade: 'A', count: 45, percentage: 28.1 },
          { grade: 'B+', count: 38, percentage: 23.8 },
          { grade: 'B', count: 28, percentage: 17.5 },
          { grade: 'C+', count: 15, percentage: 9.4 },
          { grade: 'C', count: 6, percentage: 3.8 },
          { grade: 'D', count: 2, percentage: 1.3 },
          { grade: 'F', count: 1, percentage: 0.6 }
        ],
        topPerformers: [
          {
            studentId: 'S001',
            studentName: 'Michael Chen',
            subject: 'Mathematics',
            averageScore: 95.2,
            totalExams: 8,
            improvement: 12.5
          },
          {
            studentId: 'S002',
            studentName: 'Emily Wilson',
            subject: 'Physics',
            averageScore: 92.8,
            totalExams: 6,
            improvement: 8.3
          },
          {
            studentId: 'S003',
            studentName: 'David Brown',
            subject: 'Chemistry',
            averageScore: 91.5,
            totalExams: 7,
            improvement: 15.2
          },
          {
            studentId: 'S004',
            studentName: 'Sarah Johnson',
            subject: 'Mathematics',
            averageScore: 89.7,
            totalExams: 8,
            improvement: 6.8
          }
        ],
        needsAttention: [
          {
            studentId: 'S005',
            studentName: 'Alex Thompson',
            subject: 'Physics',
            currentScore: 62.3,
            trend: 'down',
            lastExam: '2024-03-15'
          },
          {
            studentId: 'S006',
            studentName: 'Lisa Wang',
            subject: 'Mathematics',
            currentScore: 58.7,
            trend: 'down',
            lastExam: '2024-03-10'
          },
          {
            studentId: 'S007',
            studentName: 'James Lee',
            subject: 'Chemistry',
            currentScore: 65.1,
            trend: 'up',
            lastExam: '2024-03-12'
          }
        ],
        examPerformance: [
          {
            examTitle: 'Mid-Term Mathematics Exam',
            subject: 'Mathematics',
            date: '2024-03-15',
            averageScore: 84.2,
            totalStudents: 45,
            passRate: 93.3
          },
          {
            examTitle: 'Physics Quiz - Chapter 5',
            subject: 'Physics',
            date: '2024-03-10',
            averageScore: 78.5,
            totalStudents: 38,
            passRate: 86.8
          },
          {
            examTitle: 'Chemistry Lab Practical',
            subject: 'Chemistry',
            date: '2024-03-08',
            averageScore: 87.3,
            totalStudents: 42,
            passRate: 95.2
          },
          {
            examTitle: 'Biology Test - Cell Biology',
            subject: 'Biology',
            date: '2024-03-05',
            averageScore: 79.8,
            totalStudents: 35,
            passRate: 88.6
          }
        ]
      };

      // Filter data based on teacher's subjects
      if (user?.role === 'teacher' && user.subjects) {
        mockData.subjectPerformance = mockData.subjectPerformance.filter(
          subject => user.subjects?.includes(subject.subject)
        );
        mockData.examPerformance = mockData.examPerformance.filter(
          exam => user.subjects?.includes(exam.subject)
        );
        mockData.topPerformers = mockData.topPerformers.filter(
          student => user.subjects?.includes(student.subject)
        );
        mockData.needsAttention = mockData.needsAttention.filter(
          student => user.subjects?.includes(student.subject)
        );
      }

      setPerformanceData(mockData);
      setIsLoading(false);
    };

    loadPerformanceData();
  }, [user]);

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Mathematics': '#3B82F6',
      'Physics': '#10B981',
      'Chemistry': '#8B5CF6',
      'Biology': '#F59E0B',
      'English': '#EF4444',
      'History': '#06B6D4'
    };
    return colors[subject] || '#6B7280';
  };

  const getGradeColor = (grade: string) => {
    const colors: { [key: string]: string } = {
      'A+': '#10B981',
      'A': '#34D399',
      'B+': '#3B82F6',
      'B': '#60A5FA',
      'C+': '#F59E0B',
      'C': '#FBBF24',
      'D': '#F97316',
      'F': '#EF4444'
    };
    return colors[grade] || '#6B7280';
  };

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No performance data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.role === 'teacher' ? 'My Class Performance' : 'Performance Analytics'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'teacher' 
                  ? 'Track your students\' performance across your subjects'
                  : 'Comprehensive performance analytics and insights'
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Subjects</option>
                {performanceData.subjectPerformance.map(subject => (
                  <option key={subject.subject} value={subject.subject}>
                    {subject.subject}
                  </option>
                ))}
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Average</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData.subjectPerformance.reduce((sum, subject) => sum + subject.averageScore, 0) / performanceData.subjectPerformance.length}%
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData.subjectPerformance.reduce((sum, subject) => sum + subject.totalStudents, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Pass Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData.subjectPerformance.reduce((sum, subject) => sum + subject.passRate, 0) / performanceData.subjectPerformance.length}%
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData.examPerformance.length}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subject Performance */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Subject Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData.subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageScore" fill="#3B82F6" name="Average Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="averageScore" stroke="#3B82F6" strokeWidth={2} name="Average Score" />
                <Line type="monotone" dataKey="passRate" stroke="#10B981" strokeWidth={2} name="Pass Rate" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Grade Distribution */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Grade Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData.gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {performanceData.gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getGradeColor(entry.grade)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Exam Performance */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Exam Performance</h2>
            <div className="space-y-4">
              {performanceData.examPerformance.slice(0, 5).map((exam, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{exam.examTitle}</h3>
                    <p className="text-sm text-gray-600">{exam.subject} • {formatDate(exam.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{exam.averageScore}%</p>
                    <p className="text-sm text-gray-600">{exam.passRate}% pass rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Top Performers</h2>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="space-y-4">
              {performanceData.topPerformers.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-green-600">
                        {student.studentName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{student.studentName}</h3>
                      <p className="text-sm text-gray-600">{student.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{student.averageScore}%</p>
                    <p className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{student.improvement}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Students Needing Attention */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Needs Attention</h2>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="space-y-4">
              {performanceData.needsAttention.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-red-600">
                        {student.studentName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{student.studentName}</h3>
                      <p className="text-sm text-gray-600">{student.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{student.currentScore}%</p>
                    <div className="flex items-center">
                      {getTrendIcon(student.trend)}
                      <span className="text-sm text-gray-600 ml-1">
                        {formatDate(student.lastExam)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance; 