import { getStoredToken } from '../../context/AuthContext';

/**
 * Production Render Backend API URL (always includes /api).
 */
const RENDER_PROD_API_URL = 'https://mayura-restaurant-management-system.onrender.com/api';

/**
 * Helper to guarantee that any API base URL ends with '/api' (without trailing slash).
 * Protects against VITE_API_URL environment variables set without the '/api' prefix.
 */
function normalizeApiBaseUrl(url) {
  if (!url) return RENDER_PROD_API_URL;
  let cleanUrl = url.trim().replace(/\/$/, '');
  if (!cleanUrl.endsWith('/api')) {
    cleanUrl += '/api';
  }
  return cleanUrl;
}

/**
 * Dynamically resolves the API Base URL.
 * - In Vercel / Production builds, forces production Render API endpoint unless a valid non-localhost VITE_API_URL is supplied.
 * - In Development mode, uses VITE_API_URL if provided, else falls back to local/production backend.
 * - Always normalizes the URL to guarantee it includes the '/api' route prefix.
 */
function resolveApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;

  // If VITE_API_URL is provided and is a valid remote URL (not localhost/127.0.0.1)
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return normalizeApiBaseUrl(envUrl);
  }

  // In production builds (Vercel deployment), guarantee production Render API URL with /api suffix
  if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
    return RENDER_PROD_API_URL;
  }

  // Fallback for local development
  return envUrl ? normalizeApiBaseUrl(envUrl) : 'http://localhost:5000/api';
}

export const API_BASE_URL = resolveApiBaseUrl();

/**
 * Helper to build full backend endpoint URLs.
 * Example: getApiUrl('/admin/login') -> 'https://mayura-restaurant-management-system.onrender.com/api/admin/login'
 */
export function getApiUrl(endpoint = '') {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

/**
 * Centralized API Client for Mayura Backend & Service Layer.
 * Wraps native fetch() with base URL, JWT auth header, automatic FormData handling, and error handling.
 */
export async function apiClient(endpoint, options = {}) {
  const { body, headers, ...customConfig } = options;

  // Automatically attach JWT if available
  const token = getStoredToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const isFormData = body instanceof FormData;

  const config = {
    method: options.method || (body ? 'POST' : 'GET'),
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeaders,
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = isFormData ? body : typeof body === 'string' ? body : JSON.stringify(body);
  }

  const url = getApiUrl(endpoint);

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Handle expired or invalid JWT (401)
      if (response.status === 401) {
        try {
          localStorage.removeItem('mayura_admin_token');
          localStorage.removeItem('mayura_admin_user');
        } catch {
          // Ignore
        }
      }
      throw new Error(data?.message || `HTTP error ${response.status}`);
    }

    return data;
  } catch (error) {
    // Re-throw so caller services can handle errors or display UI feedback
    throw error;
  }
}
