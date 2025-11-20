/**
 * Search Store - Manages search filters and UI state
 * Uses Zustand for state management with localStorage persistence
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
  fromDistrict: string;
  toDistrict: string;
  travelDate: string;
  provider: string;
  
  // Actions
  setFromDistrict: (district: string) => void;
  setToDistrict: (district: string) => void;
  setTravelDate: (date: string) => void;
  setProvider: (provider: string) => void;
  setSearchParams: (params: Partial<Omit<SearchState, 'setFromDistrict' | 'setToDistrict' | 'setTravelDate' | 'setProvider' | 'setSearchParams' | 'clearSearch'>>) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      fromDistrict: '',
      toDistrict: '',
      travelDate: '',
      provider: '',
      
      setFromDistrict: (district) =>
        set({ fromDistrict: district }),
      
      setToDistrict: (district) =>
        set({ toDistrict: district }),
      
      setTravelDate: (date) =>
        set({ travelDate: date }),
      
      setProvider: (provider) =>
        set({ provider }),
      
      setSearchParams: (params) =>
        set((state) => ({ ...state, ...params })),
      
      clearSearch: () =>
        set({
          fromDistrict: '',
          toDistrict: '',
          travelDate: '',
          provider: '',
        }),
    }),
    {
      name: 'search-storage', // localStorage key
    }
  )
);
