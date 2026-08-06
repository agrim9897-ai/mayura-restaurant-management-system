import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminDashboardOverview from '../components/admin/AdminDashboardOverview';
import AdminReservations from '../components/admin/AdminReservations';
import AdminContactMessages from '../components/admin/AdminContactMessages';
import AdminMenuManagement from '../components/admin/AdminMenuManagement';
import AdminRestaurantSettings from '../components/admin/AdminRestaurantSettings';
import {
  initialStats,
  initialReservations,
  initialMessages,
  initialMenuItems,
  initialSettings,
} from '../data/adminMockData';

export default function Admin() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Shared state for demo dashboard interactivity
  const [stats, setStats] = useState(initialStats);
  const [reservations, setReservations] = useState(initialReservations);
  const [messages, setMessages] = useState(initialMessages);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [settings, setSettings] = useState(initialSettings);

  const getPageTitle = (path) => {
    switch (path) {
      case '/admin/dashboard':
        return 'Dashboard Overview';
      case '/admin/reservations':
        return 'Reservation Management';
      case '/admin/contact':
        return 'Contact Messages & Inquiries';
      case '/admin/menu':
        return 'Menu Management';
      case '/admin/settings':
        return 'Restaurant Settings';
      default:
        return 'Admin Portal';
    }
  };

  return (
    <div className="min-h-screen bg-[#07120c] text-[#e6e2dd] flex overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        {/* Navbar */}
        <AdminNavbar
          setIsMobileOpen={setIsMobileOpen}
          activeTabTitle={getPageTitle(location.pathname)}
        />

        {/* Sub-Route Views */}
        <main className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Routes>
            <Route
              path="dashboard"
              element={
                <AdminDashboardOverview
                  stats={stats}
                  reservations={reservations}
                  messages={messages}
                />
              }
            />
            <Route
              path="reservations"
              element={
                <AdminReservations
                  reservations={reservations}
                  setReservations={setReservations}
                />
              }
            />
            <Route
              path="contact"
              element={
                <AdminContactMessages
                  messages={messages}
                  setMessages={setMessages}
                />
              }
            />
            <Route
              path="menu"
              element={
                <AdminMenuManagement
                  menuItems={menuItems}
                  setMenuItems={setMenuItems}
                />
              }
            />
            <Route
              path="settings"
              element={
                <AdminRestaurantSettings
                  settings={settings}
                  setSettings={setSettings}
                />
              }
            />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
