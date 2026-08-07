import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginAdmin } from '../../services/api/auth.service';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

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
    setSuccessMsg('');

    try {
      const response = await loginAdmin({ email, password });
      if (response && response.success && response.data) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-[#666666]">
          <div className="w-8 h-8 rounded-full border-2 border-[#E8E4DE] border-t-[#C5A059] animate-spin" />
          <p className="text-xs font-semibold tracking-wider uppercase text-[#1A1A1A]">Checking Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-4 select-none">
      {/* Centered Luxury Card */}
      <div className="w-full max-w-md bg-white border border-[#E8E4DE] rounded-2xl p-8 md:p-10 shadow-xl space-y-6">
        {/* Minimal Editorial Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FAF8F4] border border-[#E8E4DE] text-[#C5A059] mb-1">
            <span className="material-symbols-outlined text-2xl">restaurant</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Mayura
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#666666] font-medium">
            Admin Portal Access
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-emerald-800 text-xs text-center flex items-center justify-center gap-2 font-medium">
            <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-rose-700 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#666666] mb-1.5 font-semibold">
              Admin Email Address
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

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[#666666] font-semibold">
                Password
              </label>
              <Link
                to="/admin/forgot-password"
                className="text-xs text-[#C5A059] hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 bg-[#FAF8F4] border border-[#E8E4DE] rounded-xl px-3.5 pl-10 pr-10 text-[#1A1A1A] text-xs focus:outline-none custom-focus font-medium"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-sm text-[#666666]">
                lock
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-[#666666] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-base">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
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
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-[11px] text-[#666666]/70 border-t border-[#E8E4DE] pt-4">
          Mayura Restaurant Management System v1.0
        </div>
      </div>
    </div>
  );
}
