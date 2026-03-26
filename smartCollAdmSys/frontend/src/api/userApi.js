import { apiRequest } from './apiClient';

export const fetchUsers = () => {
  return apiRequest('/users');
};

export const createManagedUser = (userData) => {
  return apiRequest('/users', {
    method: 'POST',
    body: userData
  });
};

export const updateManagedUser = (userId, userData) => {
  return apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: userData
  });
};
