import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'grid_view' },
    { path: '/admin/reservations', label: 'Reservations', icon: 'calendar_today' },
    { path: '/admin/tables', label: 'Floor Plan', icon: 'apps' },
    { path: '/admin/menu', label: 'Menu', icon: 'restaurant_menu' },
    { path: '/admin/contact', label: 'Messages', icon: 'mail' },
    { path: '/admin/settings', label: 'Settings', icon: 'settings' },
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
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden animate-backdrop-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 w-64 bg-[#FAF8F4] border-r border-[#E8E4DE] z-50 flex flex-col justify-between transition-transform duration-300 select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full justify-between p-5">
          <div>
            {/* Brand Header (Warm Editorial Luxury Style) */}
            <div className="px-2 py-3 mb-6 flex items-center justify-between border-b border-[#E8E4DE]/60 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF8F4] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shadow-xs">
                  <span className="font-serif font-bold text-base">M</span>
                </div>
                <div>
                  <h2 className="font-serif text-lg text-[#1A1A1A] font-bold tracking-tight leading-tight">Mayura</h2>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#666666] font-medium">Fine Dining</p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden text-[#666666] hover:text-[#1A1A1A] p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1.5">
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
                        ? 'bg-[#EFE9DF] text-[#1A1A1A] font-semibold border border-[#E0D7C8]/80 shadow-2xs'
                        : 'text-[#666666] hover:bg-[#F2ECE1]/60 hover:text-[#1A1A1A]'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#C5A059] rounded-r-full" />
                    )}
                    <span className={`material-symbols-outlined text-lg ${isActive ? 'text-[#C5A059]' : 'text-[#666666]'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Profile Footer */}
          <div className="pt-4 border-t border-[#E8E4DE] space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8E4DE] shadow-2xs">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-[#C5A059] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {getInitials(user?.name || 'Admin')}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-[#1A1A1A] truncate">{user?.name || 'Administrator'}</div>
                  <div className="text-[10px] text-[#666666] truncate">{user?.email || 'admin@mayura.com'}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-[#666666] hover:text-red-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
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
