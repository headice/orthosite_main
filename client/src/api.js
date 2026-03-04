const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(errorPayload || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getServices: () => request('/services/'),
  getProducts: () => request('/products/'),
  getRequisites: () => request('/requisites/'),
  getProfile: () => request('/profile/'),
  updateProfile: (payload) =>
    request('/profile/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  requestConsultation: (payload) =>
    request('/consultations/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export { API_BASE_URL };
