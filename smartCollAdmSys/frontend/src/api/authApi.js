import { apiRequest } from './apiClient';

export const loginUser = (credentials) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: credentials
  });
};

export const registerUser = (userData) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: userData
  });
};

export const getCurrentUser = () => {
  return apiRequest('/auth/me');
};
