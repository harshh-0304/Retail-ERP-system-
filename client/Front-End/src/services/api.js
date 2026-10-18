/**
 * Centralized API Client Service
 */

export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5219/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = null;
      }
      const message = errorJson?.message || errorText || `HTTP Error ${response.status}: ${response.statusText}`;
      const err = new Error(message);
      err.status = response.status;
      err.response = response;
      throw err;
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutErr = new Error('Request timed out. Server may be offline.');
      timeoutErr.isOffline = true;
      throw timeoutErr;
    }
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      error.isOffline = true;
    }
    throw error;
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, data, options) => request(endpoint, { method: 'POST', body: JSON.stringify(data), ...options }),
  put: (endpoint, data, options) => request(endpoint, { method: 'PUT', body: JSON.stringify(data), ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options })
};

export default api;
