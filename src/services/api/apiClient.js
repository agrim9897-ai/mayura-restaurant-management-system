import { getStoredToken } from '../../context/AuthContext';

/**
 * Centralized API Client for Mayura Backend & Service Layer.
 * Wraps native fetch() with base URL, JWT auth header, and error handling.
 */
const BASE_URL = 'http://localhost:5000/api';

export async function apiClient(endpoint, options = {}) {
  const { body, headers, ...customConfig } = options;

  // Automatically attach JWT if available
  const token = getStoredToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const config = {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // If 401, the token is expired/invalid
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
    // Re-throw so caller services can handle fallback or UI errors
    throw error;
  }
}
