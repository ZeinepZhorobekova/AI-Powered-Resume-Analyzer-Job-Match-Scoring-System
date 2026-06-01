import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const analyzeResume = (formData, onUploadProgress) =>
  api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const getSession = (sessionId) => api.get(`/session/${sessionId}`);
