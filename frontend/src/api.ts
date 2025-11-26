import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:1234';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = async (file: File, delimiter?: string | null) => {
  const formData = new FormData();
  formData.append('file', file);
  if (delimiter) {
    formData.append('delimiter', delimiter);
  }

  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const fetchFromUrl = async (url: string, delimiter?: string | null) => {
  const response = await api.post('/api/fetch-url', { url, delimiter });
  return response.data;
};
