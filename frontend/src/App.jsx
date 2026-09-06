import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import Layout from './components/Layout';
import ProtectedRoute, { PublicOnlyRoute } from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyJournal from './pages/MyJournal';
import JournalEditor from './pages/JournalEditor';
import JournalView from './pages/JournalView';
import CalendarPage from './pages/CalendarPage';
import MoodTracker from './pages/MoodTracker';
import Favorites from './pages/Favorites';
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
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
