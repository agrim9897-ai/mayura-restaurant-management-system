import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchTables,
  createTable,
  updateTable,
  deleteTable,
} from '../../services/api/table.service';

export default function AdminTables() {
  const [tables, setTables] = useState([]);
  const [stats, setStats] = useState({
    totalTables: 0,
    availableCount: 0,
    reservedCount: 0,
    occupiedCount: 0,
    maintenanceCount: 0,
    occupancyRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Toast & Modals
  const [toastMessage, setToastMessage] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteTargetTable, setDeleteTargetTable] = useState(null);

  // Form states
  const [tableForm, setTableForm] = useState({
    tableNumber: '',
    capacity: 4,
    location: 'INDOOR',
    status: 'AVAILABLE',
  });
  const [editingTable, setEditingTable] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadTableData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchTables({
        search: searchQuery,
        location: selectedLocation,
        status: selectedStatus,
      });
      setTables(res.tables || []);
      if (res.stats) setStats(res.stats);
    } catch (err) {
      console.error('Failed to load tables:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedLocation, selectedStatus]);

  useEffect(() => {
    loadTableData();
  }, [loadTableData]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createTable(tableForm);
      showToast(`Table '${tableForm.tableNumber}' added successfully!`);
      setIsAddModalOpen(false);
      setTableForm({ tableNumber: '', capacity: 4, location: 'INDOOR', status: 'AVAILABLE' });
      await loadTableData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTable) return;
    setIsSaving(true);
    try {
      await updateTable(editingTable.id, tableForm);
      showToast(`Table '${tableForm.tableNumber}' updated successfully!`);
      setIsEditModalOpen(false);
      setEditingTable(null);
      await loadTableData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickStatusChange = async (tableId, newStatus) => {
    try {
      await updateTable(tableId, { status: newStatus });
      showToast(`Status updated to ${newStatus}`);
      await loadTableData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetTable) return;
    try {
      await deleteTable(deleteTargetTable.id);
      showToast(`Table '${deleteTargetTable.tableNumber}' deleted!`);
      setDeleteTargetTable(null);
      await loadTableData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  const openEditModal = (table) => {
    setEditingTable(table);
    setTableForm({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      location: table.location,
      status: table.status,
    });
    setIsEditModalOpen(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30';
      case 'RESERVED':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/30';
      case 'OCCUPIED':
        return 'bg-blue-950/60 text-blue-400 border-blue-500/30';
      case 'MAINTENANCE':
        return 'bg-rose-950/60 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
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

      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#e9c176] font-bold">Table & Availability Management</h2>
          <p className="text-xs text-[#a0998e]">
            Real-time table occupancy, 2-hour reservation window tracking, and seating management.
          </p>
        </div>

        <button
          onClick={() => {
            setTableForm({ tableNumber: `T${String(tables.length + 1).padStart(2, '0')}`, capacity: 4, location: 'INDOOR', status: 'AVAILABLE' });
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#e9c176] text-[#0f1f15] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] shadow-lg transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Add New Table</span>
        </button>
      </div>

      {/* Occupancy Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#0d1c13] gold-border rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] text-[#a0998e] uppercase tracking-wider font-semibold">Total Tables</span>
          <span className="font-serif text-2xl text-[#e6e2dd] font-bold mt-2">{stats.totalTables || 0}</span>
        </div>

        <div className="bg-[#0d1c13] border border-emerald-500/20 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold">Available</span>
          <span className="font-serif text-2xl text-emerald-400 font-bold mt-2">{stats.availableCount || 0}</span>
        </div>

        <div className="bg-[#0d1c13] border border-amber-500/20 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] text-amber-400 uppercase tracking-wider font-semibold">Reserved</span>
          <span className="font-serif text-2xl text-amber-400 font-bold mt-2">{stats.reservedCount || 0}</span>
        </div>

        <div className="bg-[#0d1c13] border border-blue-500/20 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] text-blue-400 uppercase tracking-wider font-semibold">Occupied</span>
          <span className="font-serif text-2xl text-blue-400 font-bold mt-2">{stats.occupiedCount || 0}</span>
        </div>

        <div className="bg-[#0d1c13] border border-rose-500/20 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] text-rose-400 uppercase tracking-wider font-semibold">Maintenance</span>
          <span className="font-serif text-2xl text-rose-400 font-bold mt-2">{stats.maintenanceCount || 0}</span>
        </div>

        <div className="bg-[#0d1c13] gold-border rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] text-[#e9c176] uppercase tracking-wider font-semibold">Occupancy Rate</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-serif text-2xl text-[#e9c176] font-bold">{stats.occupancyRate || 0}%</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0d1c13] gold-border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#a0998e] text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search table number (e.g. T01)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl pl-10 pr-4 py-2 text-xs text-[#e6e2dd] placeholder-[#a0998e]/60 focus:outline-none custom-focus"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-[#07140c] border border-[#e9c176]/30 rounded-xl px-3 py-2 text-xs text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
          >
            <option value="ALL">All Locations</option>
            <option value="INDOOR">Indoor</option>
            <option value="OUTDOOR">Outdoor</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#07140c] border border-[#e9c176]/30 rounded-xl px-3 py-2 text-xs text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Tables Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-[#e9c176] flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#e9c176]/20 border-t-[#e9c176] animate-spin" />
          <span className="text-xs uppercase tracking-widest">Loading Dining Tables...</span>
        </div>
      ) : tables.length === 0 ? (
        <div className="text-center py-16 bg-[#0d1c13] gold-border rounded-2xl p-8">
          <span className="material-symbols-outlined text-4xl text-[#e9c176] mb-3">table_restaurant</span>
          <h3 className="font-serif text-lg text-[#e6e2dd] mb-1">No Tables Found</h3>
          <p className="text-xs text-[#a0998e]">Try clearing search or filter selections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className="bg-[#0d1c13] gold-border rounded-2xl p-5 space-y-4 hover:border-[#e9c176]/50 transition-all shadow-md group relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#e9c176]/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#07140c] border border-[#e9c176]/30 flex items-center justify-center font-serif text-lg text-[#e9c176] font-bold">
                      {table.tableNumber}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#e6e2dd]">{table.capacity} Seats</div>
                      <div className="text-[10px] text-[#a0998e] uppercase tracking-wider">{table.location}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeClass(
                      table.status
                    )}`}
                  >
                    {table.status}
                  </span>
                </div>

                {/* Current / Active Reservation Details */}
                <div className="space-y-2 text-xs">
                  {/* Current Reservation */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#a0998e] font-semibold block">
                      Current Reservation:
                    </span>
                    {table.currentReservation ? (
                      <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-2.5 mt-1 text-[11px]">
                        <div className="font-bold text-[#e6e2dd]">{table.currentReservation.name}</div>
                        <div className="text-blue-300 flex justify-between items-center mt-0.5">
                          <span>{table.currentReservation.guests} Guests</span>
                          <span className="font-mono text-[10px]">{table.currentReservation.timeSlot || table.currentReservation.reservationTime}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#a0998e]/60 italic text-[11px] block mt-0.5">None (Currently Free)</span>
                    )}
                  </div>

                  {/* Reserved Time Slot (2-Hour Block) */}
                  {table.reservedTimeSlot && (
                    <div className="pt-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#e9c176] font-semibold block">
                        Blocked Time Window:
                      </span>
                      <span className="font-mono text-[11px] text-[#e9c176] bg-[#07140c] border border-[#e9c176]/20 px-2 py-0.5 rounded-lg inline-block mt-0.5">
                        {table.reservedTimeSlot}
                      </span>
                    </div>
                  )}

                  {/* Next Reservation */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#a0998e] font-semibold block pt-1">
                      Next Reservation:
                    </span>
                    {table.nextReservation ? (
                      <div className="bg-[#07140c] border border-[#e9c176]/20 rounded-xl p-2.5 mt-1 text-[11px]">
                        <div className="font-semibold text-[#e6e2dd]">{table.nextReservation.name}</div>
                        <div className="text-[#a0998e] flex justify-between items-center mt-0.5">
                          <span>{table.nextReservation.guests} Guests</span>
                          <span className="font-mono text-[#e9c176]">{table.nextReservation.reservationTime}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#a0998e]/60 italic text-[11px] block mt-0.5">No upcoming bookings today</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#e9c176]/10 flex items-center justify-between gap-2">
                {/* Status Dropdown */}
                <select
                  value={table.status}
                  onChange={(e) => handleQuickStatusChange(table.id, e.target.value)}
                  className="bg-[#07140c] border border-[#e9c176]/30 rounded-xl px-2.5 py-1.5 text-[11px] text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(table)}
                    className="p-1.5 text-[#a0998e] hover:text-[#e9c176] hover:bg-[#12281a] rounded-lg transition-colors cursor-pointer"
                    title="Edit Table"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteTargetTable(table)}
                    className="p-1.5 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete Table"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: Add Table Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1c13] gold-border rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-scale">
            <div className="flex justify-between items-center border-b border-[#e9c176]/15 pb-4">
              <h3 className="font-serif text-lg text-[#e9c176] font-bold">Add New Dining Table</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#a0998e] hover:text-[#e9c176]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Table Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. T13"
                  value={tableForm.tableNumber}
                  onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Seating Capacity (Guests) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={tableForm.capacity}
                  onChange={(e) => setTableForm({ ...tableForm, capacity: Number(e.target.value) })}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Location *</label>
                <select
                  value={tableForm.location}
                  onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
                >
                  <option value="INDOOR">Indoor Main Hall</option>
                  <option value="OUTDOOR">Outdoor Garden / Terrace</option>
                </select>
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Initial Status</label>
                <select
                  value={tableForm.status}
                  onChange={(e) => setTableForm({ ...tableForm, status: e.target.value })}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#e9c176]/15 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a0998e] hover:text-[#e6e2dd]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#e9c176] text-[#0f1f15] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] shadow-lg transition-all cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Add Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Table Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1c13] gold-border rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-scale">
            <div className="flex justify-between items-center border-b border-[#e9c176]/15 pb-4">
              <h3 className="font-serif text-lg text-[#e9c176] font-bold">Edit Dining Table Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#a0998e] hover:text-[#e9c176]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Table Number *</label>
                <input
                  type="text"
                  required
                  value={tableForm.tableNumber}
                  onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Seating Capacity (Guests) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={tableForm.capacity}
                  onChange={(e) => setTableForm({ ...tableForm, capacity: Number(e.target.value) })}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Location *</label>
                <select
                  value={tableForm.location}
                  onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
                >
                  <option value="INDOOR">Indoor Main Hall</option>
                  <option value="OUTDOOR">Outdoor Garden / Terrace</option>
                </select>
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Status *</label>
                <select
                  value={tableForm.status}
                  onChange={(e) => setTableForm({ ...tableForm, status: e.target.value })}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#e9c176]/15 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a0998e] hover:text-[#e6e2dd]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#e9c176] text-[#0f1f15] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] shadow-lg transition-all cursor-pointer"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Table Confirmation Modal */}
      {deleteTargetTable && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1c13] gold-border rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-scale">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#e6e2dd] font-bold mb-1">Delete Table?</h3>
              <p className="text-xs text-[#a0998e]">
                Are you sure you want to delete table{' '}
                <strong className="text-[#e9c176]">{deleteTargetTable.tableNumber}</strong>? This action cannot be
                undone.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetTable(null)}
                className="px-4 py-2 bg-[#07140c] border border-[#e9c176]/30 text-[#e6e2dd] rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-xl text-xs hover:bg-red-600 transition-colors shadow-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
