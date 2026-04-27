import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import { LoginPage, RegisterPage, DashboardPage } from './pages';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
  const { fetchUser, isInitialized } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (!isInitialized) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes (Auth) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes (Main App) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports" element={<div>Halaman Laporan Saya (Coming Soon)</div>} />
        <Route path="/profile" element={<div>Halaman Profil (Coming Soon)</div>} />
      </Route>
      
      {/* Catch-all 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
