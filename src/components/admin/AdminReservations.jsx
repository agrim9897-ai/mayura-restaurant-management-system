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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 select-none max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#C5A059] text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editorial Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E8E4DE]/60 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Reservations
          </h1>
          <p className="text-xs text-[#666666] font-medium mt-1">
            Enterprise booking management, seating allocations, and guest statuses.
          </p>
        </div>
      </div>

      {/* Clean Toolbar: Search & Filter Panel (HubSpot / Stripe Style) */}
      <div className="saas-card p-5 space-y-4 sticky top-16 z-20 shadow-2xs">
        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E8E4DE] pb-3">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                statusFilter === st
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-2xs'
                  : 'bg-[#FAF8F4] text-[#666666] border-[#E8E4DE] hover:text-[#1A1A1A] hover:bg-[#EFE9DF]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search, Date & Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-6 relative">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-sm text-[#666666]">
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
              className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-[#666666]/60 focus:outline-none custom-focus"
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
              className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none custom-focus cursor-pointer font-medium"
            />
          </div>

          {/* Sort Select */}
          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none custom-focus cursor-pointer font-medium"
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

      {/* Large Professional Table Container */}
      <div className="saas-card overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <AdminSkeleton type="table" count={6} />
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-[#666666] space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#666666]/30 block">calendar_today</span>
            <h3 className="font-serif text-lg text-[#1A1A1A] font-bold">No Reservations Found</h3>
            <p className="text-xs text-[#666666]">No bookings match your current search or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F4] border-b border-[#E8E4DE] text-[11px] uppercase tracking-wider text-[#666666]">
                  <th className="py-4 px-4 font-semibold">Guest</th>
                  <th className="py-4 px-4 font-semibold">Table</th>
                  <th className="py-4 px-4 font-semibold">Date & Time</th>
                  <th className="py-4 px-4 font-semibold text-center">Party Size</th>
                  <th className="py-4 px-4 font-semibold">Preference</th>
                  <th className="py-4 px-4 font-semibold">Status</th>
                  <th className="py-4 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DE]/60 text-xs text-[#1A1A1A]">
                {items.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setActiveDrawerRes(r)}
                    className="hover:bg-[#FAF8F4] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                        {r.name}
                      </div>
                      <div className="text-[11px] text-[#666666] font-mono">{r.phone}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-mono text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-[#FAF8F4] border border-[#E8E4DE] text-[#1A1A1A] font-semibold">
                        {r.tableNumber || (r.table ? r.table.tableNumber : 'Auto')}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-medium">{r.date || (r.reservationDate ? String(r.reservationDate).split('T')[0] : '—')}</div>
                      <div className="text-[#C5A059] font-mono text-[11px] font-semibold">{r.time || r.reservationTime}</div>
                    </td>

                    <td className="py-4 px-4 text-center font-semibold">{r.guests} Guests</td>

                    <td className="py-4 px-4 text-[#666666]">{r.seatingPreference || 'Indoor'}</td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${getStatusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {r.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'CONFIRMED', r.name)}
                            disabled={isSubmitting}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Confirm Booking"
                          >
                            <span className="material-symbols-outlined text-base">check</span>
                          </button>
                        )}

                        {r.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'COMPLETED', r.name)}
                            disabled={isSubmitting}
                            className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Mark Completed"
                          >
                            <span className="material-symbols-outlined text-base">task_alt</span>
                          </button>
                        )}

                        {r.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'CANCELLED', r.name)}
                            disabled={isSubmitting}
                            className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Cancel Booking"
                          >
                            <span className="material-symbols-outlined text-base">close</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setResToDelete(r);
                            setIsDeleteModalOpen(true);
                          }}
                          disabled={isSubmitting}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
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
          <div className="p-4 bg-[#FAF8F4] border-t border-[#E8E4DE] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666666]">
            <div>
              Showing <strong className="text-[#1A1A1A]">{items.length}</strong> of{' '}
              <strong className="text-[#1A1A1A]">{totalCount}</strong> reservations
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3.5 py-1.5 rounded-lg border border-[#E8E4DE] bg-white text-[#1A1A1A] disabled:opacity-40 hover:bg-[#FAF8F4] transition-all cursor-pointer font-semibold"
              >
                ← Prev
              </button>

              <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E4DE] font-bold text-[#1A1A1A]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3.5 py-1.5 rounded-lg border border-[#E8E4DE] bg-white text-[#1A1A1A] disabled:opacity-40 hover:bg-[#FAF8F4] transition-all cursor-pointer font-semibold"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BEAUTIFUL SIDE-OVER DRAWER (Warm White Editorial Style) */}
      {activeDrawerRes && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop */}
          <div
            onClick={() => setActiveDrawerRes(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-backdrop-in"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-[#E8E4DE] shadow-2xl p-6 md:p-8 flex flex-col justify-between animate-drawer-in overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-[#E8E4DE] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                      RESERVATION DETAILS
                    </span>
                    <h3 className="font-serif text-2xl text-[#1A1A1A] font-bold mt-1">
                      {activeDrawerRes.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setActiveDrawerRes(null)}
                    className="p-1.5 text-[#666666] hover:text-[#1A1A1A] rounded-lg hover:bg-[#FAF8F4]"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>

                {/* Status Badge Indicator */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE]">
                  <span className="text-xs text-[#666666] font-medium">Current Status</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusBadge(activeDrawerRes.status)}`}>
                    {activeDrawerRes.status}
                  </span>
                </div>

                {/* Details Section */}
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] space-y-3">
                    <div>
                      <span className="text-[10px] text-[#666666] uppercase tracking-wider font-semibold block">Assigned Table</span>
                      <span className="font-mono text-sm text-[#C5A059] font-bold">
                        {activeDrawerRes.tableNumber || (activeDrawerRes.table ? activeDrawerRes.table.tableNumber : 'Auto-Assigned')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E8E4DE]">
                      <div>
                        <span className="text-[10px] text-[#666666] uppercase tracking-wider font-semibold block">Date</span>
                        <span className="font-semibold text-[#1A1A1A]">
                          {activeDrawerRes.date || (activeDrawerRes.reservationDate ? String(activeDrawerRes.reservationDate).split('T')[0] : '—')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#666666] uppercase tracking-wider font-semibold block">Time Slot</span>
                        <span className="font-mono text-[#C5A059] font-bold">
                          {activeDrawerRes.time || activeDrawerRes.reservationTime}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E8E4DE]">
                      <div>
                        <span className="text-[10px] text-[#666666] uppercase tracking-wider font-semibold block">Party Size</span>
                        <span className="font-bold text-[#1A1A1A]">{activeDrawerRes.guests} Guests</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#666666] uppercase tracking-wider font-semibold block">Seating</span>
                        <span className="font-semibold text-[#1A1A1A]">{activeDrawerRes.seatingPreference || 'Indoor'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Contact */}
                  <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] space-y-2">
                    <span className="text-[10px] text-[#666666] uppercase tracking-wider font-semibold block">Contact Info</span>
                    <div className="flex justify-between items-center text-[#1A1A1A]">
                      <span className="text-[#666666]">Phone:</span>
                      <span className="font-mono">{activeDrawerRes.phone}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#1A1A1A]">
                      <span className="text-[#666666]">Email:</span>
                      <span className="truncate max-w-[200px] font-medium">{activeDrawerRes.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-6 border-t border-[#E8E4DE] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(activeDrawerRes.id, 'CONFIRMED', activeDrawerRes.name)}
                    className="py-2.5 bg-emerald-700 text-white rounded-xl font-semibold text-xs hover:bg-emerald-800 transition-all cursor-pointer shadow-2xs"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeDrawerRes.id, 'COMPLETED', activeDrawerRes.name)}
                    className="py-2.5 bg-blue-700 text-white rounded-xl font-semibold text-xs hover:bg-blue-800 transition-all cursor-pointer shadow-2xs"
                  >
                    Complete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenEdit(activeDrawerRes)}
                    className="py-2.5 bg-white border border-[#E8E4DE] text-[#1A1A1A] rounded-xl font-semibold text-xs hover:bg-[#FAF8F4] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm text-[#666666]">edit</span>
                    <span>Edit Details</span>
                  </button>

                  <button
                    onClick={() => {
                      setResToDelete(activeDrawerRes);
                      setIsDeleteModalOpen(true);
                    }}
                    className="py-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold text-xs hover:bg-rose-100 transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E4DE] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-scale">
            <div className="flex justify-between items-center border-b border-[#E8E4DE] pb-4">
              <h3 className="font-serif text-xl text-[#1A1A1A] font-bold">Edit Reservation</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#666666] hover:text-[#1A1A1A]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#666666] mb-1 font-semibold">Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                  />
                </div>
                <div>
                  <label className="block text-[#666666] mb-1 font-semibold">Phone</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#666666] mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#666666] mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2 text-[#1A1A1A] focus:outline-none custom-focus"
                  />
                </div>
                <div>
                  <label className="block text-[#666666] mb-1 font-semibold">Time</label>
                  <input
                    type="text"
                    required
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2 text-[#1A1A1A] focus:outline-none custom-focus font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#666666] mb-1 font-semibold">Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={editForm.guests}
                    onChange={(e) => setEditForm({ ...editForm, guests: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2 text-[#1A1A1A] focus:outline-none custom-focus"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E4DE]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#666666] hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#B59049] transition-all cursor-pointer shadow-2xs"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E4DE] rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-scale">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#1A1A1A] font-bold mb-1">Delete Reservation?</h3>
              <p className="text-xs text-[#666666]">
                Are you sure you want to delete reservation for <strong className="text-[#1A1A1A]">{resToDelete.name}</strong>?
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-[#FAF8F4] border border-[#E8E4DE] text-[#1A1A1A] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 transition-colors shadow-2xs"
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
