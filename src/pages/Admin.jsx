import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminDashboardOverview from '../components/admin/AdminDashboardOverview';
import AdminReservations from '../components/admin/AdminReservations';
import AdminTables from '../components/admin/AdminTables';
import AdminContactMessages from '../components/admin/AdminContactMessages';
import AdminMenuManagement from '../components/admin/AdminMenuManagement';
import AdminRestaurantSettings from '../components/admin/AdminRestaurantSettings';
import {
  fetchReservations,
  fetchReservationStats,
} from '../services/api/reservations.service';
import { fetchMenuItems } from '../services/api/menu.service';
import { fetchMessages } from '../services/api/messages.service';
import { fetchSettings } from '../services/api/settings.service';

export default function Admin() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Application Data States (populated via API service layer)
  const [stats, setStats] = useState({
    totalReservations: 0,
    pendingReservations: 0,
    todayReservations: 0,
    confirmedReservations: 0,
    cancelledReservations: 0,
    completedReservations: 0,
  });
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [settings, setSettings] = useState({});

  const refreshStats = useCallback(async () => {
    try {
      const statData = await fetchReservationStats();
      if (statData) setStats(statData);
    } catch (err) {
      console.error('Error refreshing stats:', err);
    }
  }, []);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [resData, statData, menuData, msgData, settData] = await Promise.all([
          fetchReservations({ limit: 50 }),
          fetchReservationStats(),
          fetchMenuItems(),
          fetchMessages(),
          fetchSettings(),
        ]);

        setReservations(resData?.data || []);
        setStats(statData || {});
        setMenuItems(menuData || []);
        setMessages(msgData || []);
        setSettings(settData || {});
      } catch (err) {
        console.error('Error loading dashboard API data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const getPageTitle = (path) => {
    switch (path) {
      case '/admin/dashboard':
        return 'Dashboard Overview';
      case '/admin/tables':
        return 'Table & Occupancy Management';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07120c] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-[#e9c176]">
          <div className="w-12 h-12 rounded-full border-2 border-[#e9c176]/20 border-t-[#e9c176] animate-spin" />
          <p className="font-label-caps text-xs uppercase tracking-[0.2em]">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

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
            <Route path="tables" element={<AdminTables />} />
            <Route
              path="reservations"
              element={
                <AdminReservations
                  reservations={reservations}
                  setReservations={setReservations}
                  refreshStats={refreshStats}
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
