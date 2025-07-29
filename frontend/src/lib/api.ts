import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    me: '/api/auth/me',
    updateProfile: '/api/auth/me',
    changePassword: '/api/auth/change-password',
    logout: '/api/auth/logout',
  },
  
  // Users
  users: {
    list: '/api/users',
    create: '/api/users',
    update: (id: string) => `/api/users/${id}`,
    delete: (id: string) => `/api/users/${id}`,
    get: (id: string) => `/api/users/${id}`,
    byRole: (role: string) => `/api/users/role/${role}`,
    studentsByGrade: (grade: string) => `/api/users/students/grade/${grade}`,
  },
  
  // Exams
  exams: {
    list: '/api/exams',
    create: '/api/exams',
    update: (id: string) => `/api/exams/${id}`,
    delete: (id: string) => `/api/exams/${id}`,
    get: (id: string) => `/api/exams/${id}`,
    upcoming: '/api/exams/upcoming',
    completed: '/api/exams/completed',
    publishResults: (id: string) => `/api/exams/${id}/publish-results`,
  },
  
  // Results
  results: {
    list: '/api/results',
    create: '/api/results',
    update: (id: string) => `/api/results/${id}`,
    delete: (id: string) => `/api/results/${id}`,
    get: (id: string) => `/api/results/${id}`,
    byExam: (examId: string) => `/api/results/exam/${examId}`,
    byStudent: (studentId: string) => `/api/results/student/${studentId}`,
    bulk: '/api/results/bulk',
  },
  
  // Performance
  performance: {
    student: (studentId: string) => `/api/performance/student/${studentId}`,
    exam: (examId: string) => `/api/performance/exam/${examId}`,
    teacher: (teacherId: string) => `/api/performance/teacher/${teacherId}`,
    dashboard: '/api/performance/dashboard',
  },
  
  // Notifications
  notifications: {
    send: '/api/notifications/send',
    examReminder: '/api/notifications/exam-reminder',
    resultNotification: '/api/notifications/result-notification',
  },
};

// API service functions
export const apiService = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await api.post(endpoints.auth.login, { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post(endpoints.auth.register, userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get(endpoints.auth.me);
    return response.data;
  },
  
  updateProfile: async (userData: any) => {
    const response = await api.put(endpoints.auth.updateProfile, userData);
    return response.data;
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put(endpoints.auth.changePassword, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
  
  // Users
  getUsers: async (filters?: any) => {
    const response = await api.get(endpoints.users.list, { params: filters });
    return response.data;
  },
  
  createUser: async (userData: any) => {
    const response = await api.post(endpoints.users.create, userData);
    return response.data;
  },
  
  updateUser: async (id: string, userData: any) => {
    const response = await api.put(endpoints.users.update(id), userData);
    return response.data;
  },
  
  deleteUser: async (id: string) => {
    const response = await api.delete(endpoints.users.delete(id));
    return response.data;
  },
  
  getUser: async (id: string) => {
    const response = await api.get(endpoints.users.get(id));
    return response.data;
  },
  
  getUsersByRole: async (role: string, filters?: any) => {
    const response = await api.get(endpoints.users.byRole(role), { params: filters });
    return response.data;
  },
  
  getStudentsByGrade: async (grade: string, section?: string) => {
    const response = await api.get(endpoints.users.studentsByGrade(grade), {
      params: { section },
    });
    return response.data;
  },
  
  // Exams
  getExams: async (filters?: any) => {
    const response = await api.get(endpoints.exams.list, { params: filters });
    return response.data;
  },
  
  createExam: async (examData: any) => {
    const response = await api.post(endpoints.exams.create, examData);
    return response.data;
  },
  
  updateExam: async (id: string, examData: any) => {
    const response = await api.put(endpoints.exams.update(id), examData);
    return response.data;
  },
  
  deleteExam: async (id: string) => {
    const response = await api.delete(endpoints.exams.delete(id));
    return response.data;
  },
  
  getExam: async (id: string) => {
    const response = await api.get(endpoints.exams.get(id));
    return response.data;
  },
  
  getUpcomingExams: async (limit?: number) => {
    const response = await api.get(endpoints.exams.upcoming, { params: { limit } });
    return response.data;
  },
  
  getCompletedExams: async (filters?: any) => {
    const response = await api.get(endpoints.exams.completed, { params: filters });
    return response.data;
  },
  
  publishExamResults: async (id: string) => {
    const response = await api.put(endpoints.exams.publishResults(id));
    return response.data;
  },
  
  // Results
  getResults: async (filters?: any) => {
    const response = await api.get(endpoints.results.list, { params: filters });
    return response.data;
  },
  
  createResult: async (resultData: any) => {
    const response = await api.post(endpoints.results.create, resultData);
    return response.data;
  },
  
  updateResult: async (id: string, resultData: any) => {
    const response = await api.put(endpoints.results.update(id), resultData);
    return response.data;
  },
  
  deleteResult: async (id: string) => {
    const response = await api.delete(endpoints.results.delete(id));
    return response.data;
  },
  
  getResult: async (id: string) => {
    const response = await api.get(endpoints.results.get(id));
    return response.data;
  },
  
  getResultsByExam: async (examId: string, filters?: any) => {
    const response = await api.get(endpoints.results.byExam(examId), { params: filters });
    return response.data;
  },
  
  getResultsByStudent: async (studentId: string, filters?: any) => {
    const response = await api.get(endpoints.results.byStudent(studentId), { params: filters });
    return response.data;
  },
  
  bulkUploadResults: async (bulkData: any) => {
    const response = await api.post(endpoints.results.bulk, bulkData);
    return response.data;
  },
  
  // Performance
  getStudentPerformance: async (studentId: string, period?: string) => {
    const response = await api.get(endpoints.performance.student(studentId), {
      params: { period },
    });
    return response.data;
  },
  
  getExamPerformance: async (examId: string) => {
    const response = await api.get(endpoints.performance.exam(examId));
    return response.data;
  },
  
  getTeacherPerformance: async (teacherId: string, period?: string) => {
    const response = await api.get(endpoints.performance.teacher(teacherId), {
      params: { period },
    });
    return response.data;
  },
  
  getDashboardStats: async () => {
    const response = await api.get(endpoints.performance.dashboard);
    return response.data;
  },
  
  // Notifications
  sendNotification: async (notificationData: any) => {
    const response = await api.post(endpoints.notifications.send, notificationData);
    return response.data;
  },
  
  sendExamReminder: async (examId: string, type: string) => {
    const response = await api.post(endpoints.notifications.examReminder, {
      examId,
      type,
    });
    return response.data;
  },
  
  sendResultNotification: async (resultId: string, type: string) => {
    const response = await api.post(endpoints.notifications.resultNotification, {
      resultId,
      type,
    });
    return response.data;
  },
}; 