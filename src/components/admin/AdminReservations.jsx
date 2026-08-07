import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchReservations,
  updateReservation,
  updateReservationStatus,
  deleteReservation,
} from '../../services/api/reservations.service';
import AdminSkeleton from './AdminSkeleton';

export default function AdminReservations({ setReservations: setParentReservations, refreshStats }) {
  // Controls state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('NEWEST');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // API Data state
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  // Slide-Over Drawer & Modals
  const [activeDrawerRes, setActiveDrawerRes] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resToDelete, setResToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    occasion: 'Standard Dining',
    seatingPreference: 'Indoor',
    status: 'PENDING',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch reservations from backend
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);
    try {
      const res = await fetchReservations({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        status: statusFilter,
        date: dateFilter,
        sort: sortBy,
      });

      setItems(res.data || []);
      setTotalCount(res.total || 0);
      setTotalPages(res.totalPages || 1);
      if (setParentReservations) {
        setParentReservations(res.data || []);
      }
    } catch (err) {
      setErrorState(err.message || 'Failed to fetch reservations from server');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, statusFilter, dateFilter, sortBy, setParentReservations]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (resId, newStatus, resName) => {
    setIsSubmitting(true);
    try {
      await updateReservationStatus(resId, newStatus);
      setItems((prev) =>
        prev.map((r) => (r.id === resId ? { ...r, status: newStatus } : r))
      );

      if (activeDrawerRes && activeDrawerRes.id === resId) {
        setActiveDrawerRes((prev) => ({ ...prev, status: newStatus }));
      }

      showToast(`Reservation for ${resName || 'guest'} marked as ${newStatus}`);
      if (refreshStats) refreshStats();
    } catch (err) {
      showToast(`Failed to update status: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (res) => {
    setEditForm({
      name: res.name || '',
      email: res.email || '',
      phone: res.phone || '',
      date: res.date || (res.reservationDate ? String(res.reservationDate).split('T')[0] : ''),
      time: res.time || res.reservationTime || '19:00',
      guests: res.guests || 2,
      occasion: res.occasion || 'Standard Dining',
      seatingPreference: res.seatingPreference || 'Indoor',
      status: res.status || 'PENDING',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!activeDrawerRes) return;

    setIsSubmitting(true);
    try {
      const updated = await updateReservation(activeDrawerRes.id, editForm);

      setItems((prev) =>
        prev.map((r) =>
          r.id === activeDrawerRes.id
            ? { ...r, ...updated, date: editForm.date, time: editForm.time }
            : r
        )
      );

      if (activeDrawerRes) {
        setActiveDrawerRes({ ...activeDrawerRes, ...updated, date: editForm.date, time: editForm.time });
      }

      showToast(`Reservation updated successfully`);
      setIsEditModalOpen(false);
      if (refreshStats) refreshStats();
    } catch (err) {
      showToast(`Failed to save edit: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!resToDelete) return;

    setIsSubmitting(true);
    try {
      await deleteReservation(resToDelete.id);
      setItems((prev) => prev.filter((r) => r.id !== resToDelete.id));
      setTotalCount((prev) => Math.max(0, prev - 1));

      showToast(`Reservation for "${resToDelete.name}" deleted`);
      setIsDeleteModalOpen(false);
      if (activeDrawerRes && activeDrawerRes.id === resToDelete.id) {
        setActiveDrawerRes(null);
      }
      setResToDelete(null);
      if (refreshStats) refreshStats();
    } catch (err) {
      showToast(`Failed to delete: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30';
      case 'PENDING':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/30';
      case 'COMPLETED':
        return 'bg-sky-950/60 text-sky-400 border-sky-500/30';
      case 'CANCELLED':
        return 'bg-rose-950/60 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-900 text-gray-400 border-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#e9c176] text-[#050d08] font-bold text-xs px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CRM Control Header */}
      <div className="saas-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-serif text-2xl text-[#e9c176] font-bold">Reservations CRM</h2>
            <p className="text-xs text-[#a0998e]">
              Manage customer table bookings, assign seating, and issue automatic status updates.
            </p>
          </div>
        </div>

        {/* Status Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#e9c176]/10 pb-3">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                statusFilter === st
                  ? 'bg-[#e9c176] text-[#050d08] border-[#e9c176]'
                  : 'bg-[#08170e] text-[#a0998e] border-[#e9c176]/20 hover:text-[#e6e2dd] hover:border-[#e9c176]/40'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="lg:col-span-6 relative">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-sm text-[#a0998e]">
              search
            </span>
            <input
              type="text"
              placeholder="Search guest name, email, phone, or table..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl pl-10 pr-4 py-2 text-xs text-[#e6e2dd] focus:outline-none custom-focus"
            />
          </div>

          {/* Date Picker */}
          <div className="lg:col-span-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl px-3 py-2 text-xs text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl px-3 py-2 text-xs text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="DATE_ASC">Date: Ascending</option>
              <option value="DATE_DESC">Date: Descending</option>
              <option value="GUESTS_DESC">Guests: High to Low</option>
              <option value="GUESTS_ASC">Guests: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* CRM Data Table Card */}
      <div className="saas-card overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <AdminSkeleton type="table" count={6} />
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-[#a0998e] space-y-3">
            <span className="material-symbols-outlined text-4xl text-[#e9c176]/40 block">book_online</span>
            <h3 className="font-serif text-lg text-[#e6e2dd] font-bold">No Reservations Found</h3>
            <p className="text-xs text-[#a0998e]">No bookings match your current search or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#07130b] border-b border-[#e9c176]/10 text-[11px] uppercase tracking-wider text-[#a0998e]">
                  <th className="py-3.5 px-4 font-semibold">Guest</th>
                  <th className="py-3.5 px-4 font-semibold">Table</th>
                  <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Party</th>
                  <th className="py-3.5 px-4 font-semibold">Preference</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9c176]/5 text-xs text-[#e6e2dd]">
                {items.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setActiveDrawerRes(r)}
                    className="hover:bg-[#0e2217] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-medium">
                      <div className="text-[#e6e2dd] font-bold group-hover:text-[#e9c176] transition-colors">
                        {r.name}
                      </div>
                      <div className="text-[10px] text-[#a0998e] font-mono">{r.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-[#08170e] border border-[#e9c176]/20 text-[#e9c176] font-semibold">
                        {r.tableNumber || (r.table ? r.table.tableNumber : 'Auto')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>{r.date || (r.reservationDate ? String(r.reservationDate).split('T')[0] : '—')}</div>
                      <div className="text-[#e9c176] font-mono text-[11px]">{r.time || r.reservationTime}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold">{r.guests} Guests</td>

                    <td className="py-3.5 px-4 text-[#a0998e]">{r.seatingPreference || 'Indoor'}</td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${getStatusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'CONFIRMED', r.name)}
                            disabled={isSubmitting}
                            className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                            title="Confirm Booking"
                          >
                            <span className="material-symbols-outlined text-sm">check</span>
                          </button>
                        )}

                        {r.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'COMPLETED', r.name)}
                            disabled={isSubmitting}
                            className="p-1.5 rounded-lg bg-sky-950/60 text-sky-400 border border-sky-500/30 hover:bg-sky-500 hover:text-white transition-colors cursor-pointer"
                            title="Mark Completed"
                          >
                            <span className="material-symbols-outlined text-sm">task_alt</span>
                          </button>
                        )}

                        {r.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'CANCELLED', r.name)}
                            disabled={isSubmitting}
                            className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                            title="Cancel Booking"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setResToDelete(r);
                            setIsDeleteModalOpen(true);
                          }}
                          disabled={isSubmitting}
                          className="p-1.5 rounded-lg bg-[#08170e] text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 bg-[#07130b] border-t border-[#e9c176]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#a0998e]">
            <div>
              Showing <strong className="text-[#e6e2dd]">{items.length}</strong> of{' '}
              <strong className="text-[#e9c176]">{totalCount}</strong> reservations
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-[#e9c176]/20 text-[#e9c176] disabled:opacity-40 hover:bg-[#e9c176] hover:text-[#050d08] transition-all cursor-pointer font-semibold"
              >
                ← Prev
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-[#08170e] border border-[#e9c176]/20 font-bold text-[#e6e2dd]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-xl border border-[#e9c176]/20 text-[#e9c176] disabled:opacity-40 hover:bg-[#e9c176] hover:text-[#050d08] transition-all cursor-pointer font-semibold"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SLIDE-OVER DETAIL DRAWER */}
      {activeDrawerRes && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop */}
          <div
            onClick={() => setActiveDrawerRes(null)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-backdrop-in"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#09170e] border-l border-[#e9c176]/20 shadow-2xl p-6 md:p-8 flex flex-col justify-between animate-drawer-in overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-[#e9c176]/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#e9c176]">
                      RESERVATION DETAILS
                    </span>
                    <h3 className="font-serif text-2xl text-[#e6e2dd] font-bold mt-1">
                      {activeDrawerRes.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setActiveDrawerRes(null)}
                    className="p-1.5 text-[#a0998e] hover:text-[#e6e2dd] rounded-lg hover:bg-[#0f2417]"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#08170e] border border-[#e9c176]/15">
                  <span className="text-xs text-[#a0998e]">Current Status</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusBadge(activeDrawerRes.status)}`}>
                    {activeDrawerRes.status}
                  </span>
                </div>

                {/* Details Section */}
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#08170e] border border-[#e9c176]/10 space-y-3">
                    <div>
                      <span className="text-[10px] text-[#a0998e] uppercase tracking-wider block">Assigned Table</span>
                      <span className="font-mono text-sm text-[#e9c176] font-bold">
                        {activeDrawerRes.tableNumber || (activeDrawerRes.table ? activeDrawerRes.table.tableNumber : 'Auto-Assigned')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#e9c176]/10">
                      <div>
                        <span className="text-[10px] text-[#a0998e] uppercase tracking-wider block">Date</span>
                        <span className="font-semibold text-[#e6e2dd]">
                          {activeDrawerRes.date || (activeDrawerRes.reservationDate ? String(activeDrawerRes.reservationDate).split('T')[0] : '—')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#a0998e] uppercase tracking-wider block">Time Slot</span>
                        <span className="font-mono text-[#e9c176] font-bold">
                          {activeDrawerRes.time || activeDrawerRes.reservationTime}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#e9c176]/10">
                      <div>
                        <span className="text-[10px] text-[#a0998e] uppercase tracking-wider block">Party Size</span>
                        <span className="font-bold text-[#e6e2dd]">{activeDrawerRes.guests} Guests</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#a0998e] uppercase tracking-wider block">Seating</span>
                        <span className="font-semibold text-[#e6e2dd]">{activeDrawerRes.seatingPreference || 'Indoor'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Contact */}
                  <div className="p-4 rounded-xl bg-[#08170e] border border-[#e9c176]/10 space-y-2">
                    <span className="text-[10px] text-[#a0998e] uppercase tracking-wider font-semibold block">Contact Info</span>
                    <div className="flex justify-between items-center text-[#e6e2dd]">
                      <span className="text-[#a0998e]">Phone:</span>
                      <span className="font-mono">{activeDrawerRes.phone}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#e6e2dd]">
                      <span className="text-[#a0998e]">Email:</span>
                      <span className="truncate max-w-[200px]">{activeDrawerRes.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#e9c176]/10 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(activeDrawerRes.id, 'CONFIRMED', activeDrawerRes.name)}
                    className="py-2.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 rounded-xl font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeDrawerRes.id, 'COMPLETED', activeDrawerRes.name)}
                    className="py-2.5 bg-sky-950/80 text-sky-400 border border-sky-500/40 rounded-xl font-bold text-xs hover:bg-sky-500 hover:text-white transition-all cursor-pointer"
                  >
                    Complete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenEdit(activeDrawerRes)}
                    className="py-2.5 bg-[#08170e] border border-[#e9c176]/30 text-[#e9c176] rounded-xl font-semibold text-xs hover:bg-[#e9c176] hover:text-[#050d08] transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit Details</span>
                  </button>

                  <button
                    onClick={() => {
                      setResToDelete(activeDrawerRes);
                      setIsDeleteModalOpen(true);
                    }}
                    className="py-2.5 bg-rose-950/80 text-rose-400 border border-rose-500/30 rounded-xl font-semibold text-xs hover:bg-rose-500 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09170e] border border-[#e9c176]/30 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-scale">
            <div className="flex justify-between items-center border-b border-[#e9c176]/10 pb-4">
              <h3 className="font-serif text-lg text-[#e9c176] font-bold">Edit Reservation</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#a0998e] hover:text-[#e6e2dd]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a0998e] mb-1 font-semibold">Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>
                <div>
                  <label className="block text-[#a0998e] mb-1 font-semibold">Phone</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#a0998e] mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>
                <div>
                  <label className="block text-[#a0998e] mb-1 font-semibold">Time</label>
                  <input
                    type="text"
                    required
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2 text-[#e6e2dd] focus:outline-none custom-focus font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#a0998e] mb-1 font-semibold">Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={editForm.guests}
                    onChange={(e) => setEditForm({ ...editForm, guests: Number(e.target.value) })}
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e9c176]/10">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a0998e] hover:text-[#e6e2dd]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#e9c176] text-[#050d08] font-bold text-xs uppercase tracking-wider hover:bg-[#ffdea5] transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && resToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09170e] border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-scale">
            <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#e6e2dd] font-bold mb-1">Delete Reservation?</h3>
              <p className="text-xs text-[#a0998e]">
                Are you sure you want to delete reservation for <strong className="text-[#e9c176]">{resToDelete.name}</strong>?
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-[#08170e] border border-[#e9c176]/20 text-[#e6e2dd] rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-500 text-white font-bold rounded-xl text-xs hover:bg-rose-600 transition-colors shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
