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

      setToastMessage('Restaurant settings saved successfully!');
      setTimeout(() => setToastMessage(''), 3500);
    } catch (err) {
      setToastMessage(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General & Branding', icon: 'domain' },
    { id: 'contact', label: 'Contact & Location', icon: 'call' },
    { id: 'hours', label: 'Operating Hours', icon: 'schedule' },
    { id: 'reservation', label: 'Reservation Policy', icon: 'event_seat' },
    { id: 'hero', label: 'Hero Banner & Footer', icon: 'article' },
    { id: 'social', label: 'Social Media Links', icon: 'share' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16 select-none max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#C5A059] text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E8E4DE]/60 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-[#666666] font-medium mt-1">
            Manage public details, operating hours, capacity policies, and website copy.
          </p>
        </div>
      </div>

      {/* Apple / Vercel / GitHub Settings Layout: Left Nav + Right Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Navigation Bar (3 cols) */}
        <div className="md:col-span-3 saas-card p-2 space-y-1 sticky top-20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#EFE9DF] text-[#1A1A1A] font-semibold border border-[#E0D7C8] shadow-2xs'
                  : 'text-[#666666] hover:bg-[#FAF8F4] hover:text-[#1A1A1A]'
              }`}
            >
              <span className={`material-symbols-outlined text-base ${activeTab === tab.id ? 'text-[#C5A059]' : 'text-[#666666]'}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Content Panel (9 cols) */}
        <div className="md:col-span-9 saas-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* TAB 1: General & Branding */}
            {activeTab === 'general' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <h3 className="font-serif text-xl text-[#1A1A1A] font-bold">General Information & Branding</h3>
                  <p className="text-xs text-[#666666] mt-0.5">Displayed across guest reservation pages and invoices.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-1 font-semibold">Restaurant Name *</label>
                    <input
                      type="text"
                      required
                      name="restaurantName"
                      value={formData.restaurantName || ''}
                      onChange={handleChange}
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-serif font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-semibold">Brand Tagline</label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline || ''}
                      onChange={handleChange}
                      placeholder="Authentic Royal Indian Dining"
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#666666] mb-1 font-semibold">Brand Story & Description</label>
                  <textarea
                    rows="3"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-3 text-[#1A1A1A] focus:outline-none custom-focus leading-relaxed resize-none"
                  />
                </div>

                {/* Logo Section */}
                <div className="space-y-3 pt-3 border-t border-[#E8E4DE]">
                  <label className="block text-[#C5A059] font-bold">Restaurant Logo</label>
                  {logoPreview && (
                    <div className="w-20 h-20 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] p-2 flex items-center justify-center overflow-hidden mb-2">
                      <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#666666] text-[10px] mb-1 font-semibold">Upload Local Image File</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2 text-xs text-[#666666] file:bg-[#C5A059] file:text-white file:border-0 file:rounded-lg file:px-2.5 file:py-1 file:font-semibold file:cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] text-[10px] mb-1 font-semibold">OR Image URL</label>
                      <input
                        type="text"
                        name="logoUrl"
                        value={formData.logoUrl || ''}
                        onChange={(e) => {
                          handleChange(e);
                          setLogoPreview(e.target.value);
                        }}
                        className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Contact & Address */}
            {activeTab === 'contact' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <h3 className="font-serif text-xl text-[#1A1A1A] font-bold">Contact & Physical Location</h3>
                  <p className="text-xs text-[#666666] mt-0.5">Appears on public website footers and confirmation emails.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-1 font-semibold">Primary Phone *</label>
                    <input
                      type="text"
                      required
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-semibold">Official Email *</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#666666] mb-1 font-semibold">Physical Address *</label>
                  <textarea
                    rows="3"
                    required
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-3 text-[#1A1A1A] focus:outline-none custom-focus leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Operating Hours */}
            {activeTab === 'hours' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <h3 className="font-serif text-xl text-[#1A1A1A] font-bold">Operating Hours</h3>
                  <p className="text-xs text-[#666666] mt-0.5">Defines standard dining room availability.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-1 font-semibold">Opening Time</label>
                    <input
                      type="text"
                      name="openingTime"
                      value={formData.openingTime || ''}
                      onChange={handleChange}
                      placeholder="11:00 AM"
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-semibold">Closing Time</label>
                    <input
                      type="text"
                      name="closingTime"
                      value={formData.closingTime || ''}
                      onChange={handleChange}
                      placeholder="11:30 PM"
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-semibold">Weekend Hours</label>
                    <input
                      type="text"
                      name="weekendHours"
                      value={formData.weekendHours || ''}
                      onChange={handleChange}
                      placeholder="11:00 AM - 12:00 AM"
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Reservation Policy */}
            {activeTab === 'reservation' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <h3 className="font-serif text-xl text-[#1A1A1A] font-bold">Reservation Rules & Limits</h3>
                  <p className="text-xs text-[#666666] mt-0.5">Controls maximum party sizes and booking lead times.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-1 font-semibold">Max Guests per Table</label>
                    <input
                      type="number"
                      min="1"
                      name="maxGuestsPerTable"
                      value={formData.maxGuestsPerTable || 12}
                      onChange={handleChange}
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-semibold">Notice Required (Hours)</label>
                    <input
                      type="number"
                      min="1"
                      name="reservationNoticeHours"
                      value={formData.reservationNoticeHours || 2}
                      onChange={handleChange}
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-semibold">Advance Booking (Days)</label>
                    <input
                      type="number"
                      min="1"
                      name="advanceBookingDays"
                      value={formData.advanceBookingDays || 30}
                      onChange={handleChange}
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Hero Banner & Footer */}
            {activeTab === 'hero' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <h3 className="font-serif text-xl text-[#1A1A1A] font-bold">Hero Banner & Footer Copy</h3>
                  <p className="text-xs text-[#666666] mt-0.5">Controls public landing page headlines and footer summaries.</p>
                </div>

                <div>
                  <label className="block text-[#666666] mb-1 font-semibold">Hero Headline</label>
                  <input
                    type="text"
                    name="heroTitle"
                    value={formData.heroTitle || ''}
                    onChange={handleChange}
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-serif font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[#666666] mb-1 font-semibold">Hero Subtitle</label>
                  <input
                    type="text"
                    name="heroSubtitle"
                    value={formData.heroSubtitle || ''}
                    onChange={handleChange}
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                  />
                </div>

                <div className="space-y-3 pt-3 border-t border-[#E8E4DE]">
                  <label className="block text-[#C5A059] font-bold">Hero Background Image</label>
                  {heroPreview && (
                    <div className="w-full h-28 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] overflow-hidden mb-2">
                      <img src={heroPreview} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#666666] text-[10px] mb-1 font-semibold">Upload Local Image File</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageChange}
                        className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2 text-xs text-[#666666] file:bg-[#C5A059] file:text-white file:border-0 file:rounded-lg file:px-2.5 file:py-1 file:font-semibold file:cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] text-[10px] mb-1 font-semibold">OR Image URL</label>
                      <input
                        type="text"
                        name="heroImageUrl"
                        value={formData.heroImageUrl || ''}
                        onChange={(e) => {
                          handleChange(e);
                          setHeroPreview(e.target.value);
                        }}
                        className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: Social Media Links */}
            {activeTab === 'social' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <h3 className="font-serif text-xl text-[#1A1A1A] font-bold">Social Media Profiles</h3>
                  <p className="text-xs text-[#666666] mt-0.5">Displayed on public website contact section.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-1 font-semibold">Instagram URL</label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram || ''}
                      onChange={handleChange}
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1 font-semibold">Facebook URL</label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook || ''}
                      onChange={handleChange}
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button Container */}
            <div className="pt-4 border-t border-[#E8E4DE] flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] transition-all cursor-pointer shadow-2xs flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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
    </div>
  );
}
