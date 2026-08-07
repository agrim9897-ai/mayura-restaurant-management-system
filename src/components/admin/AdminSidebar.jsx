import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/admin/dashboard', label: 'Overview', icon: 'space_dashboard' },
    { path: '/admin/reservations', label: 'Reservations CRM', icon: 'book_online' },
    { path: '/admin/tables', label: 'Floor Plan & Tables', icon: 'table_restaurant' },
    { path: '/admin/menu', label: 'Menu Catalog', icon: 'menu_book' },
    { path: '/admin/contact', label: 'Customer Inbox', icon: 'mail' },
    { path: '/admin/settings', label: 'Portal Settings', icon: 'tune' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin', { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-backdrop-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 w-64 bg-[#07130b] border-r border-[#e9c176]/10 z-50 flex flex-col justify-between transition-transform duration-300 select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full justify-between p-4">
          <div>
            {/* Brand Header */}
            <div className="px-3 py-4 border-b border-[#e9c176]/10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border border-[#e9c176]/30 bg-[#0f2417] flex items-center justify-center text-[#e9c176] shadow-sm">
                  <span className="material-symbols-outlined text-lg">restaurant</span>
                </div>
                <div>
                  <h2 className="font-serif text-base text-[#e9c176] font-bold tracking-wide">MAYURA</h2>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#a0998e]">EXECUTIVE PORTAL</p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden text-[#a0998e] hover:text-[#e6e2dd] p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#a0998e]/70">
                Management
              </div>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer relative ${
                      isActive
                        ? 'bg-[#102418] text-[#e9c176] font-semibold border border-[#e9c176]/20'
                        : 'text-[#a0998e] hover:bg-[#0c1b11] hover:text-[#e6e2dd]'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#e9c176] rounded-r-full" />
                    )}
                    <span className={`material-symbols-outlined text-lg ${isActive ? 'text-[#e9c176]' : 'text-[#a0998e]'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Profile Card & Logout */}
          <div className="pt-4 border-t border-[#e9c176]/10 space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0c1b11] border border-[#e9c176]/10">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-[#e9c176] text-[#050d08] font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {getInitials(user?.name || 'Admin')}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-[#e6e2dd] truncate">{user?.name || 'Administrator'}</div>
                  <div className="text-[10px] text-[#a0998e] truncate">{user?.email || 'admin@mayura.com'}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-[#a0998e] hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Logout"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
