import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import PublicLayout from './layouts/PublicLayout';
import InstansiLayout from './layouts/InstansiLayout';
import { LoginPage, RegisterPage, DashboardPage } from './pages';
import { ProfilePage } from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import CreateReportPage from './pages/CreateReportPage';
import MessagesPage from './pages/MessagesPage';

import { useAuthStore } from './store/authStore';

function App() {
  const { fetchUser, isInitialized, user } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (!isInitialized) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Feed / Warga Dashboard */}
      <Route element={<PublicLayout />}>
        {/* Jika instansi login, lempar ke dashboard mereka */}
        <Route path="/" element={
          user?.role === 'instansi' ? <Navigate to="/instansi/dashboard" replace /> : <DashboardPage />
        } />
        <Route path="/profile" element={
          user ? <ProfilePage /> : <Navigate to="/login" replace />
        } />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/create" element={
          user ? <CreateReportPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/messages" element={
          user ? <MessagesPage /> : <Navigate to="/login" replace />
        } />

      </Route>

      {/* Guest Only Routes (Auth) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Instansi Only Routes */}
      <Route path="/instansi" element={<InstansiLayout />}>
        <Route path="" element={<Navigate to="/instansi/dashboard" replace />} />
        <Route path="dashboard" element={<div>Dasbor Instansi (Tabel Laporan Masuk)</div>} />
        <Route path="reports" element={<div>Semua Laporan Instansi</div>} />
        <Route path="statistics" element={<div>Statistik Instansi</div>} />
        <Route path="settings" element={<div>Pengaturan Instansi</div>} />
      </Route>
      
      {/* Catch-all 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
