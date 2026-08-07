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
    <div className="min-h-screen bg-[#07120c] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e9c176]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Forgot Password Card */}
      <div className="w-full max-w-md bg-[#0d1c13] gold-border rounded-2xl p-8 md:p-10 shadow-2xl relative z-10 animate-fadeIn">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[#e9c176]/40 bg-[#14281c] mb-4 text-[#e9c176] shadow-[0_0_15px_rgba(233,193,118,0.15)]">
            <span className="material-symbols-outlined text-3xl">lock_reset</span>
          </div>
          <h1 className="font-headline-lg text-2xl md:text-3xl text-[#e9c176] tracking-wider font-serif">
            FORGOT PASSWORD
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#a0998e] mt-1 font-sans">
            MAYURA ADMIN RECOVERY
          </p>
        </div>

        <p className="text-xs text-[#a0998e] leading-relaxed mb-6 text-center">
          Enter your registered admin email address below. We will send you a secure, single-use password reset link valid for <strong>15 minutes</strong>.
        </p>

        {successMsg && (
          <div className="mb-6 bg-emerald-950/50 border border-emerald-500/40 rounded-xl p-4 text-emerald-400 text-xs text-center space-y-1">
            <span className="material-symbols-outlined text-2xl block mx-auto text-emerald-400 mb-1">mark_email_read</span>
            <p className="font-semibold">{successMsg}</p>
            <p className="text-[11px] text-emerald-400/80 pt-1">Please check your email inbox and follow the instructions.</p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 bg-red-950/40 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#e9c176] mb-2 font-medium">
                Registered Admin Email
              </label>
              <div className="relative custom-focus border border-[#e9c176]/30 rounded-xl bg-[#08140c] transition-all">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mayura.com"
                  className="w-full h-12 bg-transparent px-4 pl-11 text-on-surface text-sm focus:outline-none"
                />
                <span className="material-symbols-outlined absolute left-3.5 top-3 text-sm text-[#a0998e]">
                  mail
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#e9c176] text-[#0f1f15] font-semibold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#ffdea5] hover:shadow-[0_0_20px_rgba(233,193,118,0.35)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-[#0f1f15]/20 border-t-[#0f1f15] animate-spin" />
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

        <div className="mt-8 text-center text-xs text-[#a0998e] border-t border-[#e9c176]/10 pt-6">
          <Link to="/admin" className="text-[#e9c176] hover:underline font-semibold flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Admin Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
