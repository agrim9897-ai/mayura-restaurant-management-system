import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
} from '../../services/api/menu.service';
import AdminSkeleton from './AdminSkeleton';

export default function AdminMenuManagement({ setMenuItems: setParentItems }) {
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

  // Fetch Menu Items from backend
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

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

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let payload;
      if (selectedFile) {
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
        showToast(`Added new dish "${created.name}"`);
      }

      setIsAddModalOpen(false);
      loadData();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsSubmitting(true);

    try {
      await deleteMenuItem(itemToDelete.id);
      setItems((prev) => prev.filter((it) => it.id !== itemToDelete.id));
      showToast(`Deleted "${itemToDelete.name}"`);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showToast(`Failed to delete: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="space-y-6 animate-fadeIn pb-12 select-none max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#C5A059] text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editorial Title & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DE]/60 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Menu Catalog & Inventory
          </h1>
          <p className="text-xs text-[#666666] font-medium mt-1">
            Manage culinary offerings, pricing, dietary classifications, and kitchen availability.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] shadow-2xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Toolbar & Category Filters (Shopify Style) */}
      <div className="saas-card p-5 space-y-4">
        {/* Category Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 border-b border-[#E8E4DE]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                categoryFilter === cat
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-2xs'
                  : 'bg-[#FAF8F4] text-[#666666] border-[#E8E4DE] hover:text-[#1A1A1A] hover:bg-[#EFE9DF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search, Dietary & Sorting Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-6 relative">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-xs text-[#666666]">
              search
            </span>
            <input
              type="text"
              placeholder="Search dish by name or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-[#666666]/60 focus:outline-none custom-focus"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={vegFilter}
              onChange={(e) => {
                setVegFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none custom-focus cursor-pointer font-medium"
            >
              <option value="ALL">All Dietary Types</option>
              <option value="VEG">● Vegetarian Only</option>
              <option value="NON_VEG">▲ Non-Veg Only</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none custom-focus cursor-pointer font-medium"
            >
              <option value="name_asc">Name: A - Z</option>
              <option value="name_desc">Name: Z - A</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Menu Catalog Grid */}
      {isLoading ? (
        <AdminSkeleton type="cards" count={6} />
      ) : items.length === 0 ? (
        <div className="saas-card p-16 text-center text-[#666666] space-y-2">
          <span className="material-symbols-outlined text-4xl text-[#666666]/30">restaurant_menu</span>
          <h3 className="font-serif text-lg text-[#1A1A1A] font-bold">No Menu Dishes Found</h3>
          <p className="text-xs text-[#666666]">Adjust your search or category filter selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className={`saas-card overflow-hidden flex flex-col justify-between group hover:border-[#C5A059]/40 transition-all ${
                !item.isAvailable ? 'opacity-70 grayscale-[25%]' : ''
              }`}
            >
              <div>
                {/* Thumbnail Header */}
                <div className="h-48 relative overflow-hidden bg-[#FAF8F4]">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Veg / Non-Veg Chip */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${
                      item.isVeg
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {item.isVeg ? '● VEG' : '▲ NON-VEG'}
                  </span>

                  {/* Price Tag */}
                  <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-[#1A1A1A] border border-[#E8E4DE] font-serif font-bold text-base px-3 py-1 rounded-xl shadow-2xs">
                    ₹{item.price}
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-base text-[#1A1A1A] font-bold group-hover:text-[#C5A059] transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-[#666666]">
                    <span className="text-[#C5A059] font-bold uppercase tracking-wider">{item.category}</span>
                    <span>•</span>
                    <span>⏱️ {item.prepTime || '15-20 mins'}</span>
                  </div>

                  <p className="text-xs text-[#666666] leading-relaxed line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Controls */}
              <div className="p-4 pt-0 border-t border-[#E8E4DE] mt-3 flex items-center justify-between">
                <button
                  onClick={() => handleToggleAvailability(item.id, item.isAvailable, item.name)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                    item.isAvailable
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">
                    {item.isAvailable ? 'check_circle' : 'do_not_disturb_on'}
                  </span>
                  <span>{item.isAvailable ? 'Available' : 'Unavailable'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-[#666666] hover:text-[#1A1A1A] hover:bg-[#FAF8F4] transition-colors cursor-pointer"
                    title="Edit Dish"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>

                  <button
                    onClick={() => {
                      setItemToDelete(item);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Dish"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {!isLoading && totalPages > 1 && (
        <div className="p-4 saas-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666666]">
          <div>
            Showing <strong className="text-[#1A1A1A]">{items.length}</strong> of{' '}
            <strong className="text-[#1A1A1A]">{totalCount}</strong> dishes
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-lg border border-[#E8E4DE] bg-white text-[#1A1A1A] disabled:opacity-40 hover:bg-[#FAF8F4] transition-all cursor-pointer font-semibold"
            >
              ← Prev
            </button>

            <span className="px-3 py-1.5 rounded-lg bg-[#FAF8F4] border border-[#E8E4DE] font-bold text-[#1A1A1A]">
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

      {/* Add / Edit Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E4DE] rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-scale max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-[#E8E4DE] pb-3">
              <h3 className="font-serif text-xl text-[#1A1A1A] font-bold">
                {editingItem ? 'Edit Menu Dish' : 'Add New Menu Dish'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#666666] hover:text-[#1A1A1A]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#666666] mb-1 font-semibold">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. Royal Awadhi Biryani"
                  className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#666666] mb-1 font-semibold">Category *</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus cursor-pointer font-medium"
                  >
                    {categories.filter((c) => c !== 'ALL').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#666666] mb-1 font-semibold">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                    placeholder="750"
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                  />
                </div>

                <div>
                  <label className="block text-[#666666] mb-1 font-semibold">Prep Time</label>
                  <input
                    type="text"
                    value={formState.prepTime}
                    onChange={(e) => setFormState({ ...formState, prepTime: e.target.value })}
                    placeholder="15-20 mins"
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#666666] mb-1 font-semibold">Description</label>
                <textarea
                  rows="3"
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Ingredients and culinary notes..."
                  className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus resize-none"
                />
              </div>

              {/* Image Input Options */}
              <div className="space-y-2 pt-2 border-t border-[#E8E4DE]">
                <label className="block text-[#C5A059] font-bold">Image Source</label>

                {previewImage && (
                  <div className="w-full h-28 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] overflow-hidden mb-2 relative">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#666666] text-[10px] mb-1 font-semibold">Upload Local Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2 text-xs text-[#666666] file:bg-[#C5A059] file:text-white file:border-0 file:rounded-lg file:px-2.5 file:py-1 file:font-semibold file:cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] text-[10px] mb-1 font-semibold">OR Image URL</label>
                    <input
                      type="text"
                      value={formState.imageUrl}
                      onChange={(e) => {
                        setFormState({ ...formState, imageUrl: e.target.value });
                        setPreviewImage(e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[#1A1A1A] bg-[#FAF8F4] p-2.5 rounded-xl border border-[#E8E4DE]">
                  <input
                    type="checkbox"
                    checked={formState.isVeg}
                    onChange={(e) => setFormState({ ...formState, isVeg: e.target.checked })}
                    className="accent-[#C5A059] w-4 h-4"
                  />
                  <span className="font-semibold text-xs">Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#1A1A1A] bg-[#FAF8F4] p-2.5 rounded-xl border border-[#E8E4DE]">
                  <input
                    type="checkbox"
                    checked={formState.isAvailable}
                    onChange={(e) => setFormState({ ...formState, isAvailable: e.target.checked })}
                    className="accent-[#C5A059] w-4 h-4"
                  />
                  <span className="font-semibold text-xs">Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#1A1A1A] bg-[#FAF8F4] p-2.5 rounded-xl border border-[#E8E4DE]">
                  <input
                    type="checkbox"
                    checked={formState.isFeatured}
                    onChange={(e) => setFormState({ ...formState, isFeatured: e.target.checked })}
                    className="accent-[#C5A059] w-4 h-4"
                  />
                  <span className="font-semibold text-xs">Featured ★</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E4DE]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#666666] hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] transition-all cursor-pointer shadow-2xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E4DE] rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-scale">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#1A1A1A] font-bold mb-1">Delete Menu Dish?</h3>
              <p className="text-xs text-[#666666]">
                Are you sure you want to delete <strong className="text-[#1A1A1A]">{itemToDelete.name}</strong>?
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
                Delete Dish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
