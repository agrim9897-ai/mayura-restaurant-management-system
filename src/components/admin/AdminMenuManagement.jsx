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
    <div className="space-y-6 animate-fadeIn pb-8 select-none">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#e9c176] text-[#050d08] font-bold text-xs px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="saas-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-serif text-2xl text-[#e9c176] font-bold">Menu Catalog Management</h2>
            <p className="text-xs text-[#a0998e]">
              Manage culinary offerings, prices, dietary classifications, and kitchen availability.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-[#e9c176] text-[#050d08] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] shadow-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add Dish</span>
          </button>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 border-b border-[#e9c176]/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                categoryFilter === cat
                  ? 'bg-[#e9c176] text-[#050d08] border-[#e9c176]'
                  : 'bg-[#08170e] text-[#a0998e] border-[#e9c176]/20 hover:text-[#e6e2dd]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-6 relative">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-sm text-[#a0998e]">
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
              className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl pl-10 pr-4 py-2 text-xs text-[#e6e2dd] focus:outline-none custom-focus"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={vegFilter}
              onChange={(e) => {
                setVegFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl px-3 py-2 text-xs text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
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
              className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl px-3 py-2 text-xs text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
            >
              <option value="name_asc">Name: A - Z</option>
              <option value="name_desc">Name: Z - A</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Dishes */}
      {isLoading ? (
        <AdminSkeleton type="cards" count={6} />
      ) : items.length === 0 ? (
        <div className="saas-card p-12 text-center text-[#a0998e] space-y-2">
          <span className="material-symbols-outlined text-4xl text-[#e9c176]/30">restaurant_menu</span>
          <h3 className="font-serif text-lg text-[#e6e2dd] font-bold">No Menu Dishes Found</h3>
          <p className="text-xs">Adjust your search or category filter selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className={`saas-card overflow-hidden flex flex-col justify-between group hover:border-[#e9c176]/40 transition-all ${
                !item.isAvailable ? 'opacity-65 grayscale-[30%]' : ''
              }`}
            >
              <div>
                {/* Thumbnail Header */}
                <div className="h-44 relative overflow-hidden bg-[#07130b]">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09170e] via-transparent to-black/30" />

                  {/* Veg / Non-Veg Chip */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${
                      item.isVeg
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                        : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                    }`}
                  >
                    {item.isVeg ? '● VEG' : '▲ NON-VEG'}
                  </span>

                  {/* Price Tag */}
                  <span className="absolute bottom-3 right-3 bg-[#09170e]/90 text-[#e9c176] border border-[#e9c176]/30 font-serif font-bold text-base px-3 py-1 rounded-xl shadow-lg">
                    ₹{item.price}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-base text-[#e6e2dd] font-bold group-hover:text-[#e9c176] transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-[#a0998e]">
                    <span className="text-[#e9c176] font-semibold uppercase tracking-wider">{item.category}</span>
                    <span>•</span>
                    <span>⏱️ {item.prepTime || '15-20 mins'}</span>
                  </div>

                  <p className="text-xs text-[#a0998e] leading-relaxed line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Controls */}
              <div className="p-4 pt-0 border-t border-[#e9c176]/10 mt-3 flex items-center justify-between">
                <button
                  onClick={() => handleToggleAvailability(item.id, item.isAvailable, item.name)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                    item.isAvailable
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
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
                    className="p-1.5 rounded-lg text-[#a0998e] hover:text-[#e9c176] hover:bg-[#0c1b11] transition-colors cursor-pointer"
                    title="Edit Dish"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>

                  <button
                    onClick={() => {
                      setItemToDelete(item);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
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

      {/* Add / Edit Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09170e] border border-[#e9c176]/30 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-scale max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-[#e9c176]/10 pb-3">
              <h3 className="font-serif text-lg text-[#e9c176] font-bold">
                {editingItem ? 'Edit Menu Dish' : 'Add New Menu Dish'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#a0998e] hover:text-[#e6e2dd]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a0998e] mb-1 font-semibold">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. Royal Awadhi Biryani"
                  className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#a0998e] mb-1 font-semibold">Category *</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus cursor-pointer"
                  >
                    {categories.filter((c) => c !== 'ALL').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-semibold">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                    placeholder="750"
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-semibold">Prep Time</label>
                  <input
                    type="text"
                    value={formState.prepTime}
                    onChange={(e) => setFormState({ ...formState, prepTime: e.target.value })}
                    placeholder="15-20 mins"
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-semibold">Description</label>
                <textarea
                  rows="3"
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Ingredients and culinary notes..."
                  className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus resize-none"
                />
              </div>

              {/* Image Input Options */}
              <div className="space-y-2 pt-2 border-t border-[#e9c176]/10">
                <label className="block text-[#a0998e] font-semibold">Image Source</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#a0998e] text-[10px] mb-1">Upload File (Multer)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2 text-xs text-[#a0998e] file:bg-[#e9c176] file:text-[#050d08] file:border-0 file:rounded-lg file:px-2.5 file:py-1 file:font-semibold file:cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0998e] text-[10px] mb-1">OR Image URL</label>
                    <input
                      type="text"
                      value={formState.imageUrl}
                      onChange={(e) => {
                        setFormState({ ...formState, imageUrl: e.target.value });
                        setPreviewImage(e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[#e6e2dd] bg-[#08170e] p-2.5 rounded-xl border border-[#e9c176]/20">
                  <input
                    type="checkbox"
                    checked={formState.isVeg}
                    onChange={(e) => setFormState({ ...formState, isVeg: e.target.checked })}
                    className="accent-[#e9c176] w-4 h-4"
                  />
                  <span className="font-semibold text-xs">Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#e6e2dd] bg-[#08170e] p-2.5 rounded-xl border border-[#e9c176]/20">
                  <input
                    type="checkbox"
                    checked={formState.isAvailable}
                    onChange={(e) => setFormState({ ...formState, isAvailable: e.target.checked })}
                    className="accent-[#e9c176] w-4 h-4"
                  />
                  <span className="font-semibold text-xs">Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#e6e2dd] bg-[#08170e] p-2.5 rounded-xl border border-[#e9c176]/20">
                  <input
                    type="checkbox"
                    checked={formState.isFeatured}
                    onChange={(e) => setFormState({ ...formState, isFeatured: e.target.checked })}
                    className="accent-[#e9c176] w-4 h-4"
                  />
                  <span className="font-semibold text-xs">Featured ★</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e9c176]/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a0998e] hover:text-[#e6e2dd]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#e9c176] text-[#050d08] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] transition-all cursor-pointer"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09170e] border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-scale">
            <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#e6e2dd] font-bold mb-1">Delete Menu Dish?</h3>
              <p className="text-xs text-[#a0998e]">
                Are you sure you want to delete <strong className="text-[#e9c176]">{itemToDelete.name}</strong>?
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
                Delete Dish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
