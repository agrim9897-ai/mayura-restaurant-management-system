import { apiClient } from './apiClient';

/**
 * Fetch all tables with optional search/filtering parameters
 */
export async function fetchTables(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.location && params.location !== 'ALL') query.append('location', params.location);
  if (params.status && params.status !== 'ALL') query.append('status', params.status);

  const queryString = query.toString();
  const endpoint = `/tables${queryString ? `?${queryString}` : ''}`;
  const response = await apiClient(endpoint);
  return response.data || { tables: [], stats: {} };
}

/**
 * Get a single table by ID
 */
export async function getTableById(id) {
  const response = await apiClient(`/tables/${id}`);
  return response.data;
}

/**
 * Create a new table
 */
export async function createTable(tableData) {
  const response = await apiClient('/tables', {
    method: 'POST',
    body: tableData,
  });
  return response.data;
}

/**
 * Update an existing table
 */
export async function updateTable(id, tableData) {
  const response = await apiClient(`/tables/${id}`, {
    method: 'PUT',
    body: tableData,
  });
  return response.data;
}

/**
 * Delete a table by ID
 */
export async function deleteTable(id) {
  const response = await apiClient(`/tables/${id}`, {
    method: 'DELETE',
  });
  return response.data;
}
