/**
 * Booking Hooks - TanStack Query hooks for booking operations
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '@/services/api';
import { useUIStore } from '@/stores/uiStore';
import type { BookingCreateRequest, BookingListParams } from '@/types';

// Query keys for caching
export const bookingKeys = {
  all: ['bookings'] as const,
  list: (params: BookingListParams) => [...bookingKeys.all, 'list', params] as const,
  detail: (id: number) => [...bookingKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch list of bookings
 */
export const useBookings = (params: BookingListParams, enabled = true) => {
  return useQuery({
    queryKey: bookingKeys.list(params),
    queryFn: async () => {
      const response = await bookingApi.list(params);
      return response.data;
    },
    enabled: enabled && (!!params.customer_email || !!params.customer_phone),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to fetch a single booking by ID
 */
export const useBooking = (id: number, enabled = true) => {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: async () => {
      const response = await bookingApi.get(id);
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to create a new booking
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: async (data: BookingCreateRequest) => {
      const response = await bookingApi.create(data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate bookings list to refetch
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      showSuccess(`Booking created successfully! Booking ID: ${data.id}`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Failed to create booking';
      showError(errorMessage);
      console.error('Create booking error:', error);
    },
  });
};

/**
 * Hook to cancel a booking
 */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await bookingApi.cancel(id);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate bookings list and the specific booking
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(data.id) });
      showSuccess(`Booking #${data.id} cancelled successfully`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Failed to cancel booking';
      showError(errorMessage);
      console.error('Cancel booking error:', error);
    },
  });
};
