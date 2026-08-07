import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
} from '../../services/api/menu.service';

export default function AdminMenuManagement({ menuItems: parentItems, setMenuItems: setParentItems }) {
  // Filters & Controls state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [vegFilter, setVegFilter] = useState('ALL');
  const [availFilter, setAvailFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // Data state
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  // Modals & Feedback
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image Upload File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const categories = [
    'ALL',
    'Starters',
    'Soups',
    'Main Course',
    'Indian',
    'Italian',
    'Chinese',
    'Continental',
    'Beverages',
    'Mocktails',
    'Desserts',
    "Chef's Specials",
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    category: 'Starters',
    price: '',
    description: '',
    prepTime: '15-20 mins',
    isVeg: true,
    isAvailable: true,
    isFeatured: false,
    imageUrl: '',
  });

  // Fetch Menu Items from backend with filters & pagination
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);
    try {
      const res = await fetchMenuItems({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        category: categoryFilter,
        isVeg: vegFilter === 'ALL' ? '' : vegFilter === 'VEG' ? 'true' : 'false',
        isAvailable: availFilter === 'ALL' ? '' : availFilter === 'AVAILABLE' ? 'true' : 'false',
        sort: sortBy,
      });

      setItems(res.data || []);
      setTotalCount(res.total || 0);
      setTotalPages(res.totalPages || 1);
      if (setParentItems) {
        setParentItems(res.data || []);
      }
    } catch (err) {
      setErrorState(err.message || 'Failed to fetch menu items from database');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, categoryFilter, vegFilter, availFilter, sortBy, setParentItems]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  // File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setSelectedFile(null);
    setPreviewImage('');
    setFormState({
      name: '',
      category: 'Starters',
      price: '',
      description: '',
      prepTime: '15-20 mins',
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      imageUrl: '',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setSelectedFile(null);
    setPreviewImage(item.imageUrl || '');
    setFormState({
      name: item.name || '',
      category: item.category || 'Starters',
      price: item.price || '',
      description: item.description || '',
      prepTime: item.prepTime || '15-20 mins',
      isVeg: item.isVeg !== undefined ? item.isVeg : true,
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      isFeatured: item.isFeatured !== undefined ? item.isFeatured : false,
      imageUrl: item.imageUrl || '',
    });
    setIsAddModalOpen(true);
  };

  // Save Dish (Supports Multer File Upload OR Image URL)
  const handleSaveItem = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let payload;

      if (selectedFile) {
        // Use FormData for Multer file upload
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('name', formState.name);
        formData.append('category', formState.category);
        formData.append('price', formState.price);
        formData.append('description', formState.description);
        formData.append('prepTime', formState.prepTime);
        formData.append('isVeg', formState.isVeg);
        formData.append('isAvailable', formState.isAvailable);
        formData.append('isFeatured', formState.isFeatured);

        payload = formData;
      } else {
        // Use JSON payload
        payload = {
          name: formState.name,
          category: formState.category,
          price: Number(formState.price),
          description: formState.description,
          prepTime: formState.prepTime,
          isVeg: formState.isVeg,
          isAvailable: formState.isAvailable,
          isFeatured: formState.isFeatured,
          imageUrl: formState.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
        };
      }

      if (editingItem) {
        const updated = await updateMenuItem(editingItem.id, payload);
        showToast(`Updated dish "${updated.name}"`);
      } else {
        const created = await createMenuItem(payload);
        showToast(`Added new dish "${created.name}" to menu`);
      }

      setIsAddModalOpen(false);
      loadData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsSubmitting(true);

    try {
      await deleteMenuItem(itemToDelete.id);
      setItems((prev) => prev.filter((it) => it.id !== itemToDelete.id));
      showToast(`Deleted "${itemToDelete.name}" from database`);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showToast(`Failed to delete: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Availability
  const handleToggleAvailability = async (id, currentStatus, name) => {
    try {
      const updated = await toggleMenuItemAvailability(id, currentStatus);
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, isAvailable: updated.isAvailable } : it))
      );
      showToast(`"${name}" marked as ${!currentStatus ? 'Available' : 'Unavailable'}`);
    } catch {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, isAvailable: !currentStatus } : it))
      );
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

      {/* Control Toolbar */}
      <div className="bg-[#0d1c13] gold-border rounded-2xl p-6 space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-[#e9c176]/15">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#e9c176] text-[#0f1f15] shadow-md font-bold'
                  : 'bg-[#07140c] text-[#a0998e] hover:text-[#e9c176] border border-[#e9c176]/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-sm text-[#a0998e]">
              search
            </span>
            <input
              type="text"
              placeholder="Search dish by name or ingredients..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#e6e2dd] focus:outline-none custom-focus"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Veg / Non-Veg Filter */}
            <select
              value={vegFilter}
              onChange={(e) => {
                setVegFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#07140c] border border-[#e9c176]/30 rounded-xl px-3 py-2 text-xs text-[#e6e2dd] focus:outline-none cursor-pointer custom-focus"
            >
              <option value="ALL">All Dietary</option>
              <option value="VEG">● Veg Only</option>
              <option value="NON_VEG">▲ Non-Veg Only</option>
            </select>

            {/* Availability Filter */}
            <select
              value={availFilter}
              onChange={(e) => {
                setAvailFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#07140c] border border-[#e9c176]/30 rounded-xl px-3 py-2 text-xs text-[#e6e2dd] focus:outline-none cursor-pointer custom-focus"
            >
              <option value="ALL">All Availability</option>
              <option value="AVAILABLE">Available Only</option>
              <option value="UNAVAILABLE">Unavailable Only</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#07140c] border border-[#e9c176]/30 rounded-xl px-3 py-2 text-xs text-[#e6e2dd] focus:outline-none cursor-pointer custom-focus"
            >
              <option value="name_asc">Name: A - Z</option>
              <option value="name_desc">Name: Z - A</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>

            {/* Add Dish Button */}
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-[#e9c176] text-[#0f1f15] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] shadow-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Add New Dish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
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

      {/* Content Area: Loading / Empty / Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#e9c176]">
          <div className="w-10 h-10 rounded-full border-2 border-[#e9c176]/20 border-t-[#e9c176] animate-spin" />
          <span className="text-xs uppercase tracking-wider">Fetching Menu Items from PostgreSQL...</span>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center text-[#a0998e] space-y-3 bg-[#0d1c13] gold-border rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-[#e9c176]/30 block">
            restaurant_menu
          </span>
          <h3 className="font-serif text-lg text-[#e6e2dd] font-bold">No Menu Dishes Found</h3>
          <p className="text-xs max-w-sm mx-auto text-[#a0998e]">
            There are no menu dishes matching your current filter criteria in the database.
          </p>
        </div>
      ) : (
        <>
          {/* Menu Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-[#0d1c13] gold-border rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#e9c176] transition-all duration-300 group shadow-xl ${
                  !item.isAvailable ? 'opacity-65 grayscale-[25%]' : ''
                }`}
              >
                <div>
                  {/* Dish Image Banner */}
                  <div className="h-48 relative overflow-hidden bg-[#07140c]">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c13] via-transparent to-black/40" />

                    {/* Veg / Non-Veg Badge */}
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${
                        item.isVeg
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                          : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                      }`}
                    >
                      {item.isVeg ? '● VEG' : '▲ NON-VEG'}
                    </span>

                    {/* Featured Tag */}
                    {item.isFeatured && (
                      <span className="absolute top-3 right-3 bg-[#e9c176] text-[#0f1f15] font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg">
                        ★ FEATURED
                      </span>
                    )}

                    {/* Price Tag */}
                    <span className="absolute bottom-3 right-3 bg-[#0d1c13]/90 text-[#e9c176] border border-[#e9c176]/40 font-serif font-bold text-lg px-3 py-1 rounded-xl shadow-lg">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-base text-[#e6e2dd] font-bold group-hover:text-[#e9c176] transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-[#a0998e]">
                      <span className="text-[#e9c176] font-semibold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span>•</span>
                      <span>⏱️ {item.prepTime || '15-20 mins'}</span>
                    </div>

                    <p className="text-xs text-[#a0998e] leading-relaxed line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Actions & Availability Toggle */}
                <div className="p-5 pt-0 border-t border-[#e9c176]/10 mt-3 flex items-center justify-between">
                  {/* Availability Toggle */}
                  <button
                    onClick={() => handleToggleAvailability(item.id, item.isAvailable, item.name)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                      item.isAvailable
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {item.isAvailable ? 'check_circle' : 'do_not_disturb_on'}
                    </span>
                    <span>{item.isAvailable ? 'Available' : 'Unavailable'}</span>
                  </button>

                  {/* Edit / Delete Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 rounded-lg bg-[#122419] border border-[#e9c176]/30 text-[#e9c176] hover:bg-[#e9c176] hover:text-[#0f1f15] transition-all cursor-pointer"
                      title="Edit Item"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => handleOpenDelete(item)}
                      className="p-2 rounded-lg bg-[#122419] border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                      title="Delete Item"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 bg-[#09160e] gold-border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#a0998e]">
              <div>
                Showing <strong className="text-[#e6e2dd]">{items.length}</strong> of{' '}
                <strong className="text-[#e9c176]">{totalCount}</strong> dishes
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
        </>
      )}

      {/* Add / Edit Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1c13] gold-border rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-5 shadow-2xl relative animate-scale max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-[#e9c176]/15 pb-4">
              <h3 className="font-serif text-xl text-[#e9c176] font-bold">
                {editingItem ? 'Edit Dish' : 'Add New Dish'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#a0998e] hover:text-[#e9c176]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-[#e9c176] mb-1 font-medium">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. Royal Awadhi Biryani"
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-[#e9c176] mb-1 font-medium">
                    Category *
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none cursor-pointer custom-focus"
                  >
                    {categories.filter((c) => c !== 'ALL').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#e9c176] mb-1 font-medium">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                    placeholder="750"
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#e9c176] mb-1 font-medium">
                    Prep Time
                  </label>
                  <input
                    type="text"
                    value={formState.prepTime}
                    onChange={(e) => setFormState({ ...formState, prepTime: e.target.value })}
                    placeholder="15-20 mins"
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#e9c176] mb-1 font-medium">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Artisanal recipe details, spices, and ingredients..."
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus resize-none"
                />
              </div>

              {/* Image Options: Upload File OR Image URL */}
              <div className="space-y-2 pt-2 border-t border-[#e9c176]/10">
                <label className="block uppercase tracking-wider text-[#e9c176] font-medium">
                  Dish Image (File Upload or URL)
                </label>

                {/* Preview Image */}
                {(previewImage || formState.imageUrl) && (
                  <div className="w-full h-32 rounded-xl overflow-hidden bg-[#07140c] border border-[#e9c176]/20 relative mb-2">
                    <img
                      src={previewImage || formState.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 text-[#e9c176] px-2 py-0.5 rounded">
                      Image Preview
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#a0998e] text-[11px] mb-1">Upload Local Image (Multer)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-2 text-xs text-[#a0998e] file:bg-[#e9c176] file:text-[#0f1f15] file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-semibold file:cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0998e] text-[11px] mb-1">OR High-Quality Image URL</label>
                    <input
                      type="text"
                      value={formState.imageUrl}
                      onChange={(e) => {
                        setFormState({ ...formState, imageUrl: e.target.value });
                        setPreviewImage(e.target.value);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#e9c176]/15">
                <label className="flex items-center gap-2 cursor-pointer text-[#e6e2dd] bg-[#07140c] p-2.5 rounded-xl border border-[#e9c176]/20">
                  <input
                    type="checkbox"
                    checked={formState.isVeg}
                    onChange={(e) => setFormState({ ...formState, isVeg: e.target.checked })}
                    className="accent-[#e9c176] w-4 h-4"
                  />
                  <span className="font-semibold text-xs">Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#e6e2dd] bg-[#07140c] p-2.5 rounded-xl border border-[#e9c176]/20">
                  <input
                    type="checkbox"
                    checked={formState.isAvailable}
                    onChange={(e) => setFormState({ ...formState, isAvailable: e.target.checked })}
                    className="accent-[#e9c176] w-4 h-4"
                  />
                  <span className="font-semibold text-xs">Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#e6e2dd] bg-[#07140c] p-2.5 rounded-xl border border-[#e9c176]/20">
                  <input
                    type="checkbox"
                    checked={formState.isFeatured}
                    onChange={(e) => setFormState({ ...formState, isFeatured: e.target.checked })}
                    className="accent-[#e9c176] w-4 h-4"
                  />
                  <span className="font-semibold text-xs">Featured ★</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e9c176]/15">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                      <span>{editingItem ? 'Save Changes' : 'Add Dish'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dish Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1c13] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-scale">
            <div className="flex items-center gap-3 border-b border-rose-500/20 pb-4">
              <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <span className="material-symbols-outlined text-xl">restaurant_menu</span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-rose-400 font-bold">Delete Menu Dish</h3>
                <p className="text-xs text-[#a0998e]">Confirm removal from database.</p>
              </div>
            </div>

            <div className="bg-[#07140c] rounded-xl p-4 border border-rose-500/10 text-xs text-[#c8c2b7] space-y-1">
              <p>
                Delete dish <strong className="text-[#e6e2dd]">{itemToDelete.name}</strong> ({itemToDelete.category})?
              </p>
              <p className="text-[11px] text-[#a0998e]">
                This will permanently delete the item from PostgreSQL and customer menu pages.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
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
                    <span>Delete Dish</span>
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
