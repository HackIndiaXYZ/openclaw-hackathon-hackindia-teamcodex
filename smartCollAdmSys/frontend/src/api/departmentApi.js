import { apiRequest } from './apiClient';

export const fetchDepartments = () => {
  return apiRequest('/departments');
};

export const createDepartmentRecord = (departmentData) => {
  return apiRequest('/departments', {
    method: 'POST',
    body: departmentData
  });
};

export const updateDepartmentRecord = (departmentId, departmentData) => {
  return apiRequest(`/departments/${departmentId}`, {
    method: 'PUT',
    body: departmentData
  });
};
