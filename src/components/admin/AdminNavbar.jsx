import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar({ setIsMobileOpen, activeTabTitle }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();

  const notifications = [
    { id: 1, title: 'New Reservation', desc: 'Drishti Virdi requested a table for 2', time: '10 min ago' },
    { id: 2, title: 'Contact Message', desc: 'Priya Malhotra sent a party inquiry', time: '45 min ago' },
    { id: 3, title: 'Reservation Confirmed', desc: 'Aarav Mehta confirmed for 8:00 PM', time: '2 hours ago' },
  ];

  return (
    <header className="h-16 bg-[#07130b]/90 backdrop-blur-md border-b border-[#e9c176]/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile Toggle & Breadcrumb Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden text-[#e9c176] p-1.5 rounded-xl hover:bg-[#0c1b11]"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#a0998e]">Admin</span>
          <span className="text-[#a0998e]/40">/</span>
          <span className="font-semibold text-[#e6e2dd] tracking-wide">{activeTabTitle}</span>
        </div>
      </div>

      {/* Right: Operational Status, Notifications & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* System Status Chip */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d2216] border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Operations</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl border border-[#e9c176]/20 bg-[#0c1b11] flex items-center justify-center text-[#a0998e] hover:text-[#e9c176] hover:border-[#e9c176]/40 transition-all cursor-pointer relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-lg">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#e9c176] rounded-full" />
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#09170e] saas-card p-4 shadow-2xl z-50 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#e9c176]/10 pb-3 mb-3">
                <h3 className="text-xs text-[#e6e2dd] font-semibold tracking-wide">Notifications</h3>
                <span className="text-[10px] bg-[#e9c176]/15 text-[#e9c176] font-bold px-2 py-0.5 rounded-full border border-[#e9c176]/30">
                  3 New
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-[#0d2015] border border-[#e9c176]/10 hover:border-[#e9c176]/30 transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-semibold text-[#e6e2dd]">{n.title}</h4>
                      <span className="text-[10px] text-[#a0998e]">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#a0998e]">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info Header */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#e9c176]/10">
          <div className="w-8 h-8 rounded-lg bg-[#e9c176] text-[#050d08] font-bold text-xs flex items-center justify-center">
            {(user?.name || 'Admin')[0].toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-[#e6e2dd] leading-none">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-[#a0998e] mt-0.5">{user?.email || 'admin@mayura.com'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
