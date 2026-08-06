import React, { useState } from 'react';

export default function AdminNavbar({ setIsMobileOpen, activeTabTitle }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'New Reservation', desc: 'Drishti Virdi requested a table for 2', time: '10 min ago' },
    { id: 2, title: 'Contact Message', desc: 'Priya Malhotra sent a party inquiry', time: '45 min ago' },
    { id: 3, title: 'Reservation Confirmed', desc: 'Aarav Mehta confirmed for 8:00 PM', time: '2 hours ago' },
  ];

  return (
    <header className="h-16 bg-[#09160e]/95 backdrop-blur-md border-b border-[#e9c176]/15 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden text-[#e9c176] p-1 rounded-lg hover:bg-[#122419]"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <h1 className="font-serif text-lg md:text-xl text-[#e9c176] font-semibold tracking-wide">
          {activeTabTitle}
        </h1>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full border border-[#e9c176]/30 bg-[#102217] flex items-center justify-center text-[#e9c176] hover:border-[#e9c176] hover:shadow-[0_0_12px_rgba(233,193,118,0.2)] transition-all cursor-pointer relative"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#e9c176] rounded-full animate-pulse" />
          </button>

          {/* Notifications Modal Popup */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0c1810] gold-border rounded-2xl p-4 shadow-2xl z-50 animate-scale">
              <div className="flex items-center justify-between border-b border-[#e9c176]/15 pb-3 mb-3">
                <h3 className="font-serif text-sm text-[#e9c176] font-bold uppercase tracking-wider">
                  Notifications
                </h3>
                <span className="text-[10px] bg-[#e9c176]/20 text-[#e9c176] font-bold px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-[#122419] border border-[#e9c176]/10 hover:border-[#e9c176]/30 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-semibold text-[#e6e2dd]">{n.title}</h4>
                      <span className="text-[10px] text-[#a0998e]">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#a0998e] mt-1">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#e9c176]/15">
          <div className="w-10 h-10 rounded-full border border-[#e9c176] bg-[#e9c176]/10 flex items-center justify-center text-[#e9c176] font-serif font-bold text-sm">
            M
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-[#e6e2dd]">Admin Manager</p>
            <p className="text-[10px] text-[#a0998e]">admin@mayura.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
