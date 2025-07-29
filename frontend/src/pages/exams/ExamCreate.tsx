import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Save, 
  BookOpen, 
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Upload,
  Plus,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const examSchema = z.object({
  title: z.string().min(5, 'Exam title must be at least 5 characters'),
  subject: z.string().min(1, 'Please select a subject'),
  examType: z.enum(['quiz', 'test', 'midterm', 'final', 'practical'], {
    required_error: 'Please select an exam type'
  }),
  date: z.string().min(1, 'Please select exam date and time'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours'),
  totalMarks: z.number().min(1, 'Total marks must be at least 1').max(200, 'Total marks cannot exceed 200'),
  passingMarks: z.number().min(1, 'Passing marks must be at least 1'),
  venue: z.string().min(1, 'Please enter exam venue'),
  instructions: z.string().min(10, 'Instructions must be at least 10 characters'),
  targetGrades: z.array(z.string()).min(1, 'Please select at least one grade'),
  targetSections: z.array(z.string()).min(1, 'Please select at least one section'),
  teacher: z.string().min(1, 'Please select a teacher'),
  attachments: z.array(z.string()).optional()
}).refine((data) => data.passingMarks <= data.totalMarks, {
  message: "Passing marks cannot exceed total marks",
  path: ["passingMarks"],
});

type ExamFormData = z.infer<typeof examSchema>;

const ExamCreate: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState<Array<{id: string, name: string, subjects: string[]}>>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      targetGrades: [],
      targetSections: [],
      attachments: []
    }
  });

  const watchedTotalMarks = watch('totalMarks');
  const watchedTargetGrades = watch('targetGrades');

  const examTypes = [
    { value: 'quiz', label: 'Quiz', desc: 'Short assessment (15-30 min)' },
    { value: 'test', label: 'Test', desc: 'Regular test (45-90 min)' },
    { value: 'midterm', label: 'Mid-Term', desc: 'Mid-semester exam (2-3 hours)' },
    { value: 'final', label: 'Final', desc: 'End-semester exam (3-4 hours)' },
    { value: 'practical', label: 'Practical', desc: 'Lab or hands-on exam' }
  ];

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
    'History', 'Geography', 'Computer Science', 'Art', 'Music',
    'Physical Education', 'Economics', 'Psychology', 'Literature'
  ];

  const grades = ['9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D', 'E'];

  useEffect(() => {
    // Load teachers data
    const loadTeachers = async () => {
      // Mock teachers data
      const mockTeachers = [
        { id: '1', name: 'Dr. Sarah Johnson', subjects: ['Mathematics', 'Physics'] },
        { id: '2', name: 'Prof. Robert Smith', subjects: ['Chemistry', 'Biology'] },
        { id: '3', name: 'Ms. Jennifer Brown', subjects: ['English', 'Literature'] },
        { id: '4', name: 'Dr. Michael Chen', subjects: ['Computer Science', 'Mathematics'] },
        { id: '5', name: 'Dr. Emily Wilson', subjects: ['Biology', 'Chemistry'] }
      ];
      setTeachers(mockTeachers);
    };

    loadTeachers();
  }, []);

  const onSubmit = async (data: ExamFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Exam data to submit:', data);
      
      toast.success('Exam created successfully!');
      navigate('/exams');
    } catch (error) {
      toast.error('Failed to create exam. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Update form value
    const fileNames = files.map(file => file.name);
    const currentAttachments = watch('attachments') || [];
    setValue('attachments', [...currentAttachments, ...fileNames]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Update form value
    const currentAttachments = watch('attachments') || [];
    const updatedAttachments = currentAttachments.filter((_, i) => i !== index);
    setValue('attachments', updatedAttachments);
  };

  const handleGradeChange = (grade: string) => {
    const currentGrades = watch('targetGrades') || [];
    const updatedGrades = currentGrades.includes(grade)
      ? currentGrades.filter(g => g !== grade)
      : [...currentGrades, grade];
    setValue('targetGrades', updatedGrades);
  };

  const handleSectionChange = (section: string) => {
    const currentSections = watch('targetSections') || [];
    const updatedSections = currentSections.includes(section)
      ? currentSections.filter(s => s !== section)
      : [...currentSections, section];
    setValue('targetSections', updatedSections);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/exams')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Exam</h1>
              <p className="text-gray-600 mt-1">
                Schedule a new examination
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mid-Term Mathematics Exam"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  {...register('subject')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type *
                </label>
                <select
                  {...register('examType')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.examType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Exam Type</option>
                  {examTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.desc}
                    </option>
                  ))}
                </select>
                {errors.examType && (
                  <p className="mt-1 text-sm text-red-600">{errors.examType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Teacher *
                </label>
                <select
                  {...register('teacher')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.teacher ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                  ))}
                </select>
                {errors.teacher && (
                  <p className="mt-1 text-sm text-red-600">{errors.teacher.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Schedule & Venue */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-600" />
              Schedule & Venue
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time *
                </label>
                <input
                  {...register('date')}
                  type="datetime-local"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  {...register('duration', { valueAsNumber: true })}
                  type="number"
                  min="15"
                  max="480"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.duration ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 120"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('venue')}
                    type="text"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.venue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Room 101"
                  />
                </div>
                {errors.venue && (
                  <p className="mt-1 text-sm text-red-600">{errors.venue.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Marks & Instructions */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              Marks & Instructions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Marks *
                </label>
                <input
                  {...register('totalMarks', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="200"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.totalMarks ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 100"
                />
                {errors.totalMarks && (
                  <p className="mt-1 text-sm text-red-600">{errors.totalMarks.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Marks *
                </label>
                <input
                  {...register('passingMarks', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max={watchedTotalMarks || 200}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.passingMarks ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 40"
                />
                {errors.passingMarks && (
                  <p className="mt-1 text-sm text-red-600">{errors.passingMarks.message}</p>
                )}
              </div>

              <div className="flex items-end">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Percentage
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600">
                    {watchedTotalMarks && watch('passingMarks') 
                      ? `${Math.round((watch('passingMarks') / watchedTotalMarks) * 100)}%`
                      : 'N/A'
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions *
              </label>
              <textarea
                {...register('instructions')}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.instructions ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter exam instructions for students..."
              />
              {errors.instructions && (
                <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>
              )}
            </div>
          </div>

          {/* Target Students */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              Target Students
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Target Grades *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {grades.map(grade => (
                    <label key={grade} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={watch('targetGrades')?.includes(grade) || false}
                        onChange={() => handleGradeChange(grade)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Grade {grade}</span>
                    </label>
                  ))}
                </div>
                {errors.targetGrades && (
                  <p className="mt-1 text-sm text-red-600">{errors.targetGrades.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Target Sections *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {sections.map(section => (
                    <label key={section} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={watch('targetSections')?.includes(section) || false}
                        onChange={() => handleSectionChange(section)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Section {section}</span>
                    </label>
                  ))}
                </div>
                {errors.targetSections && (
                  <p className="mt-1 text-sm text-red-600">{errors.targetSections.message}</p>
                )}
              </div>
            </div>

            {watchedTargetGrades.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Estimated Students:</strong> {watchedTargetGrades.length * sections.length * 25} students
                  <br />
                  <span className="text-blue-600">
                    Based on {watchedTargetGrades.join(', ')} grades and selected sections
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-primary-600" />
              Attachments (Optional)
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Files
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, or images (MAX. 10MB each)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Files
                  </label>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/exams')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Exam
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamCreate; 