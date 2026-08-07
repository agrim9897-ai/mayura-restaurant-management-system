import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getAdminProfile,
  updateAdminProfileApi,
  changeAdminPasswordApi,
} from '../../services/api/auth.service';

export default function AdminProfile() {
  const { user, login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'info';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 00000',
    avatarUrl: user?.avatarUrl || '',
    role: 'Admin',
    status: 'Active',
    lastLogin: null,
    createdAt: null,
    emailNotifications: true,
    reservationNotifs: true,
    preferredLanguage: 'English (US)',
  });

  // Avatar Upload / Preview State
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Password Change Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  // Load Profile from backend
  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const data = await getAdminProfile();
        if (data) {
          setProfileData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '+91 98765 00000',
            avatarUrl: data.avatarUrl || '',
            role: data.role || 'Admin',
            status: data.status || 'Active',
            lastLogin: data.lastLogin || null,
            createdAt: data.createdAt || null,
            emailNotifications: data.emailNotifications ?? true,
            reservationNotifs: data.reservationNotifs ?? true,
            preferredLanguage: data.preferredLanguage || 'English (US)',
          });
          setAvatarPreview(data.avatarUrl || '');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    setSelectedAvatarFile(null);
    setAvatarPreview('');
    setProfileData((prev) => ({ ...prev, avatarUrl: '' }));
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      let payload;
      if (selectedAvatarFile) {
        const formData = new FormData();
        formData.append('avatar', selectedAvatarFile);
        formData.append('name', profileData.name);
        formData.append('phone', profileData.phone);
        formData.append('emailNotifications', profileData.emailNotifications);
        formData.append('reservationNotifs', profileData.reservationNotifs);
        formData.append('preferredLanguage', profileData.preferredLanguage);
        payload = formData;
      } else {
        payload = {
          name: profileData.name,
          phone: profileData.phone,
          avatarUrl: profileData.avatarUrl,
          emailNotifications: profileData.emailNotifications,
          reservationNotifs: profileData.reservationNotifs,
          preferredLanguage: profileData.preferredLanguage,
        };
      }

      const updated = await updateAdminProfileApi(payload);
      setProfileData((prev) => ({ ...prev, ...updated }));
      if (updated.avatarUrl) setAvatarPreview(updated.avatarUrl);

      // Refresh Auth Context user
      const existingToken = localStorage.getItem('adminToken');
      if (existingToken) {
        login(existingToken, {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          avatarUrl: updated.avatarUrl,
        });
      }

      showToast('Profile information updated successfully!');
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Password validation rules
  const hasMinLength = passwordForm.newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordForm.newPassword);
  const hasLowercase = /[a-z]/.test(passwordForm.newPassword);
  const hasNumber = /\d/.test(passwordForm.newPassword);
  const hasSpecial = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordForm.newPassword);
  const passwordsMatch = passwordForm.newPassword && passwordForm.newPassword === passwordForm.confirmPassword;

  const isPasswordFormValid =
    passwordForm.currentPassword &&
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial &&
    passwordsMatch;

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!isPasswordFormValid) {
      setPasswordError('Please satisfy all password complexity criteria.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await changeAdminPasswordApi(passwordForm);
      showToast(res.message || 'Password changed successfully!');
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setIsSaving(false);
    }
  };

  const navTabs = [
    { id: 'info', label: 'Personal Information', icon: 'account_circle' },
    { id: 'security', label: 'Security & Password', icon: 'security' },
    { id: 'settings', label: 'Account Preferences', icon: 'tune' },
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

      {/* Page Title & Breadcrumb Header */}
      <div className="border-b border-[#E8E4DE]/60 pb-5">
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] tracking-tight">
          Admin Profile & Security
        </h1>
        <p className="text-xs text-[#666666] font-medium mt-1">
          Manage personal credentials, security credentials, multi-factor settings, and system preferences.
        </p>
      </div>

      {/* GitHub / Vercel Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Navigation Bar (3 cols) */}
        <div className="md:col-span-3 saas-card p-2 space-y-1 sticky top-20">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchParams({ tab: tab.id });
              }}
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
        <div className="md:col-span-9 space-y-6">
          {/* Top Admin Summary Card */}
          <div className="saas-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar Preview */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-[#C5A059] text-white font-bold text-2xl flex items-center justify-center border-2 border-[#E8E4DE] shadow-md overflow-hidden flex-shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={profileData.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{(profileData.name || 'A')[0].toUpperCase()}</span>
                )}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">{profileData.name || 'Administrator'}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {profileData.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF6EE] text-[#C5A059] border border-[#C5A059]/30">
                    {profileData.role}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#666666] font-medium">{profileData.email}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-[11px] text-[#666666]">
                <span>
                  Last Login:{' '}
                  <strong className="text-[#1A1A1A]">
                    {profileData.lastLogin
                      ? new Date(profileData.lastLogin).toLocaleString()
                      : 'Active Session'}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Member Since:{' '}
                  <strong className="text-[#1A1A1A]">
                    {profileData.createdAt
                      ? new Date(profileData.createdAt).toLocaleDateString()
                      : '2026'}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* TAB 1: Personal Information */}
          {activeTab === 'info' && (
            <div className="saas-card p-6 md:p-8 space-y-6 animate-fadeIn">
              <div className="border-b border-[#E8E4DE] pb-4">
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Personal Information</h3>
                <p className="text-xs text-[#666666] mt-0.5">Update primary identity details and contact information.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                {/* Photo Upload Controls */}
                <div className="space-y-3 pt-1 border-b border-[#E8E4DE] pb-5">
                  <label className="block text-[#C5A059] font-bold">Profile Photo</label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="px-4 py-2 bg-[#FAF8F4] border border-[#E8E4DE] text-[#1A1A1A] font-semibold text-xs rounded-xl hover:bg-[#EFE9DF] cursor-pointer transition-colors">
                      Upload New Image
                      <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                    </label>

                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-colors"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-1.5 font-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1.5 font-semibold">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[#666666] font-semibold">Email Address (Read-only)</label>
                      <span className="material-symbols-outlined text-xs text-[#666666]">lock</span>
                    </div>
                    <input
                      type="email"
                      readOnly
                      disabled
                      value={profileData.email}
                      className="w-full bg-[#FAF8F4]/60 border border-[#E8E4DE] rounded-xl p-2.5 text-[#666666] font-medium text-xs cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[#666666] font-semibold">System Role</label>
                      <span className="material-symbols-outlined text-xs text-[#666666]">verified</span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={profileData.role}
                      className="w-full bg-[#FAF8F4]/60 border border-[#E8E4DE] rounded-xl p-2.5 text-[#C5A059] font-bold text-xs uppercase tracking-wider cursor-not-allowed"
                    />
                  </div>
                </div>

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
                        <span>Save Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Security & Password */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Password Section Card */}
              <div className="saas-card p-6 md:p-8 space-y-5">
                <div className="border-b border-[#E8E4DE] pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Authentication Password</h3>
                    <p className="text-xs text-[#666666] mt-0.5">Security credentials for accessing the Mayura Admin Dashboard.</p>
                  </div>

                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-4 py-2 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] transition-all cursor-pointer shadow-2xs flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">key</span>
                    <span>Change Password</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl text-xs">
                  <div>
                    <span className="text-[#666666] font-semibold block mb-0.5">Password</span>
                    <span className="font-mono text-[#1A1A1A] font-bold tracking-widest text-sm">••••••••••••</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    Protected
                  </span>
                </div>
              </div>

              {/* Two-Factor Authentication Card */}
              <div className="saas-card p-6 md:p-8 space-y-4">
                <div className="border-b border-[#E8E4DE] pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Two-Factor Authentication (2FA)</h3>
                    <p className="text-xs text-[#666666] mt-0.5">Add an extra layer of security to your admin login with TOTP authenticator apps.</p>
                  </div>
                  <span className="px-3 py-1 bg-[#FAF6EE] text-[#C5A059] border border-[#C5A059]/30 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Coming Soon
                  </span>
                </div>
              </div>

              {/* Active Session Info Card */}
              <div className="saas-card p-6 md:p-8 space-y-4">
                <div className="border-b border-[#E8E4DE] pb-4">
                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Active Logged-In Sessions</h3>
                  <p className="text-xs text-[#666666] mt-0.5">Devices currently authenticated into this admin account.</p>
                </div>

                <div className="p-4 bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E4DE] flex items-center justify-center text-[#C5A059]">
                      <span className="material-symbols-outlined text-xl">laptop_mac</span>
                    </div>
                    <div>
                      <div className="font-bold text-[#1A1A1A] flex items-center gap-2">
                        <span>Current Browser Session</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Now" />
                      </div>
                      <div className="text-[11px] text-[#666666]">
                        {navigator.userAgent.includes('Chrome') ? 'Google Chrome' : 'Web Browser'} • Localhost (127.0.0.1)
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    Current Device
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Account Settings & Preferences */}
          {activeTab === 'settings' && (
            <div className="saas-card p-6 md:p-8 space-y-6 animate-fadeIn">
              <div className="border-b border-[#E8E4DE] pb-4">
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">System Preferences & Notifications</h3>
                <p className="text-xs text-[#666666] mt-0.5">Customize locale settings and operational alert preferences.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-1.5 font-semibold">Preferred Language</label>
                    <select
                      value={profileData.preferredLanguage}
                      onChange={(e) => setProfileData({ ...profileData, preferredLanguage: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus font-medium cursor-pointer"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="English (UK)">English (UK)</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-1.5 font-semibold">Theme Mode</label>
                    <select
                      disabled
                      value="Warm White Minimal Luxury"
                      className="w-full bg-[#FAF8F4]/60 border border-[#E8E4DE] rounded-xl p-2.5 text-[#666666] font-medium cursor-not-allowed"
                    >
                      <option value="Warm White Minimal Luxury">Warm White Minimal Luxury (Default)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#E8E4DE]">
                  <h4 className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">Notification Alerts</h4>

                  <label className="flex items-center justify-between p-3.5 bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl cursor-pointer">
                    <div>
                      <span className="font-bold text-[#1A1A1A] block">Email Notifications</span>
                      <span className="text-[11px] text-[#666666]">Receive email updates for new guest messages and inquiry digests.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.emailNotifications}
                      onChange={(e) => setProfileData({ ...profileData, emailNotifications: e.target.checked })}
                      className="accent-[#C5A059] w-5 h-5 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl cursor-pointer">
                    <div>
                      <span className="font-bold text-[#1A1A1A] block">Reservation Notifications</span>
                      <span className="text-[11px] text-[#666666]">Instant alerts whenever a customer books or modifies a table.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.reservationNotifs}
                      onChange={(e) => setProfileData({ ...profileData, reservationNotifs: e.target.checked })}
                      className="accent-[#C5A059] w-5 h-5 cursor-pointer"
                    />
                  </label>
                </div>

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
                        <span>Save Preferences</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E4DE] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale">
            <div className="flex items-center justify-between border-b border-[#E8E4DE] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Change Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-[#666666] hover:text-[#1A1A1A]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {passwordError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs text-center font-medium">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#666666] mb-1 font-semibold">Current Password *</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                />
              </div>

              <div>
                <label className="block text-[#666666] mb-1 font-semibold">New Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 pr-10 text-[#1A1A1A] focus:outline-none custom-focus"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-sm text-[#666666] hover:text-[#1A1A1A]"
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#666666] mb-1 font-semibold">Confirm New Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-2.5 text-[#1A1A1A] focus:outline-none custom-focus"
                />
              </div>

              {/* Password Complexity Checklist */}
              <div className="bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-3 space-y-1.5 text-[11px]">
                <span className="text-[#666666] font-semibold uppercase tracking-wider block mb-1">
                  Password Requirements:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-[#666666]'}`}>
                    <span className="material-symbols-outlined text-sm">
                      {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>8+ Characters</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-700 font-semibold' : 'text-[#666666]'}`}>
                    <span className="material-symbols-outlined text-sm">
                      {hasUppercase ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>Uppercase (A-Z)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-700 font-semibold' : 'text-[#666666]'}`}>
                    <span className="material-symbols-outlined text-sm">
                      {hasLowercase ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>Lowercase (a-z)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-[#666666]'}`}>
                    <span className="material-symbols-outlined text-sm">
                      {hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>Number (0-9)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-700 font-semibold' : 'text-[#666666]'}`}>
                    <span className="material-symbols-outlined text-sm">
                      {hasSpecial ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>Special Char (@$!%*)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-700 font-semibold' : 'text-[#666666]'}`}>
                    <span className="material-symbols-outlined text-sm">
                      {passwordsMatch ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>Passwords Match</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E4DE] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#666666] hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !isPasswordFormValid}
                  className="px-5 py-2.5 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
