import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling can be done here
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
