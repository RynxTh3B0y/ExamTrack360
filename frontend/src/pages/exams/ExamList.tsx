import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  BarChart3,
  Award,
  MessageSquare,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Exam } from '@/types';

const ExamList: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('examId');
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [examsPerPage] = useState(10);

  useEffect(() => {
    // Simulate loading exams data
    const loadExams = async () => {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock exams data - filter by teacher if user is teacher
      const allExams: Exam[] = [
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
          status: 'scheduled',
          resultsPublished: false,
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
        },
        {
          id: '3',
          title: 'Chemistry Final Exam',
          subject: 'Chemistry',
          examType: 'final',
          date: '2024-04-20T10:00:00Z',
          duration: 180,
          totalMarks: 150,
          passingMarks: 60,
          venue: 'Auditorium',
          instructions: 'Comprehensive exam covering all chapters',
          targetGrades: ['12'],
          targetSections: ['A', 'B', 'C'],
          targetStudents: [],
          teacher: 'Dr. Emily Wilson',
          status: 'scheduled',
          resultsPublished: false,
          metadata: {},
          attachments: [],
          createdBy: 'admin',
          createdAt: '2024-03-01T09:00:00Z',
          updatedAt: '2024-03-01T09:00:00Z'
        },
        {
          id: '4',
          title: 'English Literature Test',
          subject: 'English',
          examType: 'test',
          date: '2024-03-05T11:00:00Z',
          duration: 90,
          totalMarks: 80,
          passingMarks: 32,
          venue: 'Room 205',
          instructions: 'Essay writing and comprehension',
          targetGrades: ['10'],
          targetSections: ['A'],
          targetStudents: [],
          teacher: 'Ms. Jennifer Brown',
          status: 'completed',
          resultsPublished: false,
          metadata: {},
          attachments: [],
          createdBy: 'teacher',
          createdAt: '2024-02-25T13:00:00Z',
          updatedAt: '2024-03-05T12:30:00Z'
        },
        {
          id: '5',
          title: 'Biology Lab Practical',
          subject: 'Biology',
          examType: 'practical',
          date: '2024-03-18T13:00:00Z',
          duration: 120,
          totalMarks: 60,
          passingMarks: 24,
          venue: 'Biology Lab',
          instructions: 'Lab coat and safety goggles required',
          targetGrades: ['11'],
          targetSections: ['B'],
          targetStudents: [],
          teacher: 'Dr. Michael Chen',
          status: 'scheduled',
          resultsPublished: false,
          metadata: {},
          attachments: [],
          createdBy: 'teacher',
          createdAt: '2024-03-02T16:00:00Z',
          updatedAt: '2024-03-02T16:00:00Z'
        }
      ];

      // Filter exams based on user role
      let filteredExams = allExams;
      if (user?.role === 'teacher') {
        // Show only exams created by this teacher
        filteredExams = allExams.filter(exam => exam.teacher === `${user.firstName} ${user.lastName}`);
      }

      setExams(filteredExams);
      setFilteredExams(filteredExams);
      setIsLoading(false);
    };

    loadExams();
  }, [user]);

  useEffect(() => {
    // Filter exams based on search term and filters
    let filtered = exams;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(exam => exam.status === statusFilter);
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(exam => exam.subject === subjectFilter);
    }

    setFilteredExams(filtered);
    setCurrentPage(1);
  }, [exams, searchTerm, statusFilter, subjectFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: Calendar },
      ongoing: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getExamTypeBadge = (examType: string) => {
    const typeConfig = {
      quiz: { color: 'bg-purple-100 text-purple-800' },
      test: { color: 'bg-indigo-100 text-indigo-800' },
      midterm: { color: 'bg-orange-100 text-orange-800' },
      final: { color: 'bg-red-100 text-red-800' },
      practical: { color: 'bg-teal-100 text-teal-800' }
    };
    
    const config = typeConfig[examType as keyof typeof typeConfig] || typeConfig.quiz;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {examType.charAt(0).toUpperCase() + examType.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getSubjects = () => {
    const subjects = [...new Set(exams.map(exam => exam.subject))];
    return subjects.sort();
  };

  // Pagination
  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exams...</p>
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
                {user?.role === 'teacher' ? 'My Exams' : 'Exam Management'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'teacher' 
                  ? 'Manage your scheduled exams and track student performance'
                  : 'Manage all examinations in the system'
                }
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/exams/create"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Exam
              </Link>
              {user?.role === 'teacher' && (
                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Download className="w-5 h-5 mr-2" />
                  Export Schedule
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.filter(e => e.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.filter(e => e.status === 'scheduled').length}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {user?.role === 'teacher' ? 'Pending Grades' : 'Pending Results'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.filter(e => e.status === 'completed' && !e.resultsPublished).length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Subjects</option>
              {getSubjects().map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-gray-600">
              {filteredExams.length} of {exams.length} exams
            </div>
          </div>
        </div>

        {/* Exams Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Results
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {exam.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {exam.subject} • {getExamTypeBadge(exam.examType)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {exam.venue} • {formatDuration(exam.duration)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(exam.date)}</div>
                      <div className="text-sm text-gray-500">
                        {exam.targetGrades.join(', ')} • {exam.targetSections.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(exam.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {exam.status === 'completed' ? (
                        exam.resultsPublished ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/exams/${exam.id}`}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/exams/${exam.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit Exam"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {exam.status === 'completed' && !exam.resultsPublished && (
                          <Link
                            to={`/results/create?examId=${exam.id}`}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Grade Results"
                          >
                            <Award className="w-4 h-4" />
                          </Link>
                        )}
                        {exam.status === 'completed' && exam.resultsPublished && (
                          <Link
                            to={`/results?examId=${exam.id}`}
                            className="text-purple-600 hover:text-purple-900 p-1"
                            title="View Results"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Link>
                        )}
                        {user?.role === 'teacher' && exam.status === 'scheduled' && (
                          <button
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Send Reminder"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Exam"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstExam + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastExam, filteredExams.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredExams.length}</span> exams
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || subjectFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : user?.role === 'teacher'
                ? 'Create your first exam to get started.'
                : 'Create exams to get started.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && subjectFilter === 'all' && (
              <div className="mt-6">
                <Link
                  to="/exams/create"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Exam
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamList; 