import { apiClient } from './apiClient';

/**
 * Reservation API Service
 * Fetches live data from PostgreSQL via Express API with full search, filter, sort & pagination support.
 */

export async function fetchReservations(params = {}) {
  const query = new URLSearchParams();

  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'ALL') query.append('status', params.status);
  if (params.date) query.append('date', params.date);
  if (params.sort) query.append('sort', params.sort);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const response = await apiClient(`/reservations${queryString}`);

  const rawData = response.data?.data || (Array.isArray(response.data) ? response.data : []);
  const mappedData = rawData.map((r) => ({
    ...r,
    date: r.reservationDate ? String(r.reservationDate).split('T')[0] : r.date,
    time: r.reservationTime || r.time,
    seatingPreference: r.seatingPreference || 'Indoor',
  }));

  return {
    data: mappedData,
    total: response.data?.total ?? mappedData.length,
    page: response.data?.page ?? 1,
    limit: response.data?.limit ?? 10,
    totalPages: response.data?.totalPages ?? 1,
  };
}

export async function fetchReservationById(id) {
  const response = await apiClient(`/reservations/${id}`);
  return response.data;
}

export async function createReservation(reservationData) {
  const response = await apiClient('/reservations', {
    method: 'POST',
    body: reservationData,
  });
  return response.data;
}

export async function updateReservation(id, data) {
  const response = await apiClient(`/reservations/${id}`, {
    method: 'PUT',
    body: data,
  });
  return response.data;
}

export async function updateReservationStatus(id, status) {
  const response = await apiClient(`/reservations/${id}`, {
    method: 'PUT',
    body: { status },
  });
  return response.data;
}

export async function deleteReservation(id) {
  const response = await apiClient(`/reservations/${id}`, {
    method: 'DELETE',
  });
  return response;
}

export async function fetchReservationStats() {
  const response = await apiClient('/reservations/stats');
  return response.data;
}
