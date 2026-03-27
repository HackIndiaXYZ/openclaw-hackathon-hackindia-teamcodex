import { buildApiUrl } from './apiClient';

export const fetchStudents = async (filters = {}) => {
  const token = localStorage.getItem('edutrack_token');
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  const response = await fetch(buildApiUrl(`/students${queryString ? `?${queryString}` : ''}`), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to fetch students');
  }

  return data;
};

export const createStudent = async (studentData) => {
  const token = localStorage.getItem('edutrack_token');
  const formData = new FormData();

  Object.entries(studentData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value);
    }
  });

  const response = await fetch(buildApiUrl('/students'), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
    credentials: 'include'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to create student');
  }

  return data;
};

export const updateStudent = async (studentId, studentData) => {
  const token = localStorage.getItem('edutrack_token');
  const formData = new FormData();

  Object.entries(studentData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value);
    }
  });

  const response = await fetch(buildApiUrl(`/students/${studentId}`), {
    method: 'PUT',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
    credentials: 'include'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to update student');
  }

  return data;
};
