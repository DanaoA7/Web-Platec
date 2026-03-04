import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterAdminPage from './pages/RegisterAdminPage';
import DashboardPage from './pages/DashboardPage';
import TeacherManagementPage from './pages/TeacherManagementPage';
import StudentApprovalsPage from './pages/StudentApprovalsPage';
import AttendancePage from './pages/AttendancePage';
import ReportsPage from './pages/ReportsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!admin) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        {/* Toast container MUST be here */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme="colored"
        />

        <Routes>
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/registeradmin" element={<RegisterAdminPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teachers"
            element={
              <ProtectedRoute>
                <TeacherManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-approvals"
            element={
              <ProtectedRoute>
                <StudentApprovalsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
