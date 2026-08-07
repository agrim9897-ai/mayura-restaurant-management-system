import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import PageTransition from './components/PageTransition';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Experience from './pages/Experience';
import Reservation from './pages/Reservation';
import Contact from './pages/Contact';
import AdminLogin from './components/admin/AdminLogin';
import AdminForgotPassword from './components/admin/AdminForgotPassword';
import AdminResetPassword from './components/admin/AdminResetPassword';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function MainLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col justify-between bg-surface">
      {!isAdminRoute && <ScrollProgress />}
      {!isAdminRoute && <Navbar />}
      <ScrollToTop />
      <main className="flex-1 w-full flex flex-col">
        <PageTransition>
          <Routes>
            {/* Public Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Auth Routes (public) */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />

            {/* Admin Dashboard Routes (protected) */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-all */}
            <Route path="*" element={<Home />} />
          </Routes>
        </PageTransition>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </Router>
  );
}
