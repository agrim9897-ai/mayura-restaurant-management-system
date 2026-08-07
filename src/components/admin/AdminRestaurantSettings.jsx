import React, { useState, useEffect } from 'react';
import { updateSettings } from '../../services/api/settings.service';

export default function AdminRestaurantSettings({ settings, setSettings }) {
  const [formData, setFormData] = useState({ ...settings });
  const [logoFile, setLogoFile] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(settings?.logoUrl || '');
  const [heroPreview, setHeroPreview] = useState(settings?.heroImageUrl || '');

  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (settings) {
      setFormData({ ...settings });
      setLogoPreview(settings.logoUrl || '');
      setHeroPreview(settings.heroImageUrl || '');
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImageFile(file);
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      let payload;
      if (logoFile || heroImageFile) {
        const bodyFormData = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== undefined) {
            bodyFormData.append(key, formData[key]);
          }
        });
        if (logoFile) bodyFormData.append('logo', logoFile);
        if (heroImageFile) bodyFormData.append('heroImage', heroImageFile);
        payload = bodyFormData;
      } else {
        payload = formData;
      }

      const updated = await updateSettings(payload);
      setSettings(updated);
      setFormData(updated);
      if (updated.logoUrl) setLogoPreview(updated.logoUrl);
      if (updated.heroImageUrl) setHeroPreview(updated.heroImageUrl);

      setToastMessage('Restaurant settings updated successfully!');
      setTimeout(() => setToastMessage(''), 3500);
    } catch (err) {
      setToastMessage(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General & Branding', icon: 'domain' },
    { id: 'contact', label: 'Contact & Address', icon: 'call' },
    { id: 'hours', label: 'Operating Hours', icon: 'schedule' },
    { id: 'reservation', label: 'Reservation Policy', icon: 'event_seat' },
    { id: 'hero', label: 'Hero Banner & Footer', icon: 'article' },
    { id: 'social', label: 'Social Media Links', icon: 'share' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16 select-none max-w-6xl">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#e9c176] text-[#050d08] font-bold text-xs px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl text-[#e9c176] font-bold">Portal & Restaurant Settings</h2>
        <p className="text-xs text-[#a0998e]">
          Configure brand details, operating hours, capacity policies, and customer website copy.
        </p>
      </div>

      {/* GitHub/Vercel Layout: Left Nav Tabs + Right Content Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Vertical Navigation Bar (3 cols) */}
        <div className="md:col-span-3 saas-card p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#102418] text-[#e9c176] border border-[#e9c176]/20'
                  : 'text-[#a0998e] hover:bg-[#08170e] hover:text-[#e6e2dd]'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Form Container (9 cols) */}
        <div className="md:col-span-9 saas-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* TAB 1: General & Branding */}
            {activeTab === 'general' && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h3 className="text-sm font-bold text-[#e6e2dd]">General & Brand Details</h3>
                  <p className="text-xs text-[#a0998e]">Used across customer booking pages and receipts.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#a0998e] mb-1 font-medium">Restaurant Name *</label>
                    <input
                      type="text"
                      required
                      name="restaurantName"
                      value={formData.restaurantName || ''}
                      onChange={handleChange}
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus font-serif font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0998e] mb-1 font-medium">Brand Tagline</label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline || ''}
                      onChange={handleChange}
                      placeholder="Authentic Royal Indian Dining"
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Brand Story & Description</label>
                  <textarea
                    rows="3"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus leading-relaxed resize-none"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-[#e9c176]/10">
                  <label className="block text-[#e9c176] font-semibold">Restaurant Logo</label>
                  {logoPreview && (
                    <div className="w-20 h-20 rounded-xl bg-[#08170e] border border-[#e9c176]/20 p-2 flex items-center justify-center overflow-hidden mb-2">
                      <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#a0998e] text-[10px] mb-1">Upload File (Multer)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2 text-xs text-[#a0998e] file:bg-[#e9c176] file:text-[#050d08] file:border-0 file:rounded-lg file:px-2.5 file:py-1 file:font-semibold file:cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[#a0998e] text-[10px] mb-1">OR Image URL</label>
                      <input
                        type="text"
                        name="logoUrl"
                        value={formData.logoUrl || ''}
                        onChange={(e) => {
                          handleChange(e);
                          setLogoPreview(e.target.value);
                        }}
                        className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Contact & Address */}
            {activeTab === 'contact' && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h3 className="text-sm font-bold text-[#e6e2dd]">Contact Information & Address</h3>
                  <p className="text-xs text-[#a0998e]">Displayed on customer website footer & confirmation emails.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#a0998e] mb-1 font-medium">Primary Phone *</label>
                    <input
                      type="text"
                      required
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0998e] mb-1 font-medium">Official Email *</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Physical Address *</label>
                  <textarea
                    rows="3"
                    required
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Operating Hours */}
            {activeTab === 'hours' && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h3 className="text-sm font-bold text-[#e6e2dd]">Operating Hours</h3>
                  <p className="text-xs text-[#a0998e]">Sets active dining hours for public website reservations.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#a0998e] mb-1 font-medium">Opening Time</label>
                    <input
                      type="text"
                      name="openingTime"
                      value={formData.openingTime || ''}
                      onChange={handleChange}
                      placeholder="11:00 AM"
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0998e] mb-1 font-medium">Closing Time</label>
                    <input
                      type="text"
                      name="closingTime"
                      value={formData.closingTime || ''}
                      onChange={handleChange}
                      placeholder="11:30 PM"
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0998e] mb-1 font-medium">Weekend Hours</label>
                    <input
                      type="text"
                      name="weekendHours"
                      value={formData.weekendHours || ''}
                      onChange={handleChange}
                      placeholder="11:00 AM - 12:00 AM"
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Reservation Policy */}
            {activeTab === 'reservation' && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h3 className="text-sm font-bold text-[#e6e2dd]">Reservation Policy & Rules</h3>
                  <p className="text-xs text-[#a0998e]">Controls capacity boundaries and advance booking windows.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#a0998e] mb-1 font-medium">Max Guests per Table</label>
                    <input
                      type="number"
                      min="1"
                      name="maxGuestsPerTable"
                      value={formData.maxGuestsPerTable || 12}
                      onChange={handleChange}
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0998e] mb-1 font-medium">Notice Required (Hours)</label>
                    <input
                      type="number"
                      min="1"
                      name="reservationNoticeHours"
                      value={formData.reservationNoticeHours || 2}
                      onChange={handleChange}
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0998e] mb-1 font-medium">Advance Booking (Days)</label>
                    <input
                      type="number"
                      min="1"
                      name="advanceBookingDays"
                      value={formData.advanceBookingDays || 30}
                      onChange={handleChange}
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Hero Banner & Footer */}
            {activeTab === 'hero' && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h3 className="text-sm font-bold text-[#e6e2dd]">Hero Banner & Footer Copy</h3>
                  <p className="text-xs text-[#a0998e]">Controls customer landing page titles and footer summary.</p>
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Hero Headline</label>
                  <input
                    type="text"
                    name="heroTitle"
                    value={formData.heroTitle || ''}
                    onChange={handleChange}
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus font-serif font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Hero Subtitle</label>
                  <input
                    type="text"
                    name="heroSubtitle"
                    value={formData.heroSubtitle || ''}
                    onChange={handleChange}
                    className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-[#e9c176]/10">
                  <label className="block text-[#e9c176] font-semibold">Hero Background Image</label>
                  {heroPreview && (
                    <div className="w-full h-28 rounded-xl bg-[#08170e] border border-[#e9c176]/20 overflow-hidden mb-2">
                      <img src={heroPreview} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#a0998e] text-[10px] mb-1">Upload File (Multer)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageChange}
                        className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2 text-xs text-[#a0998e] file:bg-[#e9c176] file:text-[#050d08] file:border-0 file:rounded-lg file:px-2.5 file:py-1 file:font-semibold file:cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[#a0998e] text-[10px] mb-1">OR Image URL</label>
                      <input
                        type="text"
                        name="heroImageUrl"
                        value={formData.heroImageUrl || ''}
                        onChange={(e) => {
                          handleChange(e);
                          setHeroPreview(e.target.value);
                        }}
                        className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: Social Media Links */}
            {activeTab === 'social' && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h3 className="text-sm font-bold text-[#e6e2dd]">Social Media Links</h3>
                  <p className="text-xs text-[#a0998e]">Displayed on public footer & contact page.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#a0998e] mb-1 font-medium">Instagram</label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram || ''}
                      onChange={handleChange}
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0998e] mb-1 font-medium">Facebook</label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook || ''}
                      onChange={handleChange}
                      className="w-full bg-[#08170e] border border-[#e9c176]/20 rounded-xl p-2.5 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#e9c176]/10 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#e9c176] text-[#050d08] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-[#050d08]/20 border-t-[#050d08] animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
