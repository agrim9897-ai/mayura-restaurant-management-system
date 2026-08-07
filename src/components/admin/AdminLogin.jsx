import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../services/api/auth.service';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await loginAdmin({ email, password });
      if (response && response.success && response.data) {
        // Store token and user in AuthContext + localStorage
        login(response.data.token, response.data.user);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setErrorMsg(response?.message || 'Invalid login credentials');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show nothing while checking existing session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07120c] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-[#e9c176]">
          <div className="w-12 h-12 rounded-full border-2 border-[#e9c176]/20 border-t-[#e9c176] animate-spin" />
          <p className="text-xs uppercase tracking-[0.2em]">Checking Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07120c] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e9c176]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0d1c13] gold-border rounded-2xl p-8 md:p-10 shadow-2xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[#e9c176]/40 bg-[#14281c] mb-4 text-[#e9c176] shadow-[0_0_15px_rgba(233,193,118,0.15)]">
            <span className="material-symbols-outlined text-3xl">restaurant</span>
          </div>
          <h1 className="font-headline-lg text-2xl md:text-3xl text-[#e9c176] tracking-wider font-serif">
            MAYURA
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#a0998e] mt-1 font-sans">
            FINE CUISINE • ADMIN PORTAL
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-red-950/40 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#e9c176] mb-2 font-medium">
              Admin Email
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

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#e9c176] mb-2 font-medium">
              Password
            </label>
            <div className="relative custom-focus border border-[#e9c176]/30 rounded-xl bg-[#08140c] transition-all">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 bg-transparent px-4 pl-11 text-on-surface text-sm focus:outline-none"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-sm text-[#a0998e]">
                lock
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
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Enter Admin Dashboard</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-[#a0998e]/70 border-t border-[#e9c176]/10 pt-6">
          Mayura Restaurant Management System v1.0
        </div>
      </div>
    </div>
  );
}
