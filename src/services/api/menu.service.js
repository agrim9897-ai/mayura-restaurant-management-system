import { apiClient } from './apiClient';
import { getStoredToken } from '../../context/AuthContext';

const BASE_URL = 'http://localhost:5000/api';

/**
 * Menu API Service
 * Interacts with backend Express API and PostgreSQL for Menu Items & Categories.
 */

export async function fetchMenuItems(params = {}) {
  const query = new URLSearchParams();

  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'ALL') query.append('category', params.category);
  if (params.isVeg && params.isVeg !== 'ALL') query.append('isVeg', params.isVeg);
  if (params.isAvailable && params.isAvailable !== 'ALL') query.append('isAvailable', params.isAvailable);
  if (params.isFeatured && params.isFeatured !== 'ALL') query.append('isFeatured', params.isFeatured);
  if (params.sort) query.append('sort', params.sort);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const response = await apiClient(`/menu${queryString}`);

  const rawData = response.data?.data || (Array.isArray(response.data) ? response.data : []);

  return {
    data: rawData,
    total: response.data?.total ?? rawData.length,
    page: response.data?.page ?? 1,
    limit: response.data?.limit ?? 50,
    totalPages: response.data?.totalPages ?? 1,
  };
}

export async function fetchCategories() {
  const response = await apiClient('/menu/categories');
  return response.data || [];
}

export async function createMenuItem(formDataOrObject) {
  // If formDataOrObject is FormData (for file uploads with Multer)
  if (formDataOrObject instanceof FormData) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${BASE_URL}/menu`, {
      method: 'POST',
      headers,
      body: formDataOrObject,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || 'Failed to create dish');
    return data.data;
  }

  const response = await apiClient('/menu', {
    method: 'POST',
    body: formDataOrObject,
  });
  return response.data;
}

export async function updateMenuItem(id, formDataOrObject) {
  if (formDataOrObject instanceof FormData) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers,
      body: formDataOrObject,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || 'Failed to update dish');
    return data.data;
  }

  const response = await apiClient(`/menu/${id}`, {
    method: 'PUT',
    body: formDataOrObject,
  });
  return response.data;
}

export async function deleteMenuItem(id) {
  const response = await apiClient(`/menu/${id}`, {
    method: 'DELETE',
  });
  return response;
}

export async function toggleMenuItemAvailability(id, currentStatus) {
  const response = await apiClient(`/menu/${id}/availability`, {
    method: 'PATCH',
    body: { isAvailable: !currentStatus },
  });
  return response.data;
}
