import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute wrapper.
 * Redirects unauthenticated users to /admin (login page).
 * Shows a loading spinner while session is being validated.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07120c] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-[#e9c176]">
          <div className="w-12 h-12 rounded-full border-2 border-[#e9c176]/20 border-t-[#e9c176] animate-spin" />
          <p className="text-xs uppercase tracking-[0.2em]">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
