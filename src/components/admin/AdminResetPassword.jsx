import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../../services/api/auth.service';

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const passwordsMatch = newPassword && newPassword === confirmPassword;

  const isFormValid =
    hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg('Password reset token is missing from the URL.');
      return;
    }
    if (!passwordsMatch) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!isFormValid) {
      setErrorMsg('Please ensure all password requirements are satisfied.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await resetPassword({ token, newPassword });
      const successMessage =
        response?.message || 'Password changed successfully. Please log in again.';

      // Redirect back to Admin Login page with success state
      navigate('/admin', {
        replace: true,
        state: { message: successMessage },
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4 select-none">
        <div className="w-full max-w-md bg-white border border-[#E8E4DE] rounded-2xl p-8 shadow-xl text-center space-y-4">
          <span className="material-symbols-outlined text-4xl text-rose-500">error</span>
          <h2 className="font-serif text-xl text-[#1A1A1A] font-bold">Invalid Reset Link</h2>
          <p className="text-xs text-[#666666]">
            No password reset token was provided in the link. Please request a new password reset link.
          </p>
          <Link
            to="/admin/forgot-password"
            className="inline-block px-6 py-2.5 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] transition-all"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4 select-none">
      {/* Centered Luxury Card */}
      <div className="w-full max-w-md bg-white border border-[#E8E4DE] rounded-2xl p-8 md:p-10 shadow-xl space-y-6">
        {/* Editorial Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] text-[#C5A059] mb-1">
            <span className="material-symbols-outlined text-2xl">key</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] tracking-tight">
            New Password
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#666666] font-medium">
            Set Secure Admin Password
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-rose-700 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* New Password */}
          <div>
            <label className="block text-[#666666] mb-1.5 font-semibold">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New strong password..."
                className="w-full h-11 bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl px-3.5 pl-10 pr-10 text-[#1A1A1A] text-xs focus:outline-none custom-focus font-medium"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-sm text-[#666666]">
                lock
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-[#666666] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[#666666] mb-1.5 font-semibold">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password..."
                className="w-full h-11 bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl px-3.5 pl-10 text-[#1A1A1A] text-xs focus:outline-none custom-focus font-medium"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-sm text-[#666666]">
                verified_user
              </span>
            </div>
          </div>

          {/* Live Validation Checklist */}
          <div className="bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl p-3.5 space-y-2 text-[11px]">
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

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="w-full py-3 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Save New Password</span>
                <span className="material-symbols-outlined text-sm">check</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#666666] border-t border-[#E8E4DE] pt-4">
          <Link to="/admin" className="text-[#C5A059] hover:underline font-semibold">
            Cancel and Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
