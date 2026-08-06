import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@mayurafinecuisine.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/admin/dashboard');
    }, 500);
  };

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
                placeholder="admin@mayurafinecuisine.com"
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
            disabled={isLoading}
            className="w-full py-4 bg-[#e9c176] text-[#0f1f15] font-semibold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#ffdea5] hover:shadow-[0_0_20px_rgba(233,193,118,0.35)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-[#0f1f15]/20 border-t-[#0f1f15] animate-spin" />
                <span>Entering Portal...</span>
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
