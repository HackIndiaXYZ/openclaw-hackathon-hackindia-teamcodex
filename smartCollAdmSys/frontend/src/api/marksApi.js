import { apiRequest } from './apiClient';

export const fetchMarksRecords = () => {
  return apiRequest('/marks');
};

export const createMarksRecord = (marksData) => {
  return apiRequest('/marks', {
    method: 'POST',
    body: marksData
  });
};
