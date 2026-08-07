import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/api/auth.service';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await forgotPassword({ email });
      setSuccessMsg(
        response?.message ||
          'If an account exists with that email, a password reset link has been sent.'
      );
      setEmail('');
    } catch (err) {
      // Security mandate: generic message even on error or rate-limit notice
      setErrorMsg(
        err.message || 'If an account exists with that email, a password reset link has been sent.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4 select-none">
      {/* Centered Luxury Card */}
      <div className="w-full max-w-md bg-white border border-[#E8E4DE] rounded-2xl p-8 md:p-10 shadow-xl space-y-6">
        {/* Editorial Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] text-[#C5A059] mb-1">
            <span className="material-symbols-outlined text-2xl">lock_reset</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#666666] font-medium">
            Account Access Recovery
          </p>
        </div>

        <p className="text-xs text-[#666666] leading-relaxed text-center">
          Enter your registered admin email address. We will send you a secure reset link valid for <strong>15 minutes</strong>.
        </p>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-xs text-center space-y-1">
            <span className="material-symbols-outlined text-2xl block mx-auto text-emerald-600 mb-1">mark_email_read</span>
            <p className="font-bold">{successMsg}</p>
            <p className="text-[11px] text-emerald-700/80 pt-1">Please check your email inbox and follow the link.</p>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-rose-700 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#666666] mb-1.5 font-semibold">
                Registered Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mayura.com"
                  className="w-full h-11 bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl px-3.5 pl-10 text-[#1A1A1A] text-xs focus:outline-none custom-focus font-medium"
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-sm text-[#666666]">
                  mail
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Dispatching Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-[#666666] border-t border-[#E8E4DE] pt-4">
          <Link to="/admin" className="text-[#C5A059] hover:underline font-semibold flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Admin Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
