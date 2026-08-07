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
    e.preventDefault();
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

      setToastMessage('Restaurant settings saved to PostgreSQL!');
      setTimeout(() => setToastMessage(''), 3500);
    } catch (err) {
      setToastMessage(`Failed to save settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#e9c176] text-[#0f1f15] font-semibold text-xs px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-[#0d1c13] gold-border rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="border-b border-[#e9c176]/15 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-[#e9c176] font-bold">Restaurant System Settings</h2>
            <p className="text-xs text-[#a0998e]">
              Manage branding, contact info, operating hours, social links, hero copy, and policies.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#e9c176] text-[#0f1f15] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] shadow-lg transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-[#0f1f15]/20 border-t-[#0f1f15] animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">save</span>
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-[#e9c176]/15">
          {[
            { id: 'general', label: '🏢 General & Branding', icon: 'domain' },
            { id: 'contact', label: '📞 Contact & Address', icon: 'call' },
            { id: 'hours', label: '🕒 Operating Hours', icon: 'schedule' },
            { id: 'social', label: '🌐 Social Media', icon: 'share' },
            { id: 'reservation', label: '📅 Reservation Policy', icon: 'event_seat' },
            { id: 'hero', label: '✍️ Hero & Footer', icon: 'article' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#e9c176] text-[#0f1f15] font-bold shadow-md'
                  : 'bg-[#07140c] text-[#a0998e] hover:text-[#e9c176] border border-[#e9c176]/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* TAB 1: General Information & Branding */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#e9c176]">
                General Information & Branding
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Restaurant Name *</label>
                  <input
                    type="text"
                    required
                    name="restaurantName"
                    value={formData.restaurantName || ''}
                    onChange={handleChange}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus font-serif font-bold text-sm"
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
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
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
                  placeholder="Describe your culinary heritage and concept..."
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus resize-none"
                />
              </div>

              {/* Logo Upload / URL */}
              <div className="pt-2 space-y-2 border-t border-[#e9c176]/10">
                <label className="block text-[#e9c176] font-semibold">Restaurant Logo</label>

                {logoPreview && (
                  <div className="w-24 h-24 rounded-xl bg-[#07140c] border border-[#e9c176]/30 p-2 flex items-center justify-center overflow-hidden mb-2">
                    <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#a0998e] text-[11px] mb-1">Upload Logo File (Multer)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-2 text-xs text-[#a0998e] file:bg-[#e9c176] file:text-[#0f1f15] file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-semibold file:cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0998e] text-[11px] mb-1">OR Logo Image URL</label>
                    <input
                      type="text"
                      name="logoUrl"
                      value={formData.logoUrl || ''}
                      onChange={(e) => {
                        handleChange(e);
                        setLogoPreview(e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Contact & Location */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#e9c176]">
                Contact Information & Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Primary Phone Number *</label>
                  <input
                    type="text"
                    required
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Full Physical Address *</label>
                <textarea
                  rows="3"
                  required
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Operating Hours */}
          {activeTab === 'hours' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#e9c176]">
                Operating Hours
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Weekday Opening Time</label>
                  <input
                    type="text"
                    name="openingTime"
                    value={formData.openingTime || ''}
                    onChange={handleChange}
                    placeholder="11:00 AM"
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Weekday Closing Time</label>
                  <input
                    type="text"
                    name="closingTime"
                    value={formData.closingTime || ''}
                    onChange={handleChange}
                    placeholder="11:30 PM"
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
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
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Social Media Links */}
          {activeTab === 'social' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#e9c176]">
                Social Media Links
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Instagram URL</label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram || ''}
                    onChange={handleChange}
                    placeholder="https://instagram.com/mayurafinecuisine"
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Facebook URL</label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook || ''}
                    onChange={handleChange}
                    placeholder="https://facebook.com/mayurafinecuisine"
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Twitter / X URL</label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter || ''}
                    onChange={handleChange}
                    placeholder="https://twitter.com/mayura_cuisine"
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">TripAdvisor URL</label>
                  <input
                    type="url"
                    name="tripadvisor"
                    value={formData.tripadvisor || ''}
                    onChange={handleChange}
                    placeholder="https://tripadvisor.com/mayura"
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Reservation Policy */}
          {activeTab === 'reservation' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#e9c176]">
                Reservation Policy & Limits
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Max Guests per Table</label>
                  <input
                    type="number"
                    min="1"
                    name="maxGuestsPerTable"
                    value={formData.maxGuestsPerTable || 12}
                    onChange={handleChange}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
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
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
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
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Hero & Footer Content */}
          {activeTab === 'hero' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#e9c176]">
                Hero Banner & Footer Copy
              </h3>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Hero Banner Headline</label>
                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle || ''}
                  onChange={handleChange}
                  placeholder="Taste of Royal Heritage"
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus font-serif font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[#a0998e] mb-1 font-medium">Hero Subtitle</label>
                <input
                  type="text"
                  name="heroSubtitle"
                  value={formData.heroSubtitle || ''}
                  onChange={handleChange}
                  placeholder="Experience extraordinary flavors..."
                  className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                />
              </div>

              {/* Hero Image Upload */}
              <div className="pt-2 space-y-2 border-t border-[#e9c176]/10">
                <label className="block text-[#e9c176] font-semibold">Hero Background Image</label>

                {heroPreview && (
                  <div className="w-full h-32 rounded-xl bg-[#07140c] border border-[#e9c176]/30 overflow-hidden mb-2 relative">
                    <img src={heroPreview} alt="Hero Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#a0998e] text-[11px] mb-1">Upload Hero Image (Multer)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageChange}
                      className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-2 text-xs text-[#a0998e] file:bg-[#e9c176] file:text-[#0f1f15] file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-semibold file:cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0998e] text-[11px] mb-1">OR Hero Image URL</label>
                    <input
                      type="text"
                      name="heroImageUrl"
                      value={formData.heroImageUrl || ''}
                      onChange={(e) => {
                        handleChange(e);
                        setHeroPreview(e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-3 border-t border-[#e9c176]/10">
                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Footer About Summary</label>
                  <textarea
                    rows="2"
                    name="footerAbout"
                    value={formData.footerAbout || ''}
                    onChange={handleChange}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[#a0998e] mb-1 font-medium">Footer Copyright Text</label>
                  <input
                    type="text"
                    name="footerCopyright"
                    value={formData.footerCopyright || ''}
                    onChange={handleChange}
                    className="w-full bg-[#07140c] border border-[#e9c176]/30 rounded-xl p-3 text-[#e6e2dd] focus:outline-none custom-focus"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#e9c176]/15 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-[#e9c176] text-[#0f1f15] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-[#0f1f15]/20 border-t-[#0f1f15] animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>Save Restaurant Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
