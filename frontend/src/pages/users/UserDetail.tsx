import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Award,
  BookOpen,
  FileText,
  TrendingUp,
  Users,
  Shield,
  GraduationCap,
  CheckCircle,
  XCircle,
  Eye,
  Download
} from 'lucide-react';
import { User, Exam, Result } from '@/types';

interface UserDetailData {
  user: User;
  examHistory: Array<{
    exam: Exam;
    result: Result;
  }>;
  performanceStats: {
    totalExams: number;
    averageScore: number;
    passRate: number;
    bestSubject: string;
    improvementRate: number;
  };
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@examtrack360.com',
        role: 'student',
        phone: '+1234567892',
        isActive: true,
        createdAt: '2024-02-01T14:15:00Z',
        avatar: null,
        studentId: 'S001',
        teacherId: null,
        grade: '10',
        section: 'A',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
        preferences: {
          notifications: { email: true, sms: false },
          theme: 'light'
        }
      };

      const mockExams: Exam[] = [
        {
          id: '1',
          title: 'Mid-Term Mathematics Exam',
          subject: 'Mathematics',
          examType: 'midterm',
          date: '2024-03-15T09:00:00Z',
          duration: 120,
          totalMarks: 100,
          passingMarks: 40,
          venue: 'Room 101',
          instructions: 'Bring calculator and writing materials',
          targetGrades: ['10'],
          targetSections: ['A', 'B'],
          targetStudents: [],
          teacher: 'Dr. Sarah Johnson',
          status: 'completed',
          resultsPublished: true,
          metadata: {},
          attachments: [],
          createdBy: 'admin',
          createdAt: '2024-02-01T10:00:00Z',
          updatedAt: '2024-02-01T10:00:00Z'
        },
        {
          id: '2',
          title: 'Physics Quiz - Chapter 5',
          subject: 'Physics',
          examType: 'quiz',
          date: '2024-03-10T14:00:00Z',
          duration: 45,
          totalMarks: 50,
          passingMarks: 25,
          venue: 'Lab 2',
          instructions: 'Multiple choice questions only',
          targetGrades: ['11'],
          targetSections: ['A'],
          targetStudents: [],
          teacher: 'Prof. Robert Smith',
          status: 'completed',
          resultsPublished: true,
          metadata: {},
          attachments: [],
          createdBy: 'teacher',
          createdAt: '2024-02-28T15:30:00Z',
          updatedAt: '2024-03-10T16:00:00Z'
        }
      ];

      const mockResults: Result[] = [
        {
          id: '1',
          student: '1',
          exam: '1',
          marksObtained: 85,
          totalMarks: 100,
          percentage: 85,
          grade: 'A',
          status: 'passed',
          remarks: 'Excellent performance',
          submittedAt: '2024-03-15T11:00:00Z',
          gradedAt: '2024-03-15T16:00:00Z',
          gradedBy: 'Dr. Sarah Johnson',
          metadata: {},
          attachments: []
        },
        {
          id: '2',
          student: '1',
          exam: '2',
          marksObtained: 45,
          totalMarks: 50,
          percentage: 90,
          grade: 'A+',
          status: 'passed',
          remarks: 'Outstanding performance',
          submittedAt: '2024-03-10T14:45:00Z',
          gradedAt: '2024-03-10T15:30:00Z',
          gradedBy: 'Prof. Robert Smith',
          metadata: {},
          attachments: []
        }
      ];

      const examHistory = mockExams.map(exam => ({
        exam,
        result: mockResults.find(r => r.exam === exam.id)!
      }));

      const performanceStats = {
        totalExams: examHistory.length,
        averageScore: examHistory.reduce((sum, item) => sum + item.result.percentage, 0) / examHistory.length,
        passRate: (examHistory.filter(item => item.result.status === 'passed').length / examHistory.length) * 100,
        bestSubject: 'Physics',
        improvementRate: 12.5
      };

      setUserData({
        user: mockUser,
        examHistory,
        performanceStats
      });
      setIsLoading(false);
    };

    loadUserData();
  }, [id]);

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: 'bg-red-100 text-red-800', icon: Shield },
      teacher: { color: 'bg-blue-100 text-blue-800', icon: GraduationCap },
      student: { color: 'bg-green-100 text-green-800', icon: Users }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.student;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  const getGradeBadge = (grade: string) => {
    const gradeConfig: { [key: string]: { color: string, bgColor: string } } = {
      'A+': { color: 'text-green-800', bgColor: 'bg-green-100' },
      'A': { color: 'text-green-700', bgColor: 'bg-green-50' },
      'B+': { color: 'text-blue-800', bgColor: 'bg-blue-100' },
      'B': { color: 'text-blue-700', bgColor: 'bg-blue-50' },
      'C+': { color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
      'C': { color: 'text-yellow-700', bgColor: 'bg-yellow-50' },
      'D': { color: 'text-orange-800', bgColor: 'bg-orange-100' },
      'F': { color: 'text-red-800', bgColor: 'bg-red-100' }
    };
    
    const config = gradeConfig[grade] || { color: 'text-gray-800', bgColor: 'bg-gray-100' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        {grade}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/users')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {userData.user.firstName} {userData.user.lastName}
                </h1>
                <p className="text-gray-600 mt-1">
                  User Details & Performance
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to={`/users/${id}/edit`}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Link>
              <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="text-center mb-6">
                <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary-600">
                    {userData.user.firstName.charAt(0)}{userData.user.lastName.charAt(0)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {userData.user.firstName} {userData.user.lastName}
                </h2>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  {getRoleBadge(userData.user.role)}
                  {getStatusBadge(userData.user.isActive)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{userData.user.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{userData.user.phone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">
                    Joined {formatDate(userData.user.createdAt)}
                  </span>
                </div>
                {userData.user.studentId && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">ID: {userData.user.studentId}</span>
                  </div>
                )}
                {userData.user.grade && (
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">
                      Grade {userData.user.grade} - Section {userData.user.section}
                    </span>
                  </div>
                )}
              </div>

              {userData.user.subjects && userData.user.subjects.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.user.subjects.map(subject => (
                      <span key={subject} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Performance Statistics */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Exams</p>
                    <p className="text-2xl font-bold text-gray-900">{userData.performanceStats.totalExams}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userData.performanceStats.averageScore.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userData.performanceStats.passRate.toFixed(1)}%
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
                    <p className="text-sm font-medium text-gray-600">Best Subject</p>
                    <p className="text-2xl font-bold text-gray-900">{userData.performanceStats.bestSubject}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Exam History */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Exam History</h2>
                <button className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export Report
                </button>
              </div>

              {userData.examHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exam
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userData.examHistory.map((item) => (
                        <tr key={item.exam.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.exam.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.exam.subject}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.exam.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.result.marksObtained}/{item.result.totalMarks}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.result.percentage}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getGradeBadge(item.result.grade)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.result.status === 'passed' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Passed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3 mr-1" />
                                Failed
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link
                              to={`/results/${item.result.id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No exam history</h3>
                  <p className="text-gray-600">This user hasn't taken any exams yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail; 