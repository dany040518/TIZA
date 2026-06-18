import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Planning from './pages/Planning';
import MyPlans from './pages/MyPlans';
import Classes from './pages/Classes';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import WeeklyView from './pages/WeeklyView';
// TODO B2B: import CoordinatorDashboard from './_future-b2b/CoordinatorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Account from './pages/Account';
import ProtectedRoute from './components/ProtectedRoute';
import RootRedirect from './components/RootRedirect';

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />

          {/* Root: smart redirect based on authenticated role */}
          <Route path="/" element={<RootRedirect />} />

          {/* Teacher-only routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute role={['teacher']}><Dashboard /></ProtectedRoute>
          } />
          <Route path="/planning" element={
            <ProtectedRoute role={['teacher']}><Planning /></ProtectedRoute>
          } />
          <Route path="/my-plans" element={
            <ProtectedRoute role={['teacher']}><MyPlans /></ProtectedRoute>
          } />
          <Route path="/classes" element={
            <ProtectedRoute role={['teacher']}><Classes /></ProtectedRoute>
          } />
          <Route path="/classes/:classId/students" element={
            <ProtectedRoute role={['teacher']}><Students /></ProtectedRoute>
          } />
          <Route path="/classes/:classId/attendance" element={
            <ProtectedRoute role={['teacher']}><Attendance /></ProtectedRoute>
          } />
          <Route path="/weekly" element={
            <ProtectedRoute role={['teacher']}><WeeklyView /></ProtectedRoute>
          } />

          {/* TODO B2B: restaurar ruta /coordinator con CoordinatorDashboard */}

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute role={['admin']}><AdminDashboard /></ProtectedRoute>
          } />

          {/* Shared: any authenticated user */}
          <Route path="/account" element={
            <ProtectedRoute><Account /></ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ToastProvider>
  );
}