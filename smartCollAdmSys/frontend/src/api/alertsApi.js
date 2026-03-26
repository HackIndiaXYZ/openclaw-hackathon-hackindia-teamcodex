import { apiRequest } from './apiClient';

export const fetchAlerts = () => {
  return apiRequest('/alerts');
};
