import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboardOverview({ stats, reservations, messages }) {
  const navigate = useNavigate();

  // Current formatted date matching reference format: "Friday, August 7th, 2026"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-12 select-none max-w-7xl mx-auto">
      {/* 1. Header Title Section (Luxury Editorial Style) */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E8E4DE]/60 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-bold tracking-tight">
            Today at Mayura
          </h1>
          <p className="text-xs text-[#666666] font-medium mt-1">
            {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => navigate('/admin/reservations')}
            className="px-4 py-2 bg-white border border-[#E8E4DE] text-[#1A1A1A] font-semibold text-xs rounded-xl hover:bg-[#FAF8F4] transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Reservations CRM</span>
            <span className="material-symbols-outlined text-sm text-[#666666]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 2. Key Operational Metrics (Visual Hierarchy - Reference Screenshot Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Covers Today */}
        <div className="saas-card p-5 flex flex-col justify-between h-32 relative group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#666666]">Covers Today</span>
            <span className="material-symbols-outlined text-base text-[#666666]">group</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-serif text-3xl text-[#1A1A1A] font-bold">
              {stats.todayReservations ?? 0}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <span>↑ 12%</span>
            </span>
          </div>
        </div>

        {/* Card 2: Requires Review / Pending */}
        <div className="saas-card p-5 flex flex-col justify-between h-32 relative group border-l-4 border-l-[#C5A059]">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#666666]">Requires Review</span>
            <span className="material-symbols-outlined text-base text-[#C5A059]">hourglass_empty</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-serif text-3xl text-[#1A1A1A] font-bold">
              {stats.pendingReservations ?? 0}
            </span>
            <span className="text-xs font-medium text-[#C5A059]">Pending</span>
          </div>
        </div>

        {/* Card 3: Total Reservations */}
        <div className="saas-card p-5 flex flex-col justify-between h-32 relative group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#666666]">Total Bookings</span>
            <span className="material-symbols-outlined text-base text-[#666666]">calendar_today</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-serif text-3xl text-[#1A1A1A] font-bold">
              {stats.totalReservations ?? 0}
            </span>
            <span className="text-xs text-[#666666]">All-time</span>
          </div>
        </div>

        {/* Card 4: Confirmed & Completed */}
        <div className="saas-card p-5 flex flex-col justify-between h-32 relative group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#666666]">Confirmed Bookings</span>
            <span className="material-symbols-outlined text-base text-[#666666]">check_circle</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-serif text-3xl text-[#1A1A1A] font-bold">
              {stats.confirmedReservations ?? 0}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Active</span>
          </div>
        </div>
      </div>

      {/* 3. Main Split Operations Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Recent Reservations Enterprise Table */}
        <div className="lg:col-span-8 saas-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8E4DE] pb-4">
            <div>
              <h3 className="font-serif text-xl text-[#1A1A1A] font-bold">Today's Reservations</h3>
              <p className="text-xs text-[#666666] mt-0.5">Live guest arrival schedule and table allocations</p>
            </div>
            <button
              onClick={() => navigate('/admin/reservations')}
              className="text-xs text-[#C5A059] hover:underline font-semibold cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8E4DE] text-[11px] uppercase tracking-wider text-[#666666]">
                  <th className="py-3 px-3 font-medium">Guest</th>
                  <th className="py-3 px-3 font-medium">Date & Time</th>
                  <th className="py-3 px-3 font-medium">Table</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DE]/60 text-xs text-[#1A1A1A]">
                {reservations.slice(0, 6).map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF8F4] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-[#1A1A1A]">{r.name}</div>
                      <div className="text-[11px] text-[#666666]">{r.email}</div>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div>{r.date || (r.reservationDate ? String(r.reservationDate).split('T')[0] : '—')}</div>
                      <div className="text-[#C5A059] font-mono text-[11px] font-semibold">{r.time || r.reservationTime || '—'}</div>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-[#FAF8F4] border border-[#E8E4DE] text-[#1A1A1A] font-semibold">
                        {r.tableNumber || 'Auto'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                          r.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : r.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : r.status === 'COMPLETED'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Operations Panel & Customer Messages */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Operations Panel */}
          <div className="saas-card p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#1A1A1A] font-bold border-b border-[#E8E4DE] pb-3">
              Quick Actions
            </h3>
            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/admin/reservations')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] hover:border-[#C5A059]/50 text-xs font-semibold text-[#1A1A1A] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-[#C5A059]">add_circle</span>
                  <span>+ New Reservation</span>
                </div>
                <span className="material-symbols-outlined text-xs text-[#666666] group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </button>

              <button
                onClick={() => navigate('/admin/tables')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] hover:border-[#C5A059]/50 text-xs font-semibold text-[#1A1A1A] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-[#666666]">table_restaurant</span>
                  <span>Live Floor Plan</span>
                </div>
                <span className="material-symbols-outlined text-xs text-[#666666] group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </button>

              <button
                onClick={() => navigate('/admin/menu')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] hover:border-[#C5A059]/50 text-xs font-semibold text-[#1A1A1A] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-[#666666]">restaurant_menu</span>
                  <span>Update Menu Catalog</span>
                </div>
                <span className="material-symbols-outlined text-xs text-[#666666] group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </button>

              <button
                onClick={() => navigate('/admin/settings')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] hover:border-[#C5A059]/50 text-xs font-semibold text-[#1A1A1A] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-[#666666]">tune</span>
                  <span>Restaurant Settings</span>
                </div>
                <span className="material-symbols-outlined text-xs text-[#666666] group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          {/* Customer Messages Inbox Preview */}
          <div className="saas-card p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8E4DE] pb-3">
              <h3 className="font-serif text-lg text-[#1A1A1A] font-bold">Recent Messages</h3>
              <button
                onClick={() => navigate('/admin/contact')}
                className="text-xs text-[#C5A059] hover:underline font-semibold cursor-pointer"
              >
                Inbox →
              </button>
            </div>
            <div className="space-y-3">
              {messages.slice(0, 3).map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-[#1A1A1A]">
                    <span>{m.name}</span>
                    <span className="text-[10px] text-[#666666] font-normal">{m.date ? m.date.split(' ')[0] : 'Today'}</span>
                  </div>
                  <p className="text-[#666666] text-[11px] line-clamp-2">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
