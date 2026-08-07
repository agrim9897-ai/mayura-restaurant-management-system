import { apiClient } from './apiClient';
import { getStoredToken } from '../../context/AuthContext';

const BASE_URL = 'http://localhost:5000/api';

/**
 * Restaurant Settings API Service
 * Interacts with backend Express API and PostgreSQL for restaurant profile.
 */

export async function fetchSettings() {
  const response = await apiClient('/settings');
  return response.data || {};
}

export async function updateSettings(settingsData) {
  if (settingsData instanceof FormData) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers,
      body: settingsData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || 'Failed to update settings');
    return data.data;
  }

  const response = await apiClient('/settings', {
    method: 'PUT',
    body: settingsData,
  });
  return response.data;
}
