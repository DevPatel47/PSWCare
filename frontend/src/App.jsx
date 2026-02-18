import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import PswDashboardPage from './pages/PswDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard/client"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <ClientDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/psw"
          element={
            <ProtectedRoute allowedRoles={["PSW"]}>
              <PswDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
