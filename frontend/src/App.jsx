import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import Layout from './components/Layout';
import ProtectedRoute, { PublicOnlyRoute } from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import MyJournal from './pages/MyJournal';
import JournalEditor from './pages/JournalEditor';
import JournalView from './pages/JournalView';
import CalendarPage from './pages/CalendarPage';
import MoodTracker from './pages/MoodTracker';
import Log from './pages/Log';
import Recap from './pages/Recap';
import Memories from './pages/Memories';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route
              path="/"
              element={
                <PublicOnlyRoute>
                  <Landing />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicOnlyRoute>
                  <ForgotPassword />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <PublicOnlyRoute>
                  <ResetPassword />
                </PublicOnlyRoute>
              }
            />

            {/* Authenticated app */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journal" element={<MyJournal />} />
              <Route path="/journal/new" element={<JournalEditor />} />
              <Route path="/journal/:id" element={<JournalView />} />
              <Route path="/journal/:id/edit" element={<JournalEditor />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/log" element={<Log />} />
              <Route path="/recap" element={<Recap />} />
              <Route path="/memories" element={<Memories />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Memory Lane and Favorites merged into one page with tabs, and
                Sleep Log + Cry Log into another — old links/bookmarks still
                land somewhere useful. */}
            <Route path="/memory-lane" element={<Navigate to="/memories" replace />} />
            <Route path="/favorites" element={<Navigate to="/memories?tab=favorites" replace />} />
            <Route path="/sleep" element={<Navigate to="/log" replace />} />
            <Route path="/cry" element={<Navigate to="/log?tab=cry" replace />} />
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
