import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboardOverview({ stats, reservations, messages }) {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Total Reservations",
      value: stats.totalReservations,
      subtext: "+14% from last week",
      icon: "table_restaurant",
      color: "text-[#e9c176]",
      bg: "bg-[#e9c176]/10",
      border: "border-[#e9c176]/30",
    },
    {
      title: "Pending Reservations",
      value: stats.pendingReservations,
      subtext: "Requires review",
      icon: "hourglass_empty",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/30",
    },
    {
      title: "Today's Reservations",
      value: stats.todayReservations,
      subtext: "88% seating capacity",
      icon: "calendar_today",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/30",
    },
    {
      title: "Contact Messages",
      value: stats.contactMessages,
      subtext: "4 unread inquiries",
      icon: "mail",
      color: "text-sky-400",
      bg: "bg-sky-400/10",
      border: "border-sky-400/30",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-[#0e1d13] gold-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#e9c176]/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e9c176] bg-[#e9c176]/15 px-3 py-1 rounded-full border border-[#e9c176]/30">
            SYSTEM STATUS: ONLINE
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-[#e9c176] font-bold mt-3">
            Welcome to Mayura Operations
          </h2>
          <p className="text-xs md:text-sm text-[#a0998e] mt-1 max-w-xl">
            Real-time management dashboard for dinner bookings, customer feedback, and dining room settings.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate('/admin/reservations')}
            className="flex-1 md:flex-none px-5 py-3 bg-[#e9c176] text-[#0f1f15] font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] transition-all cursor-pointer shadow-lg"
          >
            Review Bookings
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`bg-[#0d1c13] rounded-2xl p-6 border ${c.border} hover:shadow-xl transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#a0998e] font-medium">
                {c.title}
              </span>
              <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-xl">{c.icon}</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="font-serif text-3xl md:text-4xl text-[#e6e2dd] font-bold">
                {c.value}
              </span>
              <p className="text-xs text-[#a0998e] mt-1 flex items-center gap-1">
                <span>{c.subtext}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Split Section: Recent Reservations & Unread Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Reservations Table (8 cols) */}
        <div className="lg:col-span-8 bg-[#0d1c13] gold-border rounded-2xl p-6">
          <div className="flex items-center justify-between border-b border-[#e9c176]/15 pb-4 mb-4">
            <div>
              <h3 className="font-serif text-lg text-[#e9c176] font-bold">Recent Reservations</h3>
              <p className="text-xs text-[#a0998e]">Latest booking requests received</p>
            </div>
            <button
              onClick={() => navigate('/admin/reservations')}
              className="text-xs text-[#e9c176] hover:underline uppercase tracking-wider font-semibold cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e9c176]/10 text-[11px] uppercase tracking-wider text-[#a0998e]">
                  <th className="py-3 px-3">Guest</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Guests</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9c176]/5 text-xs text-[#c8c2b7]">
                {reservations.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-[#122419] transition-colors">
                    <td className="py-3 px-3 font-medium text-[#e6e2dd]">
                      {r.name}
                      <span className="block text-[10px] text-[#a0998e]">{r.email}</span>
                    </td>
                    <td className="py-3 px-3">
                      {r.date} <span className="text-[#e9c176] font-semibold">@ {r.time}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold">{r.guests} Guests</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          r.status === 'CONFIRMED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : r.status === 'PENDING'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : r.status === 'COMPLETED'
                            ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
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

        {/* Messages & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#0d1c13] gold-border rounded-2xl p-6">
            <h3 className="font-serif text-lg text-[#e9c176] font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/reservations')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#122419] border border-[#e9c176]/20 hover:border-[#e9c176] text-xs text-[#e6e2dd] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#e9c176]">add_circle</span>
                  <span>Manage Reservations</span>
                </div>
                <span className="material-symbols-outlined text-sm text-[#a0998e] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={() => navigate('/admin/menu')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#122419] border border-[#e9c176]/20 hover:border-[#e9c176] text-xs text-[#e6e2dd] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#e9c176]">restaurant_menu</span>
                  <span>Update Menu Items</span>
                </div>
                <span className="material-symbols-outlined text-sm text-[#a0998e] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={() => navigate('/admin/settings')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#122419] border border-[#e9c176]/20 hover:border-[#e9c176] text-xs text-[#e6e2dd] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#e9c176]">tune</span>
                  <span>Edit Restaurant Info</span>
                </div>
                <span className="material-symbols-outlined text-sm text-[#a0998e] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Contact Inquiries Widget */}
          <div className="bg-[#0d1c13] gold-border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-base text-[#e9c176] font-bold">Latest Contact Notes</h3>
              <button
                onClick={() => navigate('/admin/contact')}
                className="text-[11px] text-[#e9c176] hover:underline uppercase"
              >
                All Messages
              </button>
            </div>
            <div className="space-y-3">
              {messages.slice(0, 2).map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-[#122419] border border-[#e9c176]/10 text-xs">
                  <div className="flex justify-between font-semibold text-[#e6e2dd]">
                    <span>{m.name}</span>
                    <span className="text-[10px] text-[#a0998e]">{m.date.split(" ")[0]}</span>
                  </div>
                  <p className="text-[#a0998e] text-[11px] mt-1 line-clamp-2">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
