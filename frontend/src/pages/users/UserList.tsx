import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  GraduationCap,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  MessageSquare,
  Award,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

const UserList: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    // Simulate loading users data
    const loadUsers = async () => {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock users data
      const allUsers: User[] = [
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
        },
        {
          id: '4',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@examtrack360.com',
          role: 'teacher',
          phone: '+1234567895',
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z',
          avatar: null,
          studentId: null,
          teacherId: 'T001',
          grade: null,
          section: null,
          subjects: ['Mathematics', 'Physics'],
          preferences: {
            notifications: { email: true, sms: false },
            theme: 'light'
          }
        },
        {
          id: '5',
          firstName: 'Robert',
          lastName: 'Smith',
          email: 'robert.smith@examtrack360.com',
          role: 'teacher',
          phone: '+1234567896',
          isActive: true,
          createdAt: '2024-01-20T14:30:00Z',
          avatar: null,
          studentId: null,
          teacherId: 'T002',
          grade: null,
          section: null,
          subjects: ['Chemistry', 'Biology'],
          preferences: {
            notifications: { email: true, sms: true },
            theme: 'light'
          }
        }
      ];

      // Filter users based on user role
      let filteredUsers = allUsers;
      if (user?.role === 'teacher') {
        // Show only students assigned to this teacher's subjects
        filteredUsers = allUsers.filter(userItem => 
          userItem.role === 'student' && 
          userItem.subjects?.some(subject => 
            user.subjects?.includes(subject)
          )
        );
      } else if (user?.role === 'student') {
        // Students can only see teachers
        filteredUsers = allUsers.filter(userItem => userItem.role === 'teacher');
      }

      setUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, [user]);

  useEffect(() => {
    // Filter users based on search term and filters
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.teacherId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Grade filter (for students)
    if (gradeFilter !== 'all') {
      filtered = filtered.filter(user => user.grade === gradeFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchTerm, roleFilter, gradeFilter]);

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

  const getPerformanceTrend = (userId: string) => {
    // Mock performance data - in real app this would come from API
    const performance = Math.random() > 0.5 ? 'up' : 'down';
    return performance === 'up' ? (
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

  const getGrades = () => {
    const grades = [...new Set(users.filter(u => u.grade).map(u => u.grade!))];
    return grades.sort();
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
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
                {user?.role === 'teacher' ? 'My Students' : 'User Management'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'teacher' 
                  ? 'Manage your assigned students and track their performance'
                  : 'Manage all users in the system'
                }
              </p>
            </div>
            {user?.role === 'admin' && (
              <Link
                to="/users/create"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add User
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {user?.role === 'teacher' ? 'Total Students' : 'Total Users'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {user?.role === 'teacher' && (
            <>
              <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Performance</p>
                    <p className="text-2xl font-bold text-gray-900">82.5%</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Need Attention</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Teachers</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.role === 'teacher').length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.role === 'student').length}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Roles</option>
              {user?.role === 'admin' && (
                <>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </>
              )}
              {user?.role === 'teacher' && (
                <option value="student">Student</option>
              )}
              {user?.role === 'student' && (
                <option value="teacher">Teacher</option>
              )}
            </select>

            {/* Grade Filter (for students) */}
            {user?.role === 'teacher' && (
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
            )}

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-gray-600">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  {user?.role === 'teacher' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {userItem.firstName.charAt(0)}{userItem.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userItem.firstName} {userItem.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {userItem.studentId || userItem.teacherId}
                          </div>
                          {userItem.grade && (
                            <div className="text-xs text-gray-400">
                              Grade {userItem.grade} - Section {userItem.section}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{userItem.email}</div>
                      <div className="text-sm text-gray-500">{userItem.phone}</div>
                    </td>
                    {user?.role === 'teacher' && userItem.role === 'student' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">85.2%</div>
                          <div className="ml-2">
                            {getPerformanceTrend(userItem.id)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">Last exam: 92%</div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getRoleBadge(userItem.role)}
                        {getStatusBadge(userItem.isActive)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(userItem.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/users/${userItem.id}`}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to={`/users/${userItem.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}
                        {user?.role === 'teacher' && userItem.role === 'student' && (
                          <>
                            <Link
                              to={`/performance/student/${userItem.id}`}
                              className="text-purple-600 hover:text-purple-900 p-1"
                              title="View Performance"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Link>
                            <button
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="Send Message"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {user?.role === 'admin' && (
                          <button
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastUser, filteredUsers.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredUsers.length}</span> users
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
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchTerm || roleFilter !== 'all' || gradeFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : user?.role === 'teacher'
                ? 'No students are currently assigned to your subjects.'
                : 'No users found in the system.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList; 