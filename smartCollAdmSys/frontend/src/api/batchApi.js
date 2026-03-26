import { apiRequest } from './apiClient';

export const fetchBatches = (filters = {}) => {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return apiRequest(`/batches${queryString ? `?${queryString}` : ''}`);
};

export const createBatchRecord = (batchData) => {
  return apiRequest('/batches', {
    method: 'POST',
    body: batchData
  });
};

export const updateBatchRecord = (batchId, batchData) => {
  return apiRequest(`/batches/${batchId}`, {
    method: 'PUT',
    body: batchData
  });
};
