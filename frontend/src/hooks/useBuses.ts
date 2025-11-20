/**
 * Bus Hooks - TanStack Query hooks for bus operations
 */
import { useQuery } from '@tanstack/react-query';
import { busApi } from '@/services/api';
import type { BusSearchParams } from '@/types';

// Query keys for caching
export const busKeys = {
  all: ['buses'] as const,
  search: (params: BusSearchParams) => [...busKeys.all, 'search', params] as const,
  providers: () => [...busKeys.all, 'providers'] as const,
  providersByDistrict: (district: string) => [...busKeys.providers(), district] as const,
  providerDetails: (name: string) => [...busKeys.all, 'provider', name] as const,
};

/**
 * Hook to search for buses
 */
export const useBusSearch = (params: BusSearchParams, enabled = true) => {
  return useQuery({
    queryKey: busKeys.search(params),
    queryFn: async () => {
      const response = await busApi.search(params);
      return response.data;
    },
    enabled: enabled && !!params.from_district && !!params.to_district,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get all bus providers or filter by district
 */
export const useProviders = (district?: string) => {
  return useQuery({
    queryKey: district ? busKeys.providersByDistrict(district) : busKeys.providers(),
    queryFn: async () => {
      const response = await busApi.getProviders(district);
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes (providers don't change often)
  });
};

/**
 * Hook to get details of a specific provider
 */
export const useProviderDetails = (providerName: string, enabled = true) => {
  return useQuery({
    queryKey: busKeys.providerDetails(providerName),
    queryFn: async () => {
      const response = await busApi.getProviderDetails(providerName);
      return response.data;
    },
    enabled: enabled && !!providerName,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
