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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'RESERVED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'OCCUPIED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MAINTENANCE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  // Group tables by dining location section
  const indoorTables = tables.filter((t) => t.location === 'INDOOR');
  const outdoorTables = tables.filter((t) => t.location === 'OUTDOOR');

  return (
    <div className="space-y-6 animate-fadeIn pb-12 select-none max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#C5A059] text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DE]/60 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Floor Plan & Table Status
          </h1>
          <p className="text-xs text-[#666666] font-medium mt-1">
            Visual dining layout, real-time table occupancies, and 2-hour reservation windows.
          </p>
        </div>

        <button
          onClick={() => {
            setTableForm({ tableNumber: `T${String(tables.length + 1).padStart(2, '0')}`, capacity: 4, location: 'INDOOR', status: 'AVAILABLE' });
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] shadow-2xs transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Add Dining Table</span>
        </button>
      </div>

      {/* Occupancy Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="saas-card p-4 flex flex-col justify-between">
          <span className="text-[10px] text-[#666666] uppercase tracking-wider font-medium">Total Tables</span>
          <span className="font-serif text-2xl text-[#1A1A1A] font-bold mt-1">{stats.totalTables || 0}</span>
        </div>

        <div className="saas-card p-4 flex flex-col justify-between border-l-3 border-l-emerald-500">
          <span className="text-[10px] text-emerald-700 uppercase tracking-wider font-semibold">Available</span>
          <span className="font-serif text-2xl text-emerald-700 font-bold mt-1">{stats.availableCount || 0}</span>
        </div>

        <div className="saas-card p-4 flex flex-col justify-between border-l-3 border-l-amber-500">
          <span className="text-[10px] text-amber-700 uppercase tracking-wider font-semibold">Reserved</span>
          <span className="font-serif text-2xl text-amber-700 font-bold mt-1">{stats.reservedCount || 0}</span>
        </div>

        <div className="saas-card p-4 flex flex-col justify-between border-l-3 border-l-blue-500">
          <span className="text-[10px] text-blue-700 uppercase tracking-wider font-semibold">Occupied</span>
          <span className="font-serif text-2xl text-blue-700 font-bold mt-1">{stats.occupiedCount || 0}</span>
        </div>

        <div className="saas-card p-4 flex flex-col justify-between border-l-3 border-l-rose-500">
          <span className="text-[10px] text-rose-700 uppercase tracking-wider font-semibold">Maintenance</span>
          <span className="font-serif text-2xl text-rose-700 font-bold mt-1">{stats.maintenanceCount || 0}</span>
        </div>

        <div className="saas-card p-4 flex flex-col justify-between">
          <span className="text-[10px] text-[#C5A059] uppercase tracking-wider font-semibold">Occupancy Rate</span>
          <span className="font-serif text-2xl text-[#C5A059] font-bold mt-1">{stats.occupancyRate || 0}%</span>
        </div>
      </div>

      {/* Search & Location Controls */}
      <div className="saas-card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#666666] text-base">
            search
          </span>
          <input
            type="text"
            placeholder="Search table number (e.g. T01)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-[#666666]/60 focus:outline-none custom-focus"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none custom-focus cursor-pointer font-medium"
          >
            <option value="ALL">All Sections</option>
            <option value="INDOOR">Indoor Main Dining</option>
            <option value="OUTDOOR">Outdoor Terrace</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none custom-focus cursor-pointer font-medium"
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
        <div className="saas-card p-16 text-center text-[#666666] space-y-2">
          <span className="material-symbols-outlined text-4xl text-[#666666]/30">table_restaurant</span>
          <h3 className="font-serif text-lg text-[#1A1A1A] font-bold">No Tables Found</h3>
          <p className="text-xs text-[#666666]">Adjust your search or location filter.</p>
        </div>
      ) : (
        /* Floor Layout Sections */
        <div className="space-y-8">
          {/* Section 1: Indoor Main Hall */}
          {(selectedLocation === 'ALL' || selectedLocation === 'INDOOR') && indoorTables.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E8E4DE] pb-2">
                <span className="material-symbols-outlined text-sm text-[#C5A059]">chair</span>
                <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Indoor Main Dining Room ({indoorTables.length} Tables)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {indoorTables.map((table) => (
                  <TableNodeCard
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
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E8E4DE] pb-2">
                <span className="material-symbols-outlined text-sm text-[#C5A059]">deck</span>
                <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Outdoor Garden & Terrace ({outdoorTables.length} Tables)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {outdoorTables.map((table) => (
                  <TableNodeCard
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

      {/* Add Table Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E4DE] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale">
            <div className="flex justify-between items-center border-b border-[#E8E4DE] pb-3">
              <h3 className="font-serif text-xl text-[#1A1A1A] font-bold">Add Dining Table</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#666666] hover:text-[#1A1A1A]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#666666] mb-1 font-semibold">Table Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. T13"
                  value={tableForm.tableNumber}
                  onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                  className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[#666666] mb-1 font-semibold">Capacity (Guests) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={tableForm.capacity}
                  onChange={(e) => setTableForm({ ...tableForm, capacity: Number(e.target.value) })}
                  className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                />
              </div>

              <div>
                <label className="block text-[#666666] mb-1 font-semibold">Dining Area Section *</label>
                <select
                  value={tableForm.location}
                  onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
                  className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus cursor-pointer font-medium"
                >
                  <option value="INDOOR">Indoor Main Dining</option>
                  <option value="OUTDOOR">Outdoor Garden / Terrace</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E8E4DE] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#666666] hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] transition-all cursor-pointer shadow-2xs"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E4DE] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale">
            <div className="flex justify-between items-center border-b border-[#E8E4DE] pb-3">
              <h3 className="font-serif text-xl text-[#1A1A1A] font-bold">Edit Table Configuration</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#666666] hover:text-[#1A1A1A]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#666666] mb-1 font-semibold">Table Number</label>
                <input
                  type="text"
                  required
                  value={tableForm.tableNumber}
                  onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                  className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-mono"
                />
              </div>

              <div>
                <label className="block text-[#666666] mb-1 font-semibold">Capacity (Guests)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={tableForm.capacity}
                  onChange={(e) => setTableForm({ ...tableForm, capacity: Number(e.target.value) })}
                  className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                />
              </div>

              <div>
                <label className="block text-[#666666] mb-1 font-semibold">Location</label>
                <select
                  value={tableForm.location}
                  onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
                  className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus cursor-pointer font-medium"
                >
                  <option value="INDOOR">Indoor Main Dining</option>
                  <option value="OUTDOOR">Outdoor Garden / Terrace</option>
                </select>
              </div>

              <div>
                <label className="block text-[#666666] mb-1 font-semibold">Status</label>
                <select
                  value={tableForm.status}
                  onChange={(e) => setTableForm({ ...tableForm, status: e.target.value })}
                  className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus cursor-pointer font-medium"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E8E4DE] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#666666] hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] transition-all cursor-pointer shadow-2xs"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E4DE] rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-scale">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#1A1A1A] font-bold mb-1">Delete Table?</h3>
              <p className="text-xs text-[#666666]">
                Are you sure you want to delete table <strong className="text-[#1A1A1A]">{deleteTargetTable.tableNumber}</strong>?
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetTable(null)}
                className="px-4 py-2 bg-[#FAF8F4] border border-[#E8E4DE] text-[#1A1A1A] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 transition-colors shadow-2xs"
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

function TableNodeCard({ table, getStatusBadge, openEditModal, handleQuickStatusChange, setDeleteTargetTable }) {
  return (
    <div className="saas-card p-4 flex flex-col justify-between space-y-3 group hover:border-[#C5A059]/40 transition-all">
      <div className="space-y-3">
        {/* Table Node Header */}
        <div className="flex items-center justify-between border-b border-[#E8E4DE] pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] flex items-center justify-center font-serif text-base font-bold text-[#1A1A1A]">
              {table.tableNumber}
            </div>
            <div>
              <div className="text-xs font-bold text-[#1A1A1A]">{table.capacity} Seats</div>
              <div className="text-[10px] text-[#666666] uppercase tracking-wider">{table.location}</div>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(table.status)}`}>
            {table.status}
          </span>
        </div>

        {/* Current & Blocked Reservation Details */}
        <div className="space-y-1.5 text-xs">
          {table.currentReservation ? (
            <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] text-[11px] space-y-1">
              <div className="font-semibold text-[#1A1A1A] truncate">{table.currentReservation.name}</div>
              <div className="text-[#666666] flex justify-between items-center text-[10px]">
                <span>{table.currentReservation.guests} Guests</span>
                <span className="font-mono text-[#C5A059] font-bold">
                  {table.currentReservation.timeSlot || table.currentReservation.reservationTime}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-[#666666]/60 italic py-1">Currently Free</div>
          )}

          {table.reservedTimeSlot && (
            <div className="text-[10px] font-mono text-[#C5A059] bg-[#FAF8F4] border border-[#E8E4DE] px-2 py-1 rounded-lg">
              Blocked: {table.reservedTimeSlot}
            </div>
          )}
        </div>
      </div>

      {/* Footer Status Dropdown & Action Icons */}
      <div className="pt-2 border-t border-[#E8E4DE] flex items-center justify-between">
        <select
          value={table.status}
          onChange={(e) => handleQuickStatusChange(table.id, e.target.value)}
          className="bg-[#FAF8F4] border border-[#E8E4DE] rounded-lg px-2 py-1 text-[10px] font-semibold text-[#1A1A1A] focus:outline-none custom-focus cursor-pointer"
        >
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="RESERVED">RESERVED</option>
          <option value="OCCUPIED">OCCUPIED</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
        </select>

        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditModal(table)}
            className="p-1 text-[#666666] hover:text-[#1A1A1A] rounded-lg hover:bg-[#FAF8F4]"
            title="Edit Table"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button
            onClick={() => setDeleteTargetTable(table)}
            className="p-1 text-rose-600 hover:text-rose-700 rounded-lg hover:bg-rose-50"
            title="Delete Table"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
