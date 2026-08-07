import { apiClient } from './apiClient';

/**
 * Authentication API Service
 * Handles admin authentication against backend JWT endpoints:
 * POST /api/admin/login
 * POST /api/admin/logout
 * GET  /api/admin/profile
 * POST /api/admin/forgot-password
 * POST /api/admin/reset-password
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

export async function forgotPassword({ email }) {
  const response = await apiClient('/admin/forgot-password', {
    method: 'POST',
    body: { email },
  });
  return response;
}

export async function resetPassword({ token, newPassword }) {
  const response = await apiClient('/admin/reset-password', {
    method: 'POST',
    body: { token, newPassword },
  });
  return response;
}
