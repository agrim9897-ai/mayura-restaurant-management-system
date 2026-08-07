import { apiClient } from './apiClient';

/**
 * Authentication API Service
 * Handles admin authentication against backend JWT endpoints:
 * POST  /api/admin/login
 * POST  /api/admin/logout
 * GET   /api/admin/profile
 * PATCH /api/admin/profile
 * PATCH /api/admin/change-password
 * POST  /api/admin/forgot-password
 * POST  /api/admin/reset-password
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

export async function updateAdminProfileApi(payload) {
  const isFormData = payload instanceof FormData;
  const response = await apiClient('/admin/profile', {
    method: 'PATCH',
    body: payload,
    headers: isFormData ? {} : undefined,
  });
  return response.data;
}

export async function changeAdminPasswordApi({ currentPassword, newPassword, confirmPassword }) {
  const response = await apiClient('/admin/change-password', {
    method: 'PATCH',
    body: { currentPassword, newPassword, confirmPassword },
  });
  return response;
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
