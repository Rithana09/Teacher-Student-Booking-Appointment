import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./partials/Navbar";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentSignup from "./partials/StudentSignup";
import AppointmentForm from "./partials/AppointmentForm";
import TeacherSignup from "./partials/TeacherSignup";
import TeacherLogin from "./partials/TeacherLogin";
import ManageAppointments from "./partials/ManageAppointments";
import BookAppointment from "./partials/BookAppointment";
import StudentStatus from "./partials/StudentStatus";
import ProtectedRoute from "./partials/ProtectedRoute";
import PublicRoute from "./partials/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />

        <Route
          path="/student"
          element={
            <PublicRoute redirectTo="/student/status">
              <StudentDashboard />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute redirectTo="/student/status">
              <StudentSignup />
            </PublicRoute>
          }
        />

        <Route
          path="/tloginin"
          element={
            <PublicRoute redirectTo="/teacher/appointments">
              <TeacherLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/tsignup"
          element={
            <PublicRoute redirectTo="/teacher/appointments">
              <TeacherSignup />
            </PublicRoute>
          }
        />

        {/* Student protected routes */}
        <Route
          path="/student/status"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment"
          element={
            <ProtectedRoute requiredRole="student">
              <AppointmentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute requiredRole="student">
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        {/* Teacher protected routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/appointments"
          element={
            <ProtectedRoute requiredRole="teacher">
              <ManageAppointments />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized fallback */}
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
      </Routes>
    </BrowserRouter>
  );
}
