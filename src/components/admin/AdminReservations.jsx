import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchReservations,
  updateReservation,
  updateReservationStatus,
  deleteReservation,
} from '../../services/api/reservations.service';

export default function AdminReservations({ reservations: parentReservations, setReservations: setParentReservations, refreshStats }) {
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

  // Modals & Feedback
  const [selectedRes, setSelectedRes] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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

  // Fetch reservations from backend with search, filter, sort & pagination
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

  // Reset to page 1 when filters change
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (val) => {
    setDateFilter(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  // 1-Click Status Change
  const handleStatusChange = async (resId, newStatus, resName) => {
    setIsSubmitting(true);
    try {
      await updateReservationStatus(resId, newStatus);

      // Instant UI update
      setItems((prev) =>
        prev.map((r) => (r.id === resId ? { ...r, status: newStatus } : r))
      );

      if (selectedRes && selectedRes.id === resId) {
        setSelectedRes((prev) => ({ ...prev, status: newStatus }));
      }

      showToast(`Reservation for ${resName || 'guest'} marked as ${newStatus}`);

      // Refresh dashboard stats if callback provided
      if (refreshStats) refreshStats();
    } catch (err) {
      showToast(`Failed to update status: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (res) => {
    setSelectedRes(res);
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

  // Submit Edit Form
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedRes) return;

    setIsSubmitting(true);
    try {
      const updated = await updateReservation(selectedRes.id, editForm);

      // Instant UI update
      setItems((prev) =>
        prev.map((r) =>
          r.id === selectedRes.id
            ? {
                ...r,
                ...updated,
                date: editForm.date,
                time: editForm.time,
              }
            : r
        )
      );

      showToast(`Reservation #${selectedRes.id.slice(0, 8)} updated successfully`);
      setIsEditModalOpen(false);

      if (refreshStats) refreshStats();
    } catch (err) {
      showToast(`Failed to save edit: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (res) => {
    setResToDelete(res);
    setIsDeleteModalOpen(true);
  };

  // Confirm Permanent Deletion
  const handleConfirmDelete = async () => {
    if (!resToDelete) return;

    setIsSubmitting(true);
    try {
      await deleteReservation(resToDelete.id);

      // Instant UI update without reload
      setItems((prev) => prev.filter((r) => r.id !== resToDelete.id));
      setTotalCount((prev) => Math.max(0, prev - 1));

      showToast(`Reservation for "${resToDelete.name}" deleted from database`);
      setIsDeleteModalOpen(false);
      setResToDelete(null);

      if (selectedRes && selectedRes.id === resToDelete.id) {
        setIsViewModalOpen(false);
        setIsEditModalOpen(false);
      }

      if (refreshStats) refreshStats();
    } catch (err) {
      showToast(`Failed to delete: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Control Header & Toolbar */}
      <div className="bg-[#0d1c13] gold-border rounded-2xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-sm text-[#a0998e]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by customer name, email, phone..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#e6e2dd] focus:outline-none custom-focus"
            />
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#a0998e] font-medium uppercase tracking-wider hidden sm:inline">
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="bg-[#07140c] border border-[#e9c176]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#e6e2dd] focus:outline-none cursor-pointer custom-focus"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending (Yellow)</option>
                <option value="CONFIRMED">Confirmed (Green)</option>
                <option value="COMPLETED">Completed (Blue)</option>
                <option value="CANCELLED">Cancelled (Red)</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#a0998e] font-medium uppercase tracking-wider hidden sm:inline">
                Date:
              </span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => handleDateFilterChange(e.target.value)}
                className="bg-[#07140c] border border-[#e9c176]/30 rounded-xl px-3 py-2 text-xs text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
              />
              {dateFilter && (
                <button
                  onClick={() => handleDateFilterChange('')}
                  className="text-xs text-[#e9c176] hover:underline"
                  title="Clear Date Filter"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#a0998e] font-medium uppercase tracking-wider hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-[#07140c] border border-[#e9c176]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#e6e2dd] focus:outline-none cursor-pointer custom-focus"
              >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
                <option value="DATE_ASC">Date: Ascending</option>
                <option value="DATE_DESC">Date: Descending</option>
                <option value="GUESTS_DESC">Guests: High to Low</option>
                <option value="GUESTS_ASC">Guests: Low to High</option>
                <option value="NAME_AZ">Name: A - Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error State Notice */}
      {errorState && (
        <div className="bg-red-950/50 border border-red-500/40 rounded-2xl p-5 text-xs text-red-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl text-red-400">error</span>
            <span>{errorState}</span>
          </div>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-red-900/60 border border-red-500/40 rounded-xl hover:bg-red-800 text-white transition-all cursor-pointer font-bold uppercase tracking-wider"
          >
            Retry
          </button>
        </div>
      )}

      {/* Reservation Table Card */}
      <div className="bg-[#0d1c13] gold-border rounded-2xl overflow-hidden shadow-xl">
        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#e9c176]">
            <div className="w-10 h-10 rounded-full border-2 border-[#e9c176]/20 border-t-[#e9c176] animate-spin" />
            <span className="text-xs uppercase tracking-wider">Fetching PostgreSQL Reservations...</span>
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center text-[#a0998e] space-y-3">
            <span className="material-symbols-outlined text-5xl text-[#e9c176]/30 block">
              table_restaurant
            </span>
            <h3 className="font-serif text-lg text-[#e6e2dd] font-bold">No Reservations Found</h3>
            <p className="text-xs max-w-sm mx-auto text-[#a0998e]">
              There are no table reservations matching your current search or filter parameters in the database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#09160e] border-b border-[#e9c176]/15 text-[11px] uppercase tracking-wider text-[#e9c176]">
                  <th className="py-4 px-4 font-semibold">Customer Name</th>
                  <th className="py-4 px-4 font-semibold">Table</th>
                  <th className="py-4 px-4 font-semibold">Email</th>
                  <th className="py-4 px-4 font-semibold">Phone</th>
                  <th className="py-4 px-4 font-semibold">Date</th>
                  <th className="py-4 px-4 font-semibold">Time</th>
                  <th className="py-4 px-4 font-semibold text-center">Guests</th>
                  <th className="py-4 px-4 font-semibold">Occasion</th>
                  <th className="py-4 px-4 font-semibold">Seating</th>
                  <th className="py-4 px-4 font-semibold">Status</th>
                  <th className="py-4 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9c176]/10 text-xs text-[#c8c2b7]">
                {items.map((r) => (
                  <tr key={r.id} className="hover:bg-[#122419] transition-colors">
                    {/* Customer Name */}
                    <td className="py-4 px-4 font-bold text-[#e6e2dd] whitespace-nowrap">
                      {r.name}
                    </td>

                    {/* Table Assignment */}
                    <td className="py-4 px-4 font-semibold text-[#e9c176] whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-lg bg-[#07140c] border border-[#e9c176]/30 font-mono">
                        {r.tableNumber || (r.table ? r.table.tableNumber : 'Auto-Assigned')}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 text-[#a0998e] max-w-[150px] truncate">
                      {r.email}
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-4 font-mono text-[#e6e2dd] whitespace-nowrap">
                      {r.phone}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap font-medium text-[#e6e2dd]">
                      {r.date || (r.reservationDate ? String(r.reservationDate).split('T')[0] : '—')}
                    </td>

                    {/* Time */}
                    <td className="py-4 px-4 whitespace-nowrap text-[#e9c176] font-bold">
                      {r.time || r.reservationTime || '—'}
                    </td>

                    {/* Guests */}
                    <td className="py-4 px-4 text-center font-bold text-[#e6e2dd]">
                      {r.guests}
                    </td>

                    {/* Occasion */}
                    <td className="py-4 px-4 text-[#a0998e]">
                      {r.occasion || 'Standard'}
                    </td>

                    {/* Seating Preference */}
                    <td className="py-4 px-4 text-[#a0998e]">
                      {r.seatingPreference || 'Indoor'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {r.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          PENDING
                        </span>
                      )}
                      {r.status === 'CONFIRMED' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          CONFIRMED
                        </span>
                      )}
                      {r.status === 'CANCELLED' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          CANCELLED
                        </span>
                      )}
                      {r.status === 'COMPLETED' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          COMPLETED
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View */}
                        <button
                          onClick={() => {
                            setSelectedRes(r);
                            setIsViewModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#122419] border border-[#e9c176]/30 text-[#e9c176] hover:bg-[#e9c176] hover:text-[#0f1f15] transition-all cursor-pointer"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 rounded-lg bg-[#122419] border border-[#e9c176]/30 text-[#e9c176] hover:bg-[#e9c176] hover:text-[#0f1f15] transition-all cursor-pointer"
                          title="Edit Reservation"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>

                        {/* Confirm */}
                        {r.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'CONFIRMED', r.name)}
                            disabled={isSubmitting}
                            className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                            title="Confirm (Sends Email)"
                          >
                            <span className="material-symbols-outlined text-sm">check</span>
                          </button>
                        )}

                        {/* Complete */}
                        {r.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'COMPLETED', r.name)}
                            disabled={isSubmitting}
                            className="p-1.5 rounded-lg bg-sky-950/60 border border-sky-500/40 text-sky-400 hover:bg-sky-500 hover:text-white transition-all cursor-pointer"
                            title="Mark Completed (Sends Thank You Email)"
                          >
                            <span className="material-symbols-outlined text-sm">task_alt</span>
                          </button>
                        )}

                        {/* Cancel */}
                        {r.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'CANCELLED', r.name)}
                            disabled={isSubmitting}
                            className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-white transition-all cursor-pointer"
                            title="Cancel (Sends Cancellation Email)"
                          >
                            <span className="material-symbols-outlined text-sm">block</span>
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleOpenDelete(r)}
                          disabled={isSubmitting}
                          className="p-1.5 rounded-lg bg-[#122419] border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                          title="Delete Reservation"
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
          <div className="p-4 bg-[#09160e] border-t border-[#e9c176]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#a0998e]">
            <div>
              Showing <strong className="text-[#e6e2dd]">{items.length}</strong> of{' '}
              <strong className="text-[#e9c176]">{totalCount}</strong> total reservations
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-[#e9c176]/30 text-[#e9c176] disabled:opacity-40 hover:bg-[#e9c176] hover:text-[#0f1f15] transition-all cursor-pointer font-semibold"
              >
                ← Prev
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-[#07140c] border border-[#e9c176]/20 font-bold text-[#e6e2dd]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-xl border border-[#e9c176]/30 text-[#e9c176] disabled:opacity-40 hover:bg-[#e9c176] hover:text-[#0f1f15] transition-all cursor-pointer font-semibold"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 1. View Details Modal */}
      {isViewModalOpen && selectedRes && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1c13] gold-border rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-scale">
            <div className="flex items-center justify-between border-b border-[#e9c176]/15 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#e9c176] font-bold">
                  RESERVATION #{selectedRes.id.slice(0, 8)}
                </span>
                <h3 className="font-serif text-xl text-[#e6e2dd] font-bold mt-1">
                  {selectedRes.name}
                </h3>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="text-[#a0998e] hover:text-[#e9c176]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-[#07140c] rounded-xl p-5 border border-[#e9c176]/15 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#a0998e] uppercase text-[10px] tracking-wider block">Phone</span>
                  <span className="font-mono text-[#e6e2dd] font-semibold">{selectedRes.phone}</span>
                </div>
                <div>
                  <span className="text-[#a0998e] uppercase text-[10px] tracking-wider block">Email</span>
                  <span className="text-[#e6e2dd] truncate block">{selectedRes.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#e9c176]/10">
                <div>
                  <span className="text-[#a0998e] uppercase text-[10px] tracking-wider block">Date & Time</span>
                  <span className="text-[#e9c176] font-bold">
                    {selectedRes.date || (selectedRes.reservationDate ? String(selectedRes.reservationDate).split('T')[0] : '—')} @ {selectedRes.time || selectedRes.reservationTime}
                  </span>
                </div>
                <div>
                  <span className="text-[#a0998e] uppercase text-[10px] tracking-wider block">Guests</span>
                  <span className="text-[#e6e2dd] font-bold">{selectedRes.guests} Guests</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#e9c176]/10">
                <div>
                  <span className="text-[#a0998e] uppercase text-[10px] tracking-wider block">Occasion</span>
                  <span className="text-[#e6e2dd] font-medium">{selectedRes.occasion || 'Standard Dining'}</span>
                </div>
                <div>
                  <span className="text-[#a0998e] uppercase text-[10px] tracking-wider block">Seating</span>
                  <span className="text-[#e6e2dd] font-medium">{selectedRes.seatingPreference || 'Indoor'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(selectedRes);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#e9c176] text-[#0f1f15] font-bold text-xs uppercase tracking-wider hover:bg-[#ffdea5] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                <span>Edit Booking</span>
              </button>

              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#e9c176]/30 text-xs text-[#a0998e] hover:text-[#e6e2dd]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Full Edit Reservation Modal */}
      {isEditModalOpen && selectedRes && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1c13] gold-border rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-scale">
            <div className="flex items-center justify-between border-b border-[#e9c176]/15 pb-4">
              <h3 className="font-serif text-xl text-[#e9c176] font-bold">
                Edit Reservation — #{selectedRes.id.slice(0, 8)}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#a0998e] hover:text-[#e9c176]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    required
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Time</label>
                  <input
                    type="text"
                    required
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    placeholder="19:30"
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={editForm.guests}
                    onChange={(e) => setEditForm({ ...editForm, guests: e.target.value })}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Occasion</label>
                  <select
                    value={editForm.occasion}
                    onChange={(e) => setEditForm({ ...editForm, occasion: e.target.value })}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
                  >
                    <option value="Standard Dining">Standard Dining</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Business Dinner">Business Dinner</option>
                    <option value="Romantic Dinner">Romantic Dinner</option>
                    <option value="Family Gathering">Family Gathering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Seating Preference</label>
                  <select
                    value={editForm.seatingPreference}
                    onChange={(e) => setEditForm({ ...editForm, seatingPreference: e.target.value })}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
                  >
                    <option value="Indoor">Indoor Main Dining</option>
                    <option value="Window Table">Window Table</option>
                    <option value="Outdoor Terrace">Outdoor Terrace</option>
                    <option value="Private Dining">Private Dining Lounge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Reservation Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer font-bold"
                >
                  <option value="PENDING">PENDING (Yellow)</option>
                  <option value="CONFIRMED">CONFIRMED (Green - Triggers Confirmation Email)</option>
                  <option value="COMPLETED">COMPLETED (Blue - Triggers Thank You Email)</option>
                  <option value="CANCELLED">CANCELLED (Red - Triggers Cancellation Email)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e9c176]/15">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#e9c176]/30 text-[#a0998e] hover:text-[#e6e2dd]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#e9c176] text-[#0f1f15] font-bold text-xs uppercase tracking-wider hover:bg-[#ffdea5] transition-all cursor-pointer shadow-lg flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-[#0f1f15]/20 border-t-[#0f1f15] animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">save</span>
                      <span>Save Reservation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Modal */}
      {isDeleteModalOpen && resToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1c13] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-scale">
            <div className="flex items-center gap-3 border-b border-rose-500/20 pb-4">
              <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-rose-400 font-bold">Confirm Deletion</h3>
                <p className="text-xs text-[#a0998e]">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-[#07140c] rounded-xl p-4 border border-rose-500/10 text-xs text-[#c8c2b7] space-y-1">
              <p>
                Delete reservation for <strong className="text-[#e6e2dd]">{resToDelete.name}</strong>?
              </p>
              <p className="text-[11px] text-[#a0998e]">
                Scheduled for {resToDelete.date} at {resToDelete.time} ({resToDelete.guests} guests).
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setResToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-[#e9c176]/30 text-xs text-[#a0998e] hover:text-[#e6e2dd]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-rose-500 transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">delete_forever</span>
                    <span>Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
