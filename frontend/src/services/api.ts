/**
 * API Service Layer
 * Axios instance with base configuration
 */
import axios, { AxiosResponse } from 'axios';
import type {
  ChatRequest,
  ChatResponse,
  BusSearchParams,
  BusSearchResponse,
  BusProvidersListResponse,
  BusProvider,
  BookingCreateRequest,
  Booking,
  BookingListParams,
  BookingListResponse,
} from '@/types';

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

// ============ Chat API ============

export const chatApi = {
  sendMessage: (data: ChatRequest): Promise<AxiosResponse<ChatResponse>> =>
    api.post<ChatResponse>('/chat', data),
};

// ============ Bus API ============

export const busApi = {
  search: (params: BusSearchParams): Promise<AxiosResponse<BusSearchResponse>> =>
    api.get<BusSearchResponse>('/buses/search', { params }),
  
  getProviders: (district?: string): Promise<AxiosResponse<BusProvidersListResponse>> =>
    api.get<BusProvidersListResponse>('/buses/providers', { 
      params: district ? { district } : {} 
    }),
  
  getProviderDetails: (providerName: string): Promise<AxiosResponse<BusProvider>> =>
    api.get<BusProvider>(`/buses/providers/${providerName}`),
};

// ============ Booking API ============

export const bookingApi = {
  create: (data: BookingCreateRequest): Promise<AxiosResponse<Booking>> =>
    api.post<Booking>('/bookings', data),
  
  list: (params: BookingListParams): Promise<AxiosResponse<BookingListResponse>> =>
    api.get<BookingListResponse>('/bookings', { params }),
  
  get: (id: number): Promise<AxiosResponse<Booking>> =>
    api.get<Booking>(`/bookings/${id}`),
  
  cancel: (id: number): Promise<AxiosResponse<Booking>> =>
    api.delete<Booking>(`/bookings/${id}`),
};
