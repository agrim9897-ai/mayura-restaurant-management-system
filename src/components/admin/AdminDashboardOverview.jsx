import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboardOverview({ stats, reservations, messages }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* 1. Hero Operational Banner */}
      <div className="saas-card p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-[#e9c176]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e2517] border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>EXECUTIVE DINING ROOM ONLINE</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#e9c176] font-bold">
            Mayura Restaurant Operations
          </h1>
          <p className="text-xs md:text-sm text-[#a0998e] leading-relaxed">
            Monitor real-time guest bookings, manage table seating, review customer inquiries, and update menu availability.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto relative z-10">
          <button
            onClick={() => navigate('/admin/reservations')}
            className="flex-1 md:flex-none px-5 py-3 bg-[#e9c176] text-[#050d08] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Review Reservations</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 2. Asymmetric Metric Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Spotlight Card 1: Today's Reservations */}
        <div className="lg:col-span-4 saas-card p-6 flex flex-col justify-between border-l-4 border-l-[#e9c176]">
          <div>
            <div className="flex justify-between items-center text-xs text-[#a0998e] font-semibold uppercase tracking-wider">
              <span>Today's Bookings</span>
              <span className="material-symbols-outlined text-lg text-[#e9c176]">calendar_today</span>
            </div>
            <div className="font-serif text-4xl text-[#e6e2dd] font-bold mt-4">
              {stats.todayReservations ?? 0}
            </div>
            <p className="text-xs text-[#a0998e] mt-1">Scheduled guest reservations for today</p>
          </div>
          <button
            onClick={() => navigate('/admin/reservations')}
            className="mt-6 text-xs text-[#e9c176] hover:underline font-semibold flex items-center gap-1 self-start cursor-pointer"
          >
            <span>View Today's Schedule</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>

        {/* Spotlight Card 2: Pending Approval */}
        <div className="lg:col-span-4 saas-card p-6 flex flex-col justify-between border-l-4 border-l-amber-500">
          <div>
            <div className="flex justify-between items-center text-xs text-[#a0998e] font-semibold uppercase tracking-wider">
              <span>Requires Review</span>
              <span className="material-symbols-outlined text-lg text-amber-400">hourglass_empty</span>
            </div>
            <div className="font-serif text-4xl text-amber-400 font-bold mt-4">
              {stats.pendingReservations ?? 0}
            </div>
            <p className="text-xs text-[#a0998e] mt-1">Pending reservations awaiting confirmation</p>
          </div>
          <button
            onClick={() => navigate('/admin/reservations?status=PENDING')}
            className="mt-6 text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1 self-start cursor-pointer"
          >
            <span>Action Pending Requests</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>

        {/* Secondary Compact Metrics (4 cols stacked) */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <div className="saas-card p-4 flex flex-col justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#a0998e] font-semibold">Total All-Time</span>
            <span className="font-serif text-2xl text-[#e6e2dd] font-bold mt-2">{stats.totalReservations ?? 0}</span>
          </div>

          <div className="saas-card p-4 flex flex-col justify-between">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">Confirmed</span>
            <span className="font-serif text-2xl text-emerald-400 font-bold mt-2">{stats.confirmedReservations ?? 0}</span>
          </div>

          <div className="saas-card p-4 flex flex-col justify-between">
            <span className="text-[11px] uppercase tracking-wider text-sky-400 font-semibold">Completed</span>
            <span className="font-serif text-2xl text-sky-400 font-bold mt-2">{stats.completedReservations ?? 0}</span>
          </div>

          <div className="saas-card p-4 flex flex-col justify-between">
            <span className="text-[11px] uppercase tracking-wider text-rose-400 font-semibold">Cancelled</span>
            <span className="font-serif text-2xl text-rose-400 font-bold mt-2">{stats.cancelledReservations ?? 0}</span>
          </div>
        </div>
      </div>

      {/* 3. Split Layout: Recent Reservations Table vs Shortcuts & Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Reservations CRM Table (8 cols) */}
        <div className="lg:col-span-8 saas-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e9c176]/10 pb-4">
            <div>
              <h3 className="font-serif text-base text-[#e6e2dd] font-bold">Recent Reservations</h3>
              <p className="text-xs text-[#a0998e]">Latest booking activity recorded across dining areas</p>
            </div>
            <button
              onClick={() => navigate('/admin/reservations')}
              className="text-xs text-[#e9c176] hover:underline font-semibold uppercase tracking-wider cursor-pointer"
            >
              Open CRM →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e9c176]/10 text-[11px] uppercase tracking-wider text-[#a0998e]">
                  <th className="py-3 px-3 font-semibold">Guest</th>
                  <th className="py-3 px-3 font-semibold">Date & Time</th>
                  <th className="py-3 px-3 font-semibold">Table</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9c176]/5 text-xs text-[#e6e2dd]">
                {reservations.slice(0, 6).map((r) => (
                  <tr key={r.id} className="hover:bg-[#0e2217] transition-colors">
                    <td className="py-3.5 px-3 font-medium">
                      <div className="text-[#e6e2dd] font-semibold">{r.name}</div>
                      <div className="text-[10px] text-[#a0998e]">{r.email}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div>{r.date || (r.reservationDate ? String(r.reservationDate).split('T')[0] : '—')}</div>
                      <div className="text-[#e9c176] font-mono text-[11px]">{r.time || r.reservationTime || '—'}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs">
                      <span className="px-2 py-0.5 rounded-lg bg-[#08170e] border border-[#e9c176]/20 text-[#e9c176]">
                        {r.tableNumber || 'Auto-Assigned'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                          r.status === 'CONFIRMED'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                            : r.status === 'PENDING'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                            : r.status === 'COMPLETED'
                            ? 'bg-sky-950/60 text-sky-400 border-sky-500/30'
                            : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
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

        {/* Action Shortcuts & Latest Inquiries (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Operational Shortcuts */}
          <div className="saas-card p-6 space-y-4">
            <h3 className="text-xs text-[#a0998e] font-semibold uppercase tracking-wider">Operational Shortcuts</h3>
            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/admin/tables')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#08170e] border border-[#e9c176]/15 hover:border-[#e9c176]/40 text-xs text-[#e6e2dd] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-[#e9c176]">table_restaurant</span>
                  <span>View Floor Plan & Capacity</span>
                </div>
                <span className="material-symbols-outlined text-xs text-[#a0998e] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={() => navigate('/admin/menu')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#08170e] border border-[#e9c176]/15 hover:border-[#e9c176]/40 text-xs text-[#e6e2dd] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-[#e9c176]">restaurant_menu</span>
                  <span>Update Menu Catalog</span>
                </div>
                <span className="material-symbols-outlined text-xs text-[#a0998e] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={() => navigate('/admin/settings')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#08170e] border border-[#e9c176]/15 hover:border-[#e9c176]/40 text-xs text-[#e6e2dd] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-[#e9c176]">tune</span>
                  <span>Configure Restaurant Info</span>
                </div>
                <span className="material-symbols-outlined text-xs text-[#a0998e] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Latest Inbox Preview */}
          <div className="saas-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs text-[#a0998e] font-semibold uppercase tracking-wider">Customer Inbox</h3>
              <button
                onClick={() => navigate('/admin/contact')}
                className="text-[11px] text-[#e9c176] hover:underline font-semibold"
              >
                Open Inbox
              </button>
            </div>
            <div className="space-y-3">
              {messages.slice(0, 2).map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl bg-[#08170e] border border-[#e9c176]/10 text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-[#e6e2dd]">
                    <span>{m.name}</span>
                    <span className="text-[10px] text-[#a0998e]">{m.date ? m.date.split(" ")[0] : 'Today'}</span>
                  </div>
                  <p className="text-[#a0998e] text-[11px] line-clamp-2">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
