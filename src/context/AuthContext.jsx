import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAdminProfile, logoutAdmin } from '../services/api/auth.service';

const AuthContext = createContext(null);

const TOKEN_KEY = 'mayura_admin_token';
const USER_KEY = 'mayura_admin_user';

/**
 * Retrieves the stored token from localStorage.
 */
export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * AuthProvider wraps the app and provides authentication state.
 * - Persists JWT and user data in localStorage for refresh survival.
 * - Exposes login, logout, and isAuthenticated status.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // On mount, validate stored token against backend via central API client
  useEffect(() => {
    async function validateSession() {
      const storedToken = getStoredToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getAdminProfile();
        if (userData) {
          setUser(userData);
          setToken(storedToken);
        } else {
          clearStorage();
          setToken(null);
          setUser(null);
        }
      } catch {
        // Token invalid or network error — clear session if 401 occurred
        if (!getStoredToken()) {
          setToken(null);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    validateSession();
  }, []);

  const login = useCallback((tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData);
    try {
      localStorage.setItem(TOKEN_KEY, tokenValue);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } catch {
      // Ignore network errors during logout
    }

    clearStorage();
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  const value = {
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context. Must be used within AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function clearStorage() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // Ignore
  }
}
