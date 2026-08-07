import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { path: '/admin/tables', label: 'Table Management', icon: 'table_restaurant' },
    { path: '/admin/reservations', label: 'Reservations', icon: 'book_online' },
    { path: '/admin/contact', label: 'Contact Messages', icon: 'mail' },
    { path: '/admin/menu', label: 'Menu Management', icon: 'menu_book' },
    { path: '/admin/settings', label: 'Restaurant Settings', icon: 'settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin', { replace: true });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 w-64 bg-[#09160e] gold-border border-r border-t-0 border-b-0 border-l-0 z-50 flex flex-col justify-between transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#e9c176]/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#e9c176]/50 bg-[#12281a] flex items-center justify-center text-[#e9c176]">
                <span className="material-symbols-outlined text-xl">restaurant</span>
              </div>
              <div>
                <h2 className="font-serif text-lg text-[#e9c176] font-bold tracking-wider">MAYURA</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#a0998e]">ADMIN PORTAL</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-[#a0998e] hover:text-[#e9c176] p-1"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#e9c176] text-[#0f1f15] shadow-[0_0_15px_rgba(233,193,118,0.25)] font-semibold'
                      : 'text-[#c8c2b7] hover:bg-[#122419] hover:text-[#e9c176]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#0f1f15] text-[#e9c176]' : 'bg-[#e9c176]/20 text-[#e9c176]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer — Logout */}
        <div className="p-4 border-t border-[#e9c176]/15">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 text-xs uppercase tracking-wider font-medium transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
