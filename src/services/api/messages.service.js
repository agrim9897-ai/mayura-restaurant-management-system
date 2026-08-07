import { apiClient } from './apiClient';

/**
 * Contact Messages API Service
 * Interacts with backend Express API and PostgreSQL for contact inquiries.
 */

export async function fetchMessages() {
  const response = await apiClient('/messages');
  return response.data || [];
}

export async function createContactMessage(messageData) {
  const response = await apiClient('/messages', {
    method: 'POST',
    body: messageData,
  });
  return response;
}

export async function markMessageAsRead(id) {
  const response = await apiClient(`/messages/${id}/read`, {
    method: 'PATCH',
  });
  return response.data;
}

export async function deleteMessage(id) {
  const response = await apiClient(`/messages/${id}`, {
    method: 'DELETE',
  });
  return response;
}

export async function replyToMessage(id, replyData) {
  const response = await apiClient(`/messages/${id}/reply`, {
    method: 'POST',
    body: replyData,
  });
  return response;
}
