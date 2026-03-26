import { apiRequest } from './apiClient';

export const fetchReports = () => {
  return apiRequest('/reports');
};

export const createStudentReport = (studentId) => {
  return apiRequest(`/reports/generate/${studentId}`, {
    method: 'POST'
  });
};
