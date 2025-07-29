import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Save, 
  UserPlus, 
  Mail, 
  Phone, 
  Shield, 
  BookOpen,
  Users,
  GraduationCap,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['admin', 'teacher', 'student'], {
    required_error: 'Please select a role'
  }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  studentId: z.string().optional(),
  teacherId: z.string().optional(),
  grade: z.string().optional(),
  section: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  notifications: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false)
  }),
  theme: z.enum(['light', 'dark']).default('light')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'student') {
    return data.studentId && data.grade && data.section;
  }
  if (data.role === 'teacher') {
    return data.teacherId && data.subjects && data.subjects.length > 0;
  }
  return true;
}, {
  message: "Please fill in all required fields for the selected role",
});

type UserFormData = z.infer<typeof userSchema>;

const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher' | 'student'>('student');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      isActive: true,
      notifications: { email: true, sms: false },
      theme: 'light'
    }
  });

  const watchedRole = watch('role');

  const availableSubjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
    'History', 'Geography', 'Computer Science', 'Art', 'Music',
    'Physical Education', 'Economics', 'Psychology', 'Literature'
  ];

  const grades = ['9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D', 'E'];

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('User data to submit:', data);
      
      toast.success('User created successfully!');
      navigate('/users');
    } catch (error) {
      toast.error('Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role: 'admin' | 'teacher' | 'student') => {
    setSelectedRole(role);
    setValue('role', role);
    
    // Clear role-specific fields when changing roles
    setValue('studentId', '');
    setValue('teacherId', '');
    setValue('grade', '');
    setValue('section', '');
    setValue('subjects', []);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/users')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
              <p className="text-gray-600 mt-1">
                Add a new user to the system
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
              <UserPlus className="w-5 h-5 mr-2 text-primary-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  {...register('firstName')}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  {...register('lastName')}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('email')}
                    type="email"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('phone')}
                    type="tel"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary-600" />
              Role & Access
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                User Role *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { role: 'student', icon: GraduationCap, title: 'Student', desc: 'Can view exams and results' },
                  { role: 'teacher', icon: BookOpen, title: 'Teacher', desc: 'Can create exams and grade results' },
                  { role: 'admin', icon: Shield, title: 'Admin', desc: 'Full system access and management' }
                ].map(({ role, icon: Icon, title, desc }) => (
                  <div
                    key={role}
                    onClick={() => handleRoleChange(role as any)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === role
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <Icon className={`w-5 h-5 mr-2 ${
                        selectedRole === role ? 'text-primary-600' : 'text-gray-400'
                      }`} />
                      <span className={`font-medium ${
                        selectedRole === role ? 'text-primary-600' : 'text-gray-900'
                      }`}>
                        {title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
              {errors.role && (
                <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Role-specific fields */}
            {selectedRole === 'student' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID *
                  </label>
                  <input
                    {...register('studentId')}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.studentId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., S001"
                  />
                  {errors.studentId && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade *
                  </label>
                  <select
                    {...register('grade')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.grade ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>Grade {grade}</option>
                    ))}
                  </select>
                  {errors.grade && (
                    <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section *
                  </label>
                  <select
                    {...register('section')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.section ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section} value={section}>Section {section}</option>
                    ))}
                  </select>
                  {errors.section && (
                    <p className="mt-1 text-sm text-red-600">{errors.section.message}</p>
                  )}
                </div>
              </div>
            )}

            {selectedRole === 'teacher' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teacher ID *
                  </label>
                  <input
                    {...register('teacherId')}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.teacherId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., T001"
                  />
                  {errors.teacherId && (
                    <p className="mt-1 text-sm text-red-600">{errors.teacherId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableSubjects.map(subject => (
                      <label key={subject} className="flex items-center">
                        <input
                          type="checkbox"
                          value={subject}
                          {...register('subjects')}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{subject}</span>
                      </label>
                    ))}
                  </div>
                  {errors.subjects && (
                    <p className="mt-1 text-sm text-red-600">{errors.subjects.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary-600" />
              Security & Access
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active Account</span>
              </label>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              Preferences
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Notification Preferences
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      {...register('notifications.email')}
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('notifications.sms')}
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme Preference
                </label>
                <select
                  {...register('theme')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/users')}
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
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreate; 