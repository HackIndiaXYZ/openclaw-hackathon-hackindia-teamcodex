const API_BASE_URL = 'https://openclaw-hackathon-hackindia-teamcodex.onrender.com/api';

const getToken = () => {
  return localStorage.getItem('edutrack_token');
};

export const saveToken = (token) => {
  localStorage.setItem('edutrack_token', token);
};

export const removeToken = () => {
  localStorage.removeItem('edutrack_token');
};

export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(buildApiUrl(endpoint), {
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
