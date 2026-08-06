import React, { useState } from 'react';

export default function AdminReservations({ reservations, setReservations }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRes, setSelectedRes] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter reservations by search term & status
  const filtered = reservations.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (newStatus) => {
    if (!selectedRes) return;
    setReservations((prev) =>
      prev.map((r) => (r.id === selectedRes.id ? { ...r, status: newStatus } : r))
    );
    setIsEditModalOpen(false);
    showToast(`Reservation #${selectedRes.id} status updated to ${newStatus}`);
  };

  const handleDelete = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    showToast(`Reservation #${id} deleted successfully`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#e9c176] text-[#0f1f15] font-semibold text-xs px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Control Header & Filters */}
      <div className="bg-[#0d1c13] gold-border rounded-2xl p-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-3 text-sm text-[#a0998e]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by customer name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#e6e2dd] focus:outline-none custom-focus"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#a0998e] font-medium uppercase tracking-wider hidden sm:inline">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#07140c] border border-[#e9c176]/30 rounded-xl px-4 py-2.5 text-xs text-[#e6e2dd] focus:outline-none cursor-pointer custom-focus"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending (Yellow)</option>
            <option value="CONFIRMED">Confirmed (Green)</option>
            <option value="CANCELLED">Cancelled (Red)</option>
            <option value="COMPLETED">Completed (Blue)</option>
          </select>
        </div>
      </div>

      {/* Reservation Table Card */}
      <div className="bg-[#0d1c13] gold-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#09160e] border-b border-[#e9c176]/15 text-[11px] uppercase tracking-wider text-[#e9c176]">
                <th className="py-4 px-4 font-semibold">Customer Name</th>
                <th className="py-4 px-4 font-semibold">Phone</th>
                <th className="py-4 px-4 font-semibold">Email</th>
                <th className="py-4 px-4 font-semibold">Date & Time</th>
                <th className="py-4 px-4 font-semibold text-center">Guests</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9c176]/10 text-xs text-[#c8c2b7]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-[#a0998e]">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-[#e9c176]/40">
                      table_restaurant
                    </span>
                    No reservations found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#122419] transition-colors">
                    {/* Name & Occasion */}
                    <td className="py-4 px-4 font-semibold text-[#e6e2dd]">
                      {r.name}
                      <span className="block text-[10px] text-[#a0998e] font-normal">
                        {r.occasion || 'Standard Table'} • {r.seatingPreference || 'Indoor'}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-4 font-mono text-xs">{r.phone}</td>

                    {/* Email */}
                    <td className="py-4 px-4 text-[#a0998e] max-w-[180px] truncate">{r.email}</td>

                    {/* Date & Time */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {r.date} <span className="text-[#e9c176] font-semibold">@ {r.time}</span>
                    </td>

                    {/* Guests */}
                    <td className="py-4 px-4 text-center font-bold text-[#e6e2dd]">{r.guests}</td>

                    {/* Status Badges */}
                    <td className="py-4 px-4">
                      {r.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          PENDING
                        </span>
                      )}
                      {r.status === 'CONFIRMED' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          CONFIRMED
                        </span>
                      )}
                      {r.status === 'CANCELLED' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          CANCELLED
                        </span>
                      )}
                      {r.status === 'COMPLETED' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          COMPLETED
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Status Button */}
                        <button
                          onClick={() => {
                            setSelectedRes(r);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#122419] border border-[#e9c176]/20 text-[#e9c176] hover:bg-[#e9c176] hover:text-[#0f1f15] transition-all cursor-pointer"
                          title="Edit Status"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg bg-[#122419] border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                          title="Delete Reservation"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {isEditModalOpen && selectedRes && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1c13] gold-border rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#e9c176]/15 pb-4">
              <h3 className="font-serif text-lg text-[#e9c176] font-bold">
                Update Status — #{selectedRes.id}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#a0998e] hover:text-[#e9c176]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="text-xs text-[#a0998e] space-y-1">
              <p>
                Guest: <strong className="text-[#e6e2dd]">{selectedRes.name}</strong> ({selectedRes.guests} guests)
              </p>
              <p>
                Scheduled: {selectedRes.date} at {selectedRes.time}
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider text-[#e9c176] font-medium">
                Select New Status:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { status: 'PENDING', label: 'Pending', color: 'border-amber-400/40 text-amber-400' },
                  { status: 'CONFIRMED', label: 'Confirmed', color: 'border-emerald-400/40 text-emerald-400' },
                  { status: 'COMPLETED', label: 'Completed', color: 'border-sky-400/40 text-sky-400' },
                  { status: 'CANCELLED', label: 'Cancelled', color: 'border-rose-400/40 text-rose-400' },
                ].map((st) => (
                  <button
                    key={st.status}
                    onClick={() => handleStatusChange(st.status)}
                    className={`py-3 px-4 rounded-xl border ${st.color} bg-[#07140c] hover:bg-[#122419] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#e9c176]/30 text-xs text-[#a0998e] hover:text-[#e6e2dd]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
