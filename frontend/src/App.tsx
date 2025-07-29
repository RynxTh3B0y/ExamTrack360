import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Layout components
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Auth pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Dashboard pages
import Dashboard from '@/pages/dashboard/Dashboard';

// Exam pages
import ExamList from '@/pages/exams/ExamList';
import ExamCreate from '@/pages/exams/ExamCreate';
import ExamEdit from '@/pages/exams/ExamEdit';
import ExamDetail from '@/pages/exams/ExamDetail';

// Result pages
import ResultList from '@/pages/results/ResultList';
import ResultCreate from '@/pages/results/ResultCreate';
import ResultEdit from '@/pages/results/ResultEdit';
import ResultDetail from '@/pages/results/ResultDetail';

// User pages
import UserList from '@/pages/users/UserList';
import UserCreate from '@/pages/users/UserCreate';
import UserEdit from '@/pages/users/UserEdit';
import UserDetail from '@/pages/users/UserDetail';

// Performance pages
import Performance from '@/pages/performance/Performance';
import StudentPerformance from '@/pages/performance/StudentPerformance';
import ExamPerformance from '@/pages/performance/ExamPerformance';

// Settings pages
import Settings from '@/pages/settings/Settings';
import Profile from '@/pages/settings/Profile';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({
  children,
  roles,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Page transition component
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <PageTransition>
                <Login />
              </PageTransition>
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <PageTransition>
                <Register />
              </PageTransition>
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />

          {/* Exams */}
          <Route
            path="exams"
            element={
              <PageTransition>
                <ExamList />
              </PageTransition>
            }
          />
          <Route
            path="exams/create"
            element={
              <ProtectedRoute roles={['admin', 'teacher']}>
                <PageTransition>
                  <ExamCreate />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="exams/:id"
            element={
              <PageTransition>
                <ExamDetail />
              </PageTransition>
            }
          />
          <Route
            path="exams/:id/edit"
            element={
              <ProtectedRoute roles={['admin', 'teacher']}>
                <PageTransition>
                  <ExamEdit />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Results */}
          <Route
            path="results"
            element={
              <PageTransition>
                <ResultList />
              </PageTransition>
            }
          />
          <Route
            path="results/create"
            element={
              <ProtectedRoute roles={['admin', 'teacher']}>
                <PageTransition>
                  <ResultCreate />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="results/:id"
            element={
              <PageTransition>
                <ResultDetail />
              </PageTransition>
            }
          />
          <Route
            path="results/:id/edit"
            element={
              <ProtectedRoute roles={['admin', 'teacher']}>
                <PageTransition>
                  <ResultEdit />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Users (Admin only) */}
          <Route
            path="users"
            element={
              <ProtectedRoute roles={['admin']}>
                <PageTransition>
                  <UserList />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="users/create"
            element={
              <ProtectedRoute roles={['admin']}>
                <PageTransition>
                  <UserCreate />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="users/:id"
            element={
              <ProtectedRoute roles={['admin']}>
                <PageTransition>
                  <UserDetail />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="users/:id/edit"
            element={
              <ProtectedRoute roles={['admin']}>
                <PageTransition>
                  <UserEdit />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Performance */}
          <Route
            path="performance"
            element={
              <PageTransition>
                <Performance />
              </PageTransition>
            }
          />
          <Route
            path="performance/student/:studentId"
            element={
              <PageTransition>
                <StudentPerformance />
              </PageTransition>
            }
          />
          <Route
            path="performance/exam/:examId"
            element={
              <PageTransition>
                <ExamPerformance />
              </PageTransition>
            }
          />

          {/* Settings */}
          <Route
            path="settings"
            element={
              <PageTransition>
                <Settings />
              </PageTransition>
            }
          />
          <Route
            path="profile"
            element={
              <PageTransition>
                <Profile />
              </PageTransition>
            }
          />
        </Route>

        {/* 404 route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary-600 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Page not found</p>
                <button
                  onClick={() => window.history.back()}
                  className="btn btn-primary"
                >
                  Go Back
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default App; 