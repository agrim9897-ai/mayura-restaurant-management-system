import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchTables,
  createTable,
  updateTable,
  deleteTable,
} from '../../services/api/table.service';
import AdminSkeleton from './AdminSkeleton';

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

  // Modals & Feedback
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
      showToast(`Table '${tableForm.tableNumber}' added!`);
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
      showToast(`Table '${tableForm.tableNumber}' updated!`);
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

  const getStatusBadge = (status) => {
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
        return 'bg-gray-900 text-gray-400 border-gray-800';
    }
  };

  // Group tables by dining location section
  const indoorTables = tables.filter((t) => t.location === 'INDOOR');
  const outdoorTables = tables.filter((t) => t.location === 'OUTDOOR');

  return (
    <div className="space-y-6 animate-fadeIn pb-8 select-none">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#e9c176] text-[#050d08] font-bold text-xs px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#e9c176] font-bold">Floor Plan & Table Occupancy</h2>
          <p className="text-xs text-[#a0998e]">
            Live dining room sections, table assignments, and 2-hour window availability.
          </p>
        </div>

        <button
          onClick={() => {
            setTableForm({ tableNumber: `T${String(tables.length + 1).padStart(2, '0')}`, capacity: 4, location: 'INDOOR', status: 'AVAILABLE' });
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#e9c176] text-[#050d08] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] shadow-lg transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Add Table</span>
        </button>
      </div>

      {/* Occupancy Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="saas-card p-4 flex flex-col justify-between">
          <span className="text-[10px] text-[#a0998e] uppercase tracking-wider font-semibold">Total Tables</span>
          <span className="font-serif text-2xl text-[#e6e2dd] font-bold mt-1">{stats.totalTables || 0}</span>
        </div>

        <div className="saas-card p-4 flex flex-col justify-between border-l-2 border-l-emerald-500">
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Available</span>
          <span className="font-serif text-2xl text-emerald-400 font-bold mt-1">{stats.availableCount || 0}</span>
        </div>

        <div className="saas-card p-4 flex flex-col justify-between border-l-2 border-l-amber-500">
          <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Reserved</span>
          <span className="font-serif text-2xl text-amber-400 font-bold mt-1">{stats.reservedCount || 0}</span>
        </div>

        <div className="saas-card p-4 flex flex-col justify-between border-l-2 border-l-blue-500">
          <span className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">Occupied</span>
          <span className="font-serif text-2xl text-blue-400 font-bold mt-1">{stats.occupiedCount || 0}</span>
        </div>

        <div className="saas-card p-4 flex flex-col justify-between border-l-2 border-l-rose-500">
          <span className="text-[10px] text-rose-400 uppercase tracking-wider font-semibold">Maintenance</span>
          <span className="font-serif text-2xl text-rose-400 font-bold mt-1">{stats.maintenanceCount || 0}</span>
        </div>

        <div className="saas-card p-4 flex flex-col justify-between">
          <span className="text-[10px] text-[#e9c176] uppercase tracking-wider font-semibold">Occupancy Rate</span>
          <span className="font-serif text-2xl text-[#e9c176] font-bold mt-1">{stats.occupancyRate || 0}%</span>
        </div>
      </div>

      {/* Search & Location Filter Bar */}
      <div className="saas-card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#a0998e] text-base">
            search
          </span>
          <input
            type="text"
            placeholder="Search table number (e.g. T01)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl pl-9 pr-4 py-2 text-xs text-[#e6e2dd] placeholder-[#a0998e]/60 focus:outline-none custom-focus"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-[#08170e] border border-[#e9c176]/20 rounded-xl px-3 py-2 text-xs text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
          >
            <option value="ALL">All Sections</option>
            <option value="INDOOR">Indoor Main Hall</option>
            <option value="OUTDOOR">Outdoor Terrace</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#08170e] border border-[#e9c176]/20 rounded-xl px-3 py-2 text-xs text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <AdminSkeleton type="cards" count={8} />
      ) : tables.length === 0 ? (
        <div className="saas-card p-12 text-center text-[#a0998e] space-y-2">
          <span className="material-symbols-outlined text-4xl text-[#e9c176]/30">table_restaurant</span>
          <h3 className="font-serif text-lg text-[#e6e2dd] font-bold">No Tables Found</h3>
          <p className="text-xs">Adjust your search or location filter.</p>
        </div>
      ) : (
        /* Floor Plan Sections */
        <div className="space-y-8">
          {/* Section 1: Indoor Main Hall */}
          {(selectedLocation === 'ALL' || selectedLocation === 'INDOOR') && indoorTables.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[#e9c176]/10 pb-2">
                <span className="material-symbols-outlined text-sm text-[#e9c176]">chair</span>
                <h3 className="text-xs font-bold text-[#e6e2dd] uppercase tracking-wider">
                  Indoor Main Dining Room ({indoorTables.length} Tables)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {indoorTables.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    getStatusBadge={getStatusBadge}
                    openEditModal={openEditModal}
                    handleQuickStatusChange={handleQuickStatusChange}
                    setDeleteTargetTable={setDeleteTargetTable}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Outdoor Terrace */}
          {(selectedLocation === 'ALL' || selectedLocation === 'OUTDOOR') && outdoorTables.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[#e9c176]/10 pb-2">
                <span className="material-symbols-outlined text-sm text-[#e9c176]">deck</span>
                <h3 className="text-xs font-bold text-[#e6e2dd] uppercase tracking-wider">
                  Outdoor Garden & Terrace ({outdoorTables.length} Tables)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {outdoorTables.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    getStatusBadge={getStatusBadge}
                    openEditModal={openEditModal}
                    handleQuickStatusChange={handleQuickStatusChange}
                    setDeleteTargetTable={setDeleteTargetTable}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modals */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09170e] border border-[#e9c176]/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale">
            <div className="flex justify-between items-center border-b border-[#e9c176]/10 pb-3">
              <h3 className="font-serif text-lg text-[#e9c176] font-bold">Add Dining Table</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#a0998e] hover:text-[#e6e2dd]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a0998e] mb-1 font-semibold">Table Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. T13"
                  value={tableForm.tableNumber}
                  onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                  className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-semibold">Capacity (Guests) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={tableForm.capacity}
                  onChange={(e) => setTableForm({ ...tableForm, capacity: Number(e.target.value) })}
                  className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-semibold">Dining Area Section *</label>
                <select
                  value={tableForm.location}
                  onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
                  className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
                >
                  <option value="INDOOR">Indoor Main Hall</option>
                  <option value="OUTDOOR">Outdoor Garden / Terrace</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#e9c176]/10 flex justify-end gap-3">
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
                  className="px-5 py-2.5 bg-[#e9c176] text-[#050d08] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] transition-all cursor-pointer"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09170e] border border-[#e9c176]/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale">
            <div className="flex justify-between items-center border-b border-[#e9c176]/10 pb-3">
              <h3 className="font-serif text-lg text-[#e9c176] font-bold">Edit Table Config</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#a0998e] hover:text-[#e6e2dd]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a0998e] mb-1 font-semibold">Table Number</label>
                <input
                  type="text"
                  required
                  value={tableForm.tableNumber}
                  onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                  className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus font-mono"
                />
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-semibold">Capacity (Guests)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={tableForm.capacity}
                  onChange={(e) => setTableForm({ ...tableForm, capacity: Number(e.target.value) })}
                  className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-semibold">Location</label>
                <select
                  value={tableForm.location}
                  onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
                  className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
                >
                  <option value="INDOOR">Indoor Main Hall</option>
                  <option value="OUTDOOR">Outdoor Garden / Terrace</option>
                </select>
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-semibold">Status</label>
                <select
                  value={tableForm.status}
                  onChange={(e) => setTableForm({ ...tableForm, status: e.target.value })}
                  className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#e9c176]/10 flex justify-end gap-3">
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
                  className="px-5 py-2.5 bg-[#e9c176] text-[#050d08] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] transition-all cursor-pointer"
                >
                  Update Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetTable && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09170e] border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-scale">
            <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#e6e2dd] font-bold mb-1">Delete Table?</h3>
              <p className="text-xs text-[#a0998e]">
                Are you sure you want to delete table <strong className="text-[#e9c176]">{deleteTargetTable.tableNumber}</strong>?
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetTable(null)}
                className="px-4 py-2 bg-[#08170e] border border-[#e9c176]/20 text-[#e6e2dd] rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-rose-500 text-white font-bold rounded-xl text-xs hover:bg-rose-600 transition-colors shadow-lg"
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

function TableCard({ table, getStatusBadge, openEditModal, handleQuickStatusChange, setDeleteTargetTable }) {
  return (
    <div className="saas-card p-4 flex flex-col justify-between space-y-3 group hover:border-[#e9c176]/40 transition-all">
      <div className="space-y-2">
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-[#e9c176]/10 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#07130b] border border-[#e9c176]/20 flex items-center justify-center font-serif text-base font-bold text-[#e9c176]">
              {table.tableNumber}
            </div>
            <div>
              <div className="text-xs font-bold text-[#e6e2dd]">{table.capacity} Seats</div>
              <div className="text-[10px] text-[#a0998e] uppercase tracking-wider">{table.location}</div>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(table.status)}`}>
            {table.status}
          </span>
        </div>

        {/* Reservation Status */}
        <div className="space-y-1.5 text-xs">
          {table.currentReservation ? (
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[11px] space-y-1">
              <div className="font-bold text-[#e6e2dd] truncate">{table.currentReservation.name}</div>
              <div className="text-blue-300 flex justify-between items-center text-[10px]">
                <span>{table.currentReservation.guests} Guests</span>
                <span className="font-mono">{table.currentReservation.timeSlot || table.currentReservation.reservationTime}</span>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-[#a0998e]/60 italic py-1">Currently Free</div>
          )}

          {table.reservedTimeSlot && (
            <div className="text-[10px] font-mono text-[#e9c176] bg-[#07130b] border border-[#e9c176]/20 px-2 py-1 rounded-lg">
              Blocked: {table.reservedTimeSlot}
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-2 border-t border-[#e9c176]/10 flex items-center justify-between">
        <select
          value={table.status}
          onChange={(e) => handleQuickStatusChange(table.id, e.target.value)}
          className="bg-[#07130b] border border-[#e9c176]/20 rounded-lg px-2 py-1 text-[10px] text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
        >
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="RESERVED">RESERVED</option>
          <option value="OCCUPIED">OCCUPIED</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
        </select>

        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditModal(table)}
            className="p-1 text-[#a0998e] hover:text-[#e9c176] rounded-lg hover:bg-[#0c1b11]"
            title="Edit"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button
            onClick={() => setDeleteTargetTable(table)}
            className="p-1 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10"
            title="Delete"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
