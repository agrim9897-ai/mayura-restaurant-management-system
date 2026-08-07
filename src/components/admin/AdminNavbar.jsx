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
    <header className="h-16 bg-[#FAF8F4]/90 backdrop-blur-md border-b border-[#E8E4DE] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden text-[#1A1A1A] p-1.5 rounded-xl hover:bg-[#EFE9DF]"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#666666]">Management</span>
          <span className="text-[#666666]/40">/</span>
          <span className="font-semibold text-[#1A1A1A] tracking-tight">{activeTabTitle}</span>
        </div>
      </div>

      {/* Right: Operational Status, Search, Notifications & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Icon */}
        <button className="text-[#666666] hover:text-[#1A1A1A] p-1.5 rounded-lg hover:bg-[#EFE9DF] transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-lg">search</span>
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 rounded-xl border border-[#E8E4DE] bg-white flex items-center justify-center text-[#666666] hover:text-[#1A1A1A] hover:border-[#C5A059]/40 transition-all cursor-pointer relative shadow-2xs"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-base">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-xl z-50 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#E8E4DE] pb-3 mb-3">
                <h3 className="text-xs text-[#1A1A1A] font-semibold tracking-tight">Notifications</h3>
                <span className="text-[10px] bg-[#FAF6EE] text-[#C5A059] font-bold px-2 py-0.5 rounded-full border border-[#C5A059]/30">
                  3 New
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] hover:border-[#C5A059]/40 transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-semibold text-[#1A1A1A]">{n.title}</h4>
                      <span className="text-[10px] text-[#666666]">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#666666]">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info Header Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#E8E4DE]">
          <div className="w-7 h-7 rounded-full bg-[#C5A059] text-white font-bold text-xs flex items-center justify-center">
            {(user?.name || 'Admin')[0].toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
