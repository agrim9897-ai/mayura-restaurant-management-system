import { apiClient } from './apiClient';

/**
 * Authentication API Service
 * Handles admin authentication against backend JWT endpoints:
 * POST /api/admin/login
 * POST /api/admin/logout
 * GET  /api/admin/profile
 */

export async function loginAdmin(credentials) {
  const response = await apiClient('/admin/login', {
    method: 'POST',
    body: credentials,
  });
  return response;
}

export async function logoutAdmin() {
  const response = await apiClient('/admin/logout', { method: 'POST' });
  return response;
}

export async function getAdminProfile() {
  const response = await apiClient('/admin/profile');
  return response.data;
}
