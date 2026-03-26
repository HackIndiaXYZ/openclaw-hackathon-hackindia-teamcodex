const API_BASE_URL = 'http://localhost:5000/api';

// This helper reads the saved JWT token from browser storage.
const getToken = () => {
  return localStorage.getItem('edutrack_token');
};

// This helper keeps token saving in one place.
export const saveToken = (token) => {
  localStorage.setItem('edutrack_token', token);
};

export const removeToken = () => {
  localStorage.removeItem('edutrack_token');
};

// This is the shared fetch helper used by all API files.
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};
