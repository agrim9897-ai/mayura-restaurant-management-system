import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Experience from './pages/Experience';
import AdminLogin from './components/admin/AdminLogin';
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
    <>
      {!isAdminRoute && <ScrollProgress />}
      {!isAdminRoute && <Navbar />}
      <ScrollToTop />
      <Routes>
        {/* Public Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/experience" element={<Experience />} />

        {/* Admin Login Route */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin/*" element={<Admin />} />

        {/* Fallback Catch-all */}
        <Route path="*" element={<Home />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}
