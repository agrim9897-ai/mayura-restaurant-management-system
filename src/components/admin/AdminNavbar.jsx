import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar({ setIsMobileOpen, activeTabTitle }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'New Reservation', desc: 'Drishti Virdi requested a table for 2', time: '10 min ago' },
    { id: 2, title: 'Contact Message', desc: 'Priya Malhotra sent a party inquiry', time: '45 min ago' },
    { id: 3, title: 'Reservation Confirmed', desc: 'Aarav Mehta confirmed for 8:00 PM', time: '2 hours ago' },
  ];

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    navigate('/admin', { replace: true });
  };

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

      {/* Right: Operational Controls, Notifications & Profile Avatar Menu */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Icon */}
        <button className="text-[#666666] hover:text-[#1A1A1A] p-1.5 rounded-lg hover:bg-[#EFE9DF] transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-lg">search</span>
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
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

        {/* User Profile Avatar Entry Point with Dropdown */}
        <div className="relative pl-2 border-l border-[#E8E4DE]">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#EFE9DF]/60 transition-all cursor-pointer"
            title="Account Menu"
          >
            <div className="w-8 h-8 rounded-full bg-[#C5A059] text-white font-bold text-xs flex items-center justify-center shadow-xs overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user?.name || 'Admin'} className="w-full h-full object-cover" />
              ) : (
                <span>{(user?.name || 'Admin')[0].toUpperCase()}</span>
              )}
            </div>
            <span className="material-symbols-outlined text-sm text-[#666666]">expand_more</span>
          </button>

          {/* Admin Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-[#E8E4DE] rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn space-y-1">
              <div className="px-3 py-2.5 border-b border-[#E8E4DE]">
                <div className="text-xs font-bold text-[#1A1A1A] truncate">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] text-[#666666] truncate">{user?.email || 'admin@mayura.com'}</div>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/admin/profile');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-[#FAF8F4] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#C5A059]">account_circle</span>
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/admin/profile?tab=settings');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-[#FAF8F4] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#666666]">tune</span>
                <span>Account Settings</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/admin/profile?tab=security');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1A1A1A] hover:bg-[#FAF8F4] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#666666]">security</span>
                <span>Security</span>
              </button>

              <div className="border-t border-[#E8E4DE] pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
