import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Download,
  Upload,
  BarChart3,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  BookOpen
} from 'lucide-react';
import { Result, Exam, User } from '@/types';

const ResultList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('examId');
  
  const [results, setResults] = useState<Result[]>([]);
  const [filteredResults, setFilteredResults] = useState<Result[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [examFilter, setExamFilter] = useState(examId || 'all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(15);

  useEffect(() => {
    // Simulate loading results data
    const loadResults = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
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

      const mockStudents: User[] = [
        {
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
        },
        {
          id: '2',
          firstName: 'Emily',
          lastName: 'Wilson',
          email: 'emily.wilson@examtrack360.com',
          role: 'student',
          phone: '+1234567893',
          isActive: true,
          createdAt: '2024-02-05T11:45:00Z',
          avatar: null,
          studentId: 'S002',
          teacherId: null,
          grade: '11',
          section: 'A',
          subjects: ['Biology', 'Chemistry', 'Mathematics'],
          preferences: {
            notifications: { email: false, sms: true },
            theme: 'light'
          }
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
          student: '2',
          exam: '1',
          marksObtained: 72,
          totalMarks: 100,
          percentage: 72,
          grade: 'B',
          status: 'passed',
          remarks: 'Good work, room for improvement',
          submittedAt: '2024-03-15T11:30:00Z',
          gradedAt: '2024-03-15T16:30:00Z',
          gradedBy: 'Dr. Sarah Johnson',
          metadata: {},
          attachments: []
        },
        {
          id: '3',
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
        },
        {
          id: '4',
          student: '2',
          exam: '2',
          marksObtained: 38,
          totalMarks: 50,
          percentage: 76,
          grade: 'B+',
          status: 'passed',
          remarks: 'Well done',
          submittedAt: '2024-03-10T14:30:00Z',
          gradedAt: '2024-03-10T15:15:00Z',
          gradedBy: 'Prof. Robert Smith',
          metadata: {},
          attachments: []
        }
      ];
      
      setExams(mockExams);
      setStudents(mockStudents);
      setResults(mockResults);
      setFilteredResults(mockResults);
      setIsLoading(false);
    };

    loadResults();
  }, []);

  useEffect(() => {
    // Filter results based on search term and filters
    let filtered = results;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(result => {
        const student = students.find(s => s.id === result.student);
        const exam = exams.find(e => e.id === result.exam);
        return (
          student?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam?.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Exam filter
    if (examFilter !== 'all') {
      filtered = filtered.filter(result => result.exam === examFilter);
    }

    // Grade filter
    if (gradeFilter !== 'all') {
      filtered = filtered.filter(result => {
        const student = students.find(s => s.id === result.student);
        return student?.grade === gradeFilter;
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(result => result.status === statusFilter);
    }

    setFilteredResults(filtered);
    setCurrentPage(1);
  }, [results, students, exams, searchTerm, examFilter, gradeFilter, statusFilter]);

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  const getStudentInfo = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.studentId} • Grade ${student.grade}${student.section}` : '';
  };

  const getExamInfo = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? `${exam.title} (${exam.subject})` : 'Unknown Exam';
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
        <Award className="w-3 h-3 mr-1" />
        {grade}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'passed' ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Passed
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Failed
      </span>
    );
  };

  const getPerformanceTrend = (percentage: number) => {
    if (percentage >= 90) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (percentage >= 70) {
      return <TrendingUp className="w-4 h-4 text-blue-600" />;
    } else if (percentage >= 50) {
      return <TrendingUp className="w-4 h-4 text-yellow-600" />;
    } else {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
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

  const getGrades = () => {
    const grades = [...new Set(students.map(student => student.grade))];
    return grades.sort();
  };

  // Pagination
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Result Management</h1>
              <p className="text-gray-600 mt-1">
                Manage all exam results and performance data
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/results/create"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Results
              </Link>
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
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
                <p className="text-sm font-medium text-gray-600">Total Results</p>
                <p className="text-2xl font-bold text-gray-900">{results.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results.length > 0 
                    ? `${Math.round((results.filter(r => r.status === 'passed').length / results.length) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results.length > 0 
                    ? `${Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)}%`
                    : '0%'
                  }
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.filter(e => e.status === 'completed' && e.resultsPublished).length}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Exam Filter */}
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Exams</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.title}</option>
              ))}
            </select>

            {/* Grade Filter */}
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Grades</option>
              {getGrades().map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-gray-600">
              {filteredResults.length} of {results.length} results
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
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
                    Graded
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getStudentName(result.student)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getStudentInfo(result.student)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getExamInfo(result.exam)}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(result.submittedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {result.marksObtained}/{result.totalMarks}
                        </div>
                        <div className="ml-2">
                          {getPerformanceTrend(result.percentage)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.percentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getGradeBadge(result.grade)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(result.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{formatDate(result.gradedAt)}</div>
                      <div className="text-xs text-gray-400">by {result.gradedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/results/${result.id}`}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/results/${result.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit Result"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Result"
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
                    Showing <span className="font-medium">{indexOfFirstResult + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastResult, filteredResults.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredResults.length}</span> results
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
      </div>
    </div>
  );
};

export default ResultList; 