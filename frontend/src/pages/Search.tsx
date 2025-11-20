import { Container, Typography, Box, Skeleton, Alert } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useState, useMemo } from 'react';
import { useBusSearch } from '@/hooks';
import SearchForm from '@/components/SearchForm';
import FilterBar from '@/components/FilterBar';
import RouteCard from '@/components/RouteCard';
import type { BusRoute, BusSearchParams } from '@/types';

export default function Search() {
  const [searchParams, setSearchParams] = useState<BusSearchParams | null>(null);
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Fetch bus routes using the search hook
  const { data, isLoading, isError, error } = useBusSearch(
    searchParams || { from_district: '', to_district: '' },
    !!searchParams
  );

  const routes = data?.routes || [];

  // Get unique providers from results
  const providers = useMemo(() => {
    const uniqueProviders = new Set(routes.map((route: BusRoute) => route.provider));
    return Array.from(uniqueProviders).sort();
  }, [routes]);

  // Filter and sort routes
  const filteredAndSortedRoutes = useMemo(() => {
    let result = [...routes];

    // Filter by provider
    if (selectedProvider !== 'all') {
      result = result.filter((route: BusRoute) => route.provider === selectedProvider);
    }

    // Sort
    switch (sortBy) {
      case 'fare-asc':
        result.sort((a: BusRoute, b: BusRoute) => a.estimated_fare - b.estimated_fare);
        break;
      case 'fare-desc':
        result.sort((a: BusRoute, b: BusRoute) => b.estimated_fare - a.estimated_fare);
        break;
      case 'provider-asc':
        result.sort((a: BusRoute, b: BusRoute) => a.provider.localeCompare(b.provider));
        break;
      default:
        // Keep default order
        break;
    }

    return result;
  }, [routes, selectedProvider, sortBy]);

  const handleSearch = (from: string, to: string) => {
    setSearchParams({ from_district: from, to_district: to });
    // Reset filters when new search
    setSelectedProvider('all');
    setSortBy('default');
  };

  const handleClearFilters = () => {
    setSelectedProvider('all');
    setSortBy('default');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Search Bus Routes
      </Typography>

      {/* Search Form */}
      <SearchForm onSearch={handleSearch} loading={isLoading} />

      {/* Results Section */}
      {searchParams && (
        <>
          {/* Error State */}
          {isError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {(error as any)?.response?.data?.detail || 'Failed to search buses. Please try again.'}
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
              ))}
            </Box>
          )}

          {/* Results */}
          {!isLoading && !isError && routes.length > 0 && (
            <>
              {/* Filter Bar */}
              <FilterBar
                providers={providers}
                selectedProvider={selectedProvider}
                onProviderChange={setSelectedProvider}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onClearFilters={handleClearFilters}
                totalResults={filteredAndSortedRoutes.length}
              />

              {/* Route Cards */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {filteredAndSortedRoutes.map((route: BusRoute, index: number) => (
                  <RouteCard key={index} route={route} />
                ))}
              </Box>
            </>
          )}

          {/* Empty State */}
          {!isLoading && !isError && routes.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <SearchOffIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
              <Typography variant="h5" color="text.secondary">
                No routes found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try searching for different districts or check back later.
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Initial State */}
      {!searchParams && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h5" color="text.secondary">
            Search for bus routes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select your departure and destination districts to find available routes.
          </Typography>
        </Box>
      )}
    </Container>
  );
}
