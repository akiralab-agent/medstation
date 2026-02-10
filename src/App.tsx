import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';

// Auth Pages
import { Login, SignUp, ForgotPassword, RegistrationKey } from './pages/Auth';

// Main Pages
import { Dashboard } from './pages/Dashboard';
import { Notifications } from './pages/Notifications';
import {
  ScheduleAppointment,
  ChooseSchedule,
  ServiceType,
  PaymentMethod,
  PaymentForm,
  MedCard,
} from './pages/Schedule';
import { MyAppointments, AppointmentDetail } from './pages/Appointments';
import { ExamResults, ExamDetail } from './pages/Exams';
import { Profile, MyInfo, PersonalData } from './pages/Profile';
import { Health } from './pages/Health';
import { Media } from './pages/Media';

import './styles/global.css';

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p>Loading...</p>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegistrationKey />
          </PublicRoute>
        }
      />

      {/* Private Routes with Layout */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Notifications */}
        <Route path="/notifications" element={<Notifications />} />

        {/* Schedule */}
        <Route path="/schedule" element={<MyAppointments />} />
        <Route path="/schedule/new" element={<ScheduleAppointment />} />
        <Route path="/schedule/choose" element={<ChooseSchedule />} />
        <Route path="/schedule/service-type" element={<ServiceType />} />
        <Route path="/schedule/payment" element={<PaymentMethod />} />
        <Route path="/schedule/payment-form" element={<PaymentForm />} />
        <Route path="/schedule/medcard" element={<MedCard />} />

        {/* Appointments */}
        <Route path="/appointments" element={<MyAppointments />} />
        <Route path="/appointments/:id" element={<AppointmentDetail />} />

        {/* Exams */}
        <Route path="/exams" element={<ExamResults />} />
        <Route path="/exams/:id" element={<ExamDetail />} />

        {/* Health */}
        <Route path="/health" element={<Health />} />

        {/* Media */}
        <Route path="/media" element={<Media />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/info" element={<MyInfo />} />
        <Route path="/profile/personal" element={<PersonalData />} />
        <Route path="/profile/programs" element={<Profile />} />
        <Route path="/profile/dashboard-settings" element={<Profile />} />
        <Route path="/profile/identity" element={<Profile />} />
        <Route path="/profile/notifications" element={<Profile />} />
        <Route path="/profile/change-password" element={<Profile />} />
        <Route path="/profile/terms" element={<Profile />} />
        <Route path="/profile/delete-account" element={<Profile />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
