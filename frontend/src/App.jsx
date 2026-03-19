import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import RegisterPage from "./pages/RegisterPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ClientDashboardPage from "./pages/ClientDashboardPage";
import PswDashboardPage from "./pages/PswDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import PswSearchPage from "./pages/PswSearchPage";
import PswProfilePage from "./pages/PswProfilePage";
import BookingPage from "./pages/BookingPage";
import BookingsPage from "./pages/BookingsPage";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import AvailabilityCalendarPage from "./pages/AvailabilityCalendarPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import UserManagementPage from "./pages/UserManagementPage";
import PswVerificationPage from "./pages/PswVerificationPage";
import DisputeManagementPage from "./pages/DisputeManagementPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/role" element={<RoleSelectionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/psw-search" element={<PswSearchPage />} />
        <Route path="/psw/:userId" element={<PswProfilePage />} />

        <Route
          path="/dashboard/client"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/psw"
          element={
            <ProtectedRoute allowedRoles={["psw"]}>
              <PswDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/:pswId"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={["client", "psw"]}>
              <BookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute allowedRoles={["client", "psw"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:appointmentId"
          element={
            <ProtectedRoute allowedRoles={["client", "psw"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["client", "psw", "admin"]}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute allowedRoles={["client", "psw"]}>
              <ProfileEditPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/availability"
          element={
            <ProtectedRoute allowedRoles={["psw"]}>
              <AvailabilityCalendarPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/panel"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanelPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/verification"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PswVerificationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/disputes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DisputeManagementPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
