import { apiClient } from './apiClient';

/**
 * Restaurant Settings API Service
 * Interacts with backend Express API and PostgreSQL for restaurant profile.
 */

export async function fetchSettings() {
  const response = await apiClient('/settings');
  return response.data || {};
}

export async function updateSettings(settingsData) {
  const response = await apiClient('/settings', {
    method: 'PUT',
    body: settingsData,
  });
  return response.data;
}
