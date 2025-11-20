/**
 * API Service Layer
 * Axios instance with base configuration
 */
import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const chatApi = {
  sendMessage: (message: string) =>
    api.post('/chat', { message }),
};

export const busApi = {
  search: (params: { from_district: string; to_district: string; provider?: string }) =>
    api.get('/buses/search', { params }),
  
  getProviders: (district?: string) =>
    api.get('/buses/providers', { params: district ? { district } : {} }),
  
  getProviderDetails: (providerName: string) =>
    api.get(`/buses/providers/${providerName}`),
};

export const bookingApi = {
  create: (data: any) =>
    api.post('/bookings', data),
  
  list: (params: { customer_email?: string; customer_phone?: string }) =>
    api.get('/bookings', { params }),
  
  get: (id: number) =>
    api.get(`/bookings/${id}`),
  
  cancel: (id: number) =>
    api.delete(`/bookings/${id}`),
};
