import { apiRequest } from './apiClient';

export const fetchAttendanceRecords = (filters = {}) => {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return apiRequest(`/attendance${queryString ? `?${queryString}` : ''}`);
};

export const createAttendanceRecord = (attendanceData) => {
  return apiRequest('/attendance', {
    method: 'POST',
    body: attendanceData
  });
};

export const recognizeAttendanceImage = async ({ imageFile, facultyAssignmentId }) => {
  const token = localStorage.getItem('edutrack_token');
  const formData = new FormData();
  formData.append('image', imageFile);

  if (facultyAssignmentId) {
    formData.append('facultyAssignmentId', facultyAssignmentId);
  }

  const response = await fetch('http://localhost:5000/api/attendance/recognize', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
    credentials: 'include'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to recognize attendance image');
  }

  return data;
};
