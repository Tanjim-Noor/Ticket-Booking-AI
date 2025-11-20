/**
 * Booking Store - Manages booking form state
 * Uses Zustand for state management with localStorage persistence
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BookingCreateRequest } from '@/types';

interface BookingState {
  bookingDraft: Partial<BookingCreateRequest>;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  
  // Actions
  setBookingData: (data: Partial<BookingCreateRequest>) => void;
  clearBooking: () => void;
  setCustomerInfo: (info: Partial<BookingState['customerInfo']>) => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookingDraft: {},
      customerInfo: {
        name: '',
        email: '',
        phone: '',
      },
      
      setBookingData: (data) =>
        set((state) => ({
          bookingDraft: { ...state.bookingDraft, ...data },
        })),
      
      clearBooking: () =>
        set({ bookingDraft: {} }),
      
      setCustomerInfo: (info) =>
        set((state) => ({
          customerInfo: { ...state.customerInfo, ...info },
        })),
    }),
    {
      name: 'booking-storage', // localStorage key
      partialize: (state) => ({
        customerInfo: state.customerInfo, // Only persist customer info
      }),
    }
  )
);
