const apiHost =
  typeof window !== 'undefined' && window.location.hostname
    ? window.location.hostname
    : '127.0.0.1';

export const API_BASE_URL = `http://${apiHost}:8000`;
export const API_URL = `${API_BASE_URL}/api`;
