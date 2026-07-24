import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

/**
 * ProtectedRoute — redirects to /login if user is not authenticated.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/**
 * PublicRoute — redirects authenticated users: Admin -> /admin, User -> /dashboard.
 */
function PublicRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

/**
 * RootRedirect — redirects root URL / to appropriate landing page based on authentication & role.
 */
function RootRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user?.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard'} replace />;
}

/**
 * AdminRoute — redirects to /dashboard if user is not an admin.
 */
function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.role === 'ROLE_ADMIN' ? children : <Navigate to="/dashboard" replace />;
}

/**
 * App component — sets up providers, toaster, and routing.
 */
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected App Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard"    element={<DashboardPage />} />
          <Route path="income"       element={<IncomePage />} />
          <Route path="expenses"     element={<ExpensePage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="reports"      element={<ReportsPage />} />
          <Route path="profile"      element={<ProfilePage />} />
          <Route path="admin"        element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          gutter={8}
          containerStyle={{ top: 20, right: 20 }}
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--toast-bg, #1e1e2e)',
              color: '#e2e8f0',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
              border: '1px solid rgba(255,255,255,0.08)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
