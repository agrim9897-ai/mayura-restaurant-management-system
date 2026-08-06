import React, { useState } from 'react';

export default function AdminRestaurantSettings({ settings, setSettings }) {
  const [formData, setFormData] = useState({ ...settings });
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setSettings(formData);
      setIsSaving(false);
      setToastMessage('Restaurant settings updated successfully!');
      setTimeout(() => setToastMessage(''), 3500);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#e9c176] text-[#0f1f15] font-semibold text-xs px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-[#0d1c13] gold-border rounded-2xl p-6 md:p-8 space-y-6">
        <div className="border-b border-[#e9c176]/15 pb-4">
          <h2 className="font-serif text-xl text-[#e9c176] font-bold">Restaurant Profile & Details</h2>
          <p className="text-xs text-[#a0998e]">
            Update your public restaurant contact, location, social links, and operating hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e9c176]">
              Basic Information
            </h3>

            <div>
              <label className="block text-[#a0998e] mb-1 font-medium">Restaurant Name</label>
              <input
                type="text"
                required
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Primary Phone Number</label>
                <input
                  type="text"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Official Contact Email</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#a0998e] mb-1 font-medium">Physical Address</label>
              <textarea
                rows="2"
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus resize-none"
              />
            </div>
          </div>

          <hr className="border-[#e9c176]/10" />

          {/* Operating Hours */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e9c176]">
              Operating Hours
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Opening Time</label>
                <input
                  type="text"
                  required
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  placeholder="11:00 AM"
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Closing Time</label>
                <input
                  type="text"
                  required
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  placeholder="11:30 PM"
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#e9c176]/10" />

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e9c176]">
              Social Media Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Instagram URL</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Facebook URL</label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-[#e9c176]/15 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-[#e9c176] text-[#0f1f15] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-[#0f1f15]/20 border-t-[#0f1f15] animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
