import { apiRequest } from './apiClient';

export const fetchMyFacultyAssignments = () => {
  return apiRequest('/faculty-assignments/my');
};

export const fetchFacultyAssignments = () => {
  return apiRequest('/faculty-assignments');
};

export const createFacultyAssignmentRecord = (assignmentData) => {
  return apiRequest('/faculty-assignments', {
    method: 'POST',
    body: assignmentData
  });
};

export const updateFacultyAssignmentRecord = (assignmentId, assignmentData) => {
  return apiRequest(`/faculty-assignments/${assignmentId}`, {
    method: 'PUT',
    body: assignmentData
  });
};
