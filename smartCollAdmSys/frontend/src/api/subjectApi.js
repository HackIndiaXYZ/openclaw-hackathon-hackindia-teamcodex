import { apiRequest } from './apiClient';

export const fetchSubjects = (filters = {}) => {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return apiRequest(`/subjects${queryString ? `?${queryString}` : ''}`);
};

export const createSubjectRecord = (subjectData) => {
  return apiRequest('/subjects', {
    method: 'POST',
    body: subjectData
  });
};

export const updateSubjectRecord = (subjectId, subjectData) => {
  return apiRequest(`/subjects/${subjectId}`, {
    method: 'PUT',
    body: subjectData
  });
};
