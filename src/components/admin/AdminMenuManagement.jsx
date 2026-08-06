import React, { useState } from 'react';

export default function AdminMenuManagement({ menuItems, setMenuItems }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const categories = ['ALL', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Form state for add/edit modal
  const [formState, setFormState] = useState({
    name: '',
    category: 'Starters',
    price: '',
    description: '',
    isVeg: true,
    isAvailable: true,
    imageUrl: '',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormState({
      name: '',
      category: 'Starters',
      price: '',
      description: '',
      isVeg: true,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormState({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      imageUrl: item.imageUrl || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (editingItem) {
      // Edit existing
      setMenuItems((prev) =>
        prev.map((it) =>
          it.id === editingItem.id
            ? { ...it, ...formState, price: Number(formState.price) }
            : it
        )
      );
      showToast(`Updated "${formState.name}"`);
    } else {
      // Add new
      const newItem = {
        id: `MENU-0${menuItems.length + 1}`,
        ...formState,
        price: Number(formState.price),
      };
      setMenuItems((prev) => [newItem, ...prev]);
      showToast(`Added "${formState.name}" to menu`);
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id, name) => {
    setMenuItems((prev) => prev.filter((it) => it.id !== id));
    showToast(`Deleted "${name}"`);
  };

  const handleToggleAvailability = (id) => {
    setMenuItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, isAvailable: !it.isAvailable } : it
      )
    );
  };

  const filtered = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#e9c176] text-[#0f1f15] font-semibold text-xs px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Controls */}
      <div className="bg-[#0d1c13] gold-border rounded-2xl p-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#e9c176] text-[#0f1f15] shadow-lg'
                  : 'bg-[#07140c] text-[#a0998e] hover:text-[#e9c176] border border-[#e9c176]/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Add Button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-sm text-[#a0998e]">
              search
            </span>
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl pl-9 pr-3 py-2 text-xs text-[#e6e2dd] focus:outline-none custom-focus"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-[#e9c176] text-[#0f1f15] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] shadow-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-[#0d1c13] gold-border rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#e9c176] transition-all duration-300 group ${
              !item.isAvailable ? 'opacity-65 grayscale-[30%]' : ''
            }`}
          >
            <div>
              {/* Item Image Banner */}
              <div className="h-44 relative overflow-hidden bg-[#07140c]">
                <img
                  src={item.imageUrl}
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
                <span className="text-[10px] text-[#e9c176] font-semibold uppercase tracking-wider block">
                  {item.category}
                </span>
                <p className="text-xs text-[#a0998e] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Actions & Availability Toggle */}
            <div className="p-5 pt-0 border-t border-[#e9c176]/10 mt-3 flex items-center justify-between">
              {/* Availability Toggle */}
              <button
                onClick={() => handleToggleAvailability(item.id)}
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
                  onClick={() => handleDelete(item.id, item.name)}
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

      {/* Add / Edit Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1c13] gold-border rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-scale">
            <div className="flex items-center justify-between border-b border-[#e9c176]/15 pb-4">
              <h3 className="font-serif text-xl text-[#e9c176] font-bold">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
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
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. Royal Dum Biryani"
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#e9c176] mb-1 font-medium">
                    Category
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none cursor-pointer custom-focus"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#e9c176] mb-1 font-medium">
                    Price (₹)
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
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#e9c176] mb-1 font-medium">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Short description of ingredients..."
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus resize-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#e9c176] mb-1 font-medium">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formState.imageUrl}
                  onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[#e6e2dd]">
                  <input
                    type="checkbox"
                    checked={formState.isVeg}
                    onChange={(e) => setFormState({ ...formState, isVeg: e.target.checked })}
                    className="accent-[#e9c176] w-4 h-4"
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#e6e2dd]">
                  <input
                    type="checkbox"
                    checked={formState.isAvailable}
                    onChange={(e) => setFormState({ ...formState, isAvailable: e.target.checked })}
                    className="accent-[#e9c176] w-4 h-4"
                  />
                  <span>Currently Available</span>
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
                  className="px-6 py-2.5 rounded-xl bg-[#e9c176] text-[#0f1f15] font-bold uppercase tracking-wider hover:bg-[#ffdea5] transition-all cursor-pointer shadow-lg"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
