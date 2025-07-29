import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Bell,
  Plus,
  Eye,
  Settings,
  BarChart3,
  UserPlus,
  BookOpenCheck,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  GraduationCap,
  Target,
  Star,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  totalExams: number;
  totalResults: number;
  averageScore: number;
  upcomingExams: number;
  pendingResults: number;
}

interface RecentActivity {
  id: string;
  type: 'exam_created' | 'result_uploaded' | 'user_registered' | 'exam_completed' | 'student_message' | 'grade_updated';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalExams: 0,
    totalResults: 0,
    averageScore: 0,
    upcomingExams: 0,
    pendingResults: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock notifications data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Pending Results',
          message: '5 exam results need to be reviewed and published',
          timestamp: '2 hours ago',
          read: false,
          action: 'View Results'
        },
        {
          id: '2',
          type: 'info',
          title: 'New User Registration',
          message: 'Sarah Wilson has registered as a new student',
          timestamp: '4 hours ago',
          read: false,
          action: 'Review User'
        },
        {
          id: '3',
          type: 'success',
          title: 'Exam Completed',
          message: 'Physics Quiz has been completed by all students',
          timestamp: '6 hours ago',
          read: true,
          action: 'View Results'
        },
        {
          id: '4',
          type: 'error',
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur tonight at 2:00 AM',
          timestamp: '1 day ago',
          read: true
        }
      ];
      
      // Mock data based on user role
      if (user?.role === 'admin') {
        setStats({
          totalUsers: 156,
          totalExams: 24,
          totalResults: 342,
          averageScore: 78.5,
          upcomingExams: 5,
          pendingResults: 12
        });
        
        setRecentActivities([
          {
            id: '1',
            type: 'exam_created',
            title: 'Mid-Term Mathematics Exam',
            description: 'New exam scheduled for Grade 10',
            timestamp: '2 hours ago',
            user: 'Dr. Johnson'
          },
          {
            id: '2',
            type: 'result_uploaded',
            title: 'Physics Quiz Results',
            description: 'Results uploaded for 45 students',
            timestamp: '4 hours ago',
            user: 'Prof. Smith'
          },
          {
            id: '3',
            type: 'user_registered',
            title: 'New Student Registration',
            description: 'Sarah Wilson joined Grade 9',
            timestamp: '6 hours ago'
          },
          {
            id: '4',
            type: 'exam_completed',
            title: 'Chemistry Final Exam',
            description: 'Exam completed by 78 students',
            timestamp: '1 day ago'
          }
        ]);
      } else if (user?.role === 'teacher') {
        setStats({
          totalUsers: 45,
          totalExams: 8,
          totalResults: 156,
          averageScore: 82.3,
          upcomingExams: 2,
          pendingResults: 5
        });
        
        setRecentActivities([
          {
            id: '1',
            type: 'exam_created',
            title: 'Algebra Quiz',
            description: 'Created new quiz for Grade 10',
            timestamp: '1 hour ago'
          },
          {
            id: '2',
            type: 'result_uploaded',
            title: 'Geometry Test Results',
            description: 'Graded and uploaded 32 results',
            timestamp: '3 hours ago'
          },
          {
            id: '3',
            type: 'student_message',
            title: 'Student Question',
            description: 'Michael Chen asked about tomorrow\'s exam',
            timestamp: '5 hours ago'
          },
          {
            id: '4',
            type: 'grade_updated',
            title: 'Grade Updated',
            description: 'Updated Emily Wilson\'s Mathematics grade',
            timestamp: '1 day ago'
          }
        ]);

        // Teacher-specific notifications
        mockNotifications.push(
          {
            id: '5',
            type: 'info',
            title: 'Student Question',
            message: 'Michael Chen has a question about tomorrow\'s exam',
            timestamp: '30 minutes ago',
            read: false,
            action: 'Reply'
          },
          {
            id: '6',
            type: 'warning',
            title: 'Low Performance Alert',
            message: '3 students in Grade 10A are performing below average',
            timestamp: '2 hours ago',
            read: false,
            action: 'View Details'
          }
        );
      } else {
        // Student dashboard
        setStats({
          totalUsers: 1,
          totalExams: 12,
          totalResults: 8,
          averageScore: 85.2,
          upcomingExams: 3,
          pendingResults: 0
        });
        
        setRecentActivities([
          {
            id: '1',
            type: 'exam_completed',
            title: 'Mathematics Quiz',
            description: 'Completed with 92% score',
            timestamp: '2 days ago'
          },
          {
            id: '2',
            type: 'exam_created',
            title: 'Physics Test Scheduled',
            description: 'Upcoming test on Friday',
            timestamp: '3 days ago'
          }
        ]);
      }
      
      setNotifications(mockNotifications);
      setIsLoading(false);
    };

    loadDashboardData();
  }, [user]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam_created': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'result_uploaded': return <FileText className="w-5 h-5 text-green-500" />;
      case 'user_registered': return <UserPlus className="w-5 h-5 text-purple-500" />;
      case 'exam_completed': return <BookOpenCheck className="w-5 h-5 text-orange-500" />;
      case 'student_message': return <MessageSquare className="w-5 h-5 text-indigo-500" />;
      case 'grade_updated': return <Award className="w-5 h-5 text-teal-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'exam_created': return 'bg-blue-50 border-blue-200';
      case 'result_uploaded': return 'bg-green-50 border-green-200';
      case 'user_registered': return 'bg-purple-50 border-purple-200';
      case 'exam_completed': return 'bg-orange-50 border-orange-200';
      case 'student_message': return 'bg-indigo-50 border-indigo-200';
      case 'grade_updated': return 'bg-teal-50 border-teal-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; change?: string }> = ({ 
    title, value, icon, color, change 
  }) => (
    <div className={`bg-white rounded-xl shadow-soft p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickAction: React.FC<{ title: string; description: string; icon: React.ReactNode; href: string; color: string }> = ({ 
    title, description, icon, href, color 
  }) => (
    <Link to={href} className={`block p-6 bg-white rounded-xl shadow-soft hover:shadow-md transition-all duration-200 border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className="p-3 bg-gray-50 rounded-lg mr-4">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening in your {user?.role} dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-600">{unreadCount} unread</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-500">
                                    {notification.timestamp}
                                  </span>
                                  {notification.action && (
                                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                                      {notification.action}
                                    </button>
                                  )}
                                </div>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/settings" className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {user?.role === 'teacher' ? (
            <>
              <StatCard
                title="My Students"
                value={stats.totalUsers}
                icon={<Users className="w-6 h-6 text-blue-600" />}
                color="border-blue-500"
                change="+3 this week"
              />
              <StatCard
                title="My Exams"
                value={stats.totalExams}
                icon={<BookOpen className="w-6 h-6 text-green-600" />}
                color="border-green-500"
                change="+1 this week"
              />
              <StatCard
                title="Graded Results"
                value={stats.totalResults}
                icon={<FileText className="w-6 h-6 text-purple-600" />}
                color="border-purple-500"
                change="+12 today"
              />
              <StatCard
                title="Class Average"
                value={`${stats.averageScore}%`}
                icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
                color="border-orange-500"
                change="+2.3% vs last month"
              />
              <StatCard
                title="Upcoming Exams"
                value={stats.upcomingExams}
                icon={<Calendar className="w-6 h-6 text-red-600" />}
                color="border-red-500"
              />
              <StatCard
                title="Pending Grades"
                value={stats.pendingResults}
                icon={<Clock className="w-6 h-6 text-yellow-600" />}
                color="border-yellow-500"
              />
            </>
          ) : user?.role === 'admin' ? (
            <>
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<Users className="w-6 h-6 text-blue-600" />}
                color="border-blue-500"
                change="+12% this month"
              />
              <StatCard
                title="Total Exams"
                value={stats.totalExams}
                icon={<BookOpen className="w-6 h-6 text-green-600" />}
                color="border-green-500"
                change="+3 this week"
              />
              <StatCard
                title="Total Results"
                value={stats.totalResults}
                icon={<FileText className="w-6 h-6 text-purple-600" />}
                color="border-purple-500"
                change="+45 this week"
              />
              <StatCard
                title="Average Score"
                value={`${stats.averageScore}%`}
                icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
                color="border-orange-500"
                change="+2.3% vs last month"
              />
              <StatCard
                title="Upcoming Exams"
                value={stats.upcomingExams}
                icon={<Calendar className="w-6 h-6 text-red-600" />}
                color="border-red-500"
              />
              <StatCard
                title="Pending Results"
                value={stats.pendingResults}
                icon={<Clock className="w-6 h-6 text-yellow-600" />}
                color="border-yellow-500"
              />
            </>
          ) : (
            // Student dashboard
            <>
              <StatCard
                title="My Exams"
                value={stats.totalExams}
                icon={<BookOpen className="w-6 h-6 text-blue-600" />}
                color="border-blue-500"
              />
              <StatCard
                title="Completed"
                value={stats.totalResults}
                icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                color="border-green-500"
              />
              <StatCard
                title="Average Score"
                value={`${stats.averageScore}%`}
                icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
                color="border-purple-500"
                change="+5.2% improvement"
              />
              <StatCard
                title="Upcoming"
                value={stats.upcomingExams}
                icon={<Calendar className="w-6 h-6 text-orange-600" />}
                color="border-orange-500"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {user?.role === 'admin' && (
                  <>
                    <QuickAction
                      title="Add New User"
                      description="Register a new student or teacher"
                      icon={<UserPlus className="w-6 h-6 text-blue-600" />}
                      href="/users/create"
                      color="border-blue-500"
                    />
                    <QuickAction
                      title="Create Exam"
                      description="Schedule a new examination"
                      icon={<Plus className="w-6 h-6 text-green-600" />}
                      href="/exams/create"
                      color="border-green-500"
                    />
                    <QuickAction
                      title="Upload Results"
                      description="Add exam results in bulk"
                      icon={<FileText className="w-6 h-6 text-purple-600" />}
                      href="/results/create"
                      color="border-purple-500"
                    />
                    <QuickAction
                      title="View Analytics"
                      description="Check performance reports"
                      icon={<BarChart3 className="w-6 h-6 text-orange-600" />}
                      href="/performance"
                      color="border-orange-500"
                    />
                  </>
                )}
                {user?.role === 'teacher' && (
                  <>
                    <QuickAction
                      title="Create Exam"
                      description="Schedule a new examination"
                      icon={<Plus className="w-6 h-6 text-green-600" />}
                      href="/exams/create"
                      color="border-green-500"
                    />
                    <QuickAction
                      title="Grade Results"
                      description="Upload and grade exam results"
                      icon={<Award className="w-6 h-6 text-purple-600" />}
                      href="/results/create"
                      color="border-purple-500"
                    />
                    <QuickAction
                      title="My Classes"
                      description="View your assigned students"
                      icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
                      href="/users"
                      color="border-blue-500"
                    />
                    <QuickAction
                      title="Student Messages"
                      description="Check student questions"
                      icon={<MessageSquare className="w-6 h-6 text-indigo-600" />}
                      href="/messages"
                      color="border-indigo-500"
                    />
                    <QuickAction
                      title="Performance Analytics"
                      description="View class performance"
                      icon={<BarChart3 className="w-6 h-6 text-orange-600" />}
                      href="/performance"
                      color="border-orange-500"
                    />
                  </>
                )}
                {user?.role === 'student' && (
                  <>
                    <QuickAction
                      title="View My Results"
                      description="Check your exam scores"
                      icon={<FileText className="w-6 h-6 text-green-600" />}
                      href="/results"
                      color="border-green-500"
                    />
                    <QuickAction
                      title="Upcoming Exams"
                      description="See your exam schedule"
                      icon={<Calendar className="w-6 h-6 text-blue-600" />}
                      href="/exams"
                      color="border-blue-500"
                    />
                    <QuickAction
                      title="Performance Report"
                      description="View your progress analytics"
                      icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
                      href="/performance"
                      color="border-purple-500"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
                <Link to="/activities" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={`flex items-start p-4 rounded-lg border ${getActivityColor(activity.type)}`}>
                    <div className="flex-shrink-0 mr-4">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        {activity.user && (
                          <>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs text-gray-500">by {activity.user}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific Alerts */}
        {user?.role === 'teacher' && (
          <div className="mt-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-yellow-800">Teaching Reminders</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>• 5 exam results need grading and review</p>
                    <p>• 2 students have questions about upcoming exams</p>
                    <p>• Class average improved by 3.2% this month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'admin' && (
          <div className="mt-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-yellow-800">System Notifications</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>• 5 pending exam results need review</p>
                    <p>• 3 new user registrations awaiting approval</p>
                    <p>• System backup scheduled for tonight at 2:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 