import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  FileText, 
  Users, 
  BookOpen,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Exam, User, Result } from '@/types';

interface ResultEntry {
  studentId: string;
  studentName: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  status: 'passed' | 'failed';
  remarks: string;
}

const ResultCreate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('examId');
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [resultEntries, setResultEntries] = useState<ResultEntry[]>([]);
  const [uploadMode, setUploadMode] = useState<'individual' | 'bulk'>('individual');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Load exams and students data
    const loadData = async () => {
      // Mock exams data
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
          resultsPublished: false,
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
        },
        {
          id: '3',
          firstName: 'David',
          lastName: 'Brown',
          email: 'david.brown@examtrack360.com',
          role: 'student',
          phone: '+1234567894',
          isActive: true,
          createdAt: '2024-02-10T09:30:00Z',
          avatar: null,
          studentId: 'S003',
          teacherId: null,
          grade: '10',
          section: 'B',
          subjects: ['Mathematics', 'Physics', 'English'],
          preferences: {
            notifications: { email: true, sms: true },
            theme: 'dark'
          }
        }
      ];

      setExams(mockExams);
      setStudents(mockStudents);

      // If examId is provided, select that exam
      if (examId) {
        const exam = mockExams.find(e => e.id === examId);
        if (exam) {
          setSelectedExam(exam);
          // Pre-populate with students for this exam
          const targetStudents = mockStudents.filter(student => 
            exam.targetGrades.includes(student.grade!) && 
            exam.targetSections.includes(student.section!)
          );
          const initialEntries = targetStudents.map(student => ({
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            marksObtained: 0,
            totalMarks: exam.totalMarks,
            percentage: 0,
            grade: 'F',
            status: 'failed' as const,
            remarks: ''
          }));
          setResultEntries(initialEntries);
        }
      }
    };

    loadData();
  }, [examId]);

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 30) return 'D';
    return 'F';
  };

  const calculateStatus = (percentage: number, passingMarks: number): 'passed' | 'failed' => {
    return percentage >= (passingMarks / selectedExam!.totalMarks) * 100 ? 'passed' : 'failed';
  };

  const updateResultEntry = (index: number, field: keyof ResultEntry, value: any) => {
    const updatedEntries = [...resultEntries];
    const entry = { ...updatedEntries[index] };
    
    if (field === 'marksObtained') {
      entry.marksObtained = Math.min(value, selectedExam!.totalMarks);
      entry.percentage = (entry.marksObtained / entry.totalMarks) * 100;
      entry.grade = calculateGrade(entry.percentage);
      entry.status = calculateStatus(entry.percentage, selectedExam!.passingMarks);
    } else {
      (entry as any)[field] = value;
    }
    
    updatedEntries[index] = entry;
    setResultEntries(updatedEntries);
  };

  const addStudentEntry = () => {
    const newEntry: ResultEntry = {
      studentId: '',
      studentName: '',
      marksObtained: 0,
      totalMarks: selectedExam?.totalMarks || 100,
      percentage: 0,
      grade: 'F',
      status: 'failed',
      remarks: ''
    };
    setResultEntries([...resultEntries, newEntry]);
  };

  const removeStudentEntry = (index: number) => {
    setResultEntries(resultEntries.filter((_, i) => i !== index));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Here you would parse the CSV/Excel file
      toast.success('File uploaded successfully! Please review the data below.');
    }
  };

  const handleExamChange = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    setSelectedExam(exam || null);
    
    if (exam) {
      // Filter students for this exam
      const targetStudents = students.filter(student => 
        exam.targetGrades.includes(student.grade!) && 
        exam.targetSections.includes(student.section!)
      );
      
      const initialEntries = targetStudents.map(student => ({
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        marksObtained: 0,
        totalMarks: exam.totalMarks,
        percentage: 0,
        grade: 'F',
        status: 'failed' as const,
        remarks: ''
      }));
      
      setResultEntries(initialEntries);
    }
  };

  const handleSubmit = async () => {
    if (!selectedExam) {
      toast.error('Please select an exam');
      return;
    }

    if (resultEntries.length === 0) {
      toast.error('Please add at least one result entry');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Results to submit:', {
        examId: selectedExam.id,
        results: resultEntries
      });
      
      toast.success('Results uploaded successfully!');
      navigate('/results');
    } catch (error) {
      toast.error('Failed to upload results. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/results')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Results</h1>
              <p className="text-gray-600 mt-1">
                Add exam results for students
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Exam Selection */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
              Exam Selection
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Exam *
                </label>
                <select
                  value={selectedExam?.id || ''}
                  onChange={(e) => handleExamChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Choose an exam</option>
                  {exams.filter(exam => exam.status === 'completed' && !exam.resultsPublished).map(exam => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title} ({exam.subject}) - {new Date(exam.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              {selectedExam && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Exam Details</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Subject:</strong> {selectedExam.subject}</p>
                    <p><strong>Total Marks:</strong> {selectedExam.totalMarks}</p>
                    <p><strong>Passing Marks:</strong> {selectedExam.passingMarks}</p>
                    <p><strong>Target Grades:</strong> {selectedExam.targetGrades.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Mode Selection */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-primary-600" />
              Upload Method
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => setUploadMode('individual')}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  uploadMode === 'individual'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-3">
                  <Users className={`w-6 h-6 mr-3 ${
                    uploadMode === 'individual' ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <h3 className={`font-medium ${
                    uploadMode === 'individual' ? 'text-primary-600' : 'text-gray-900'
                  }`}>
                    Individual Entry
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Enter results one by one for each student
                </p>
              </div>

              <div
                onClick={() => setUploadMode('bulk')}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  uploadMode === 'bulk'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-3">
                  <FileText className={`w-6 h-6 mr-3 ${
                    uploadMode === 'bulk' ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <h3 className={`font-medium ${
                    uploadMode === 'bulk' ? 'text-primary-600' : 'text-gray-900'
                  }`}>
                    Bulk Upload
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Upload CSV/Excel file with all results
                </p>
              </div>
            </div>

            {uploadMode === 'bulk' && (
              <div className="mt-6">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">CSV or Excel files only</p>
                    </div>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>File uploaded:</strong> {selectedFile.name}
                    </p>
                  </div>
                )}
                <div className="mt-4">
                  <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Entry */}
          {selectedExam && uploadMode === 'individual' && (
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary-600" />
                  Results Entry
                </h2>
                <button
                  onClick={addStudentEntry}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marks Obtained
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remarks
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resultEntries.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {students.find(s => s.id === entry.studentId)?.studentId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max={selectedExam.totalMarks}
                            value={entry.marksObtained}
                            onChange={(e) => updateResultEntry(index, 'marksObtained', parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                          <span className="text-sm text-gray-500 ml-1">/ {selectedExam.totalMarks}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.percentage.toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getGradeBadge(entry.grade)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(entry.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={entry.remarks}
                            onChange={(e) => updateResultEntry(index, 'remarks', e.target.value)}
                            placeholder="Optional remarks"
                            className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeStudentEntry(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedExam && resultEntries.length > 0 && (
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{resultEntries.length}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {resultEntries.filter(r => r.status === 'passed').length}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {resultEntries.filter(r => r.status === 'failed').length}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {resultEntries.length > 0 
                      ? `${((resultEntries.filter(r => r.status === 'passed').length / resultEntries.length) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </div>
                  <div className="text-sm text-gray-600">Pass Rate</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate('/results')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !selectedExam || resultEntries.length === 0}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Upload Results
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCreate; 