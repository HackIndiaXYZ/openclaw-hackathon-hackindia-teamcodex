import { apiRequest } from './apiClient';

export const fetchPrograms = (filters = {}) => {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return apiRequest(`/programs${queryString ? `?${queryString}` : ''}`);
};

export const createProgramRecord = (programData) => {
  return apiRequest('/programs', {
    method: 'POST',
    body: programData
  });
};

export const updateProgramRecord = (programId, programData) => {
  return apiRequest(`/programs/${programId}`, {
    method: 'PUT',
    body: programData
  });
};
