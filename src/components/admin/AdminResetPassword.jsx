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
      <div className="min-h-screen bg-[#07120c] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full max-w-md bg-[#0d1c13] gold-border rounded-2xl p-8 shadow-2xl text-center space-y-4">
          <span className="material-symbols-outlined text-4xl text-rose-400">error</span>
          <h2 className="font-serif text-xl text-[#e6e2dd] font-bold">Invalid Reset Link</h2>
          <p className="text-xs text-[#a0998e]">
            No password reset token was provided in the link. Please request a new password reset link.
          </p>
          <Link
            to="/admin/forgot-password"
            className="inline-block px-6 py-3 bg-[#e9c176] text-[#0f1f15] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdea5] transition-all"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07120c] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e9c176]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Reset Password Card */}
      <div className="w-full max-w-md bg-[#0d1c13] gold-border rounded-2xl p-8 md:p-10 shadow-2xl relative z-10 animate-fadeIn">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[#e9c176]/40 bg-[#14281c] mb-4 text-[#e9c176] shadow-[0_0_15px_rgba(233,193,118,0.15)]">
            <span className="material-symbols-outlined text-3xl">key</span>
          </div>
          <h1 className="font-headline-lg text-2xl md:text-3xl text-[#e9c176] tracking-wider font-serif">
            RESET PASSWORD
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#a0998e] mt-1 font-sans">
            SET NEW ADMIN CREDENTIALS
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-950/40 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#e9c176] mb-2 font-medium">
              New Password
            </label>
            <div className="relative custom-focus border border-[#e9c176]/30 rounded-xl bg-[#08140c] transition-all">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New strong password..."
                className="w-full h-12 bg-transparent px-4 pl-11 pr-11 text-on-surface text-sm focus:outline-none"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-sm text-[#a0998e]">
                lock
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-sm text-[#a0998e] hover:text-[#e9c176]"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#e9c176] mb-2 font-medium">
              Confirm New Password
            </label>
            <div className="relative custom-focus border border-[#e9c176]/30 rounded-xl bg-[#08140c] transition-all">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password..."
                className="w-full h-12 bg-transparent px-4 pl-11 text-on-surface text-sm focus:outline-none"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-sm text-[#a0998e]">
                verified_user
              </span>
            </div>
          </div>

          {/* Live Validation Checklist */}
          <div className="bg-[#07140c] border border-[#e9c176]/20 rounded-xl p-4 space-y-2 text-[11px]">
            <span className="text-[#a0998e] font-semibold uppercase tracking-wider block mb-1">
              Password Requirements:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-[#a0998e]'}`}>
                <span className="material-symbols-outlined text-sm">
                  {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>8+ Characters</span>
              </div>

              <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-400' : 'text-[#a0998e]'}`}>
                <span className="material-symbols-outlined text-sm">
                  {hasUppercase ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Uppercase (A-Z)</span>
              </div>

              <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-400' : 'text-[#a0998e]'}`}>
                <span className="material-symbols-outlined text-sm">
                  {hasLowercase ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Lowercase (a-z)</span>
              </div>

              <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-[#a0998e]'}`}>
                <span className="material-symbols-outlined text-sm">
                  {hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Number (0-9)</span>
              </div>

              <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400' : 'text-[#a0998e]'}`}>
                <span className="material-symbols-outlined text-sm">
                  {hasSpecial ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Special Char (@$!%*)</span>
              </div>

              <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-400' : 'text-[#a0998e]'}`}>
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
            className="w-full py-4 bg-[#e9c176] text-[#0f1f15] font-semibold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#ffdea5] hover:shadow-[0_0_20px_rgba(233,193,118,0.35)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-[#0f1f15]/20 border-t-[#0f1f15] animate-spin" />
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

        <div className="mt-8 text-center text-xs text-[#a0998e] border-t border-[#e9c176]/10 pt-6">
          <Link to="/admin" className="text-[#e9c176] hover:underline font-semibold">
            Cancel and Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
