import { Box, Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useProviders, useBusSearch } from '@/hooks';

/**
 * API Integration Test Component
 * Tests all API endpoints to verify frontend-backend integration
 */
export default function ApiTest() {

  // Test 1: Fetch all providers
  const { data: providersData, isLoading: providersLoading, error: providersError } = useProviders();

  // Test 2: Search buses (Dhaka to Chattogram)
  const searchParams = {
    from_district: 'Dhaka',
    to_district: 'Chattogram',
  };
  const { data: searchData, isLoading: searchLoading, error: searchError, refetch: refetchSearch } = useBusSearch(searchParams, false);

  const handleTestSearch = () => {
    refetchSearch();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        API Integration Tests
      </Typography>

      {/* Test 1: Providers API */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Test 1: Fetch Bus Providers
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          GET /api/v1/buses/providers
        </Typography>
        
        {providersLoading && <CircularProgress size={24} />}
        
        {providersError && (
          <Alert severity="error">
            Error: {(providersError as any)?.response?.data?.detail || (providersError as Error).message}
          </Alert>
        )}
        
        {providersData && (
          <Alert severity="success">
            ✅ Success! Fetched {providersData.total_providers} providers
            <br />
            Providers: {providersData.providers.map(p => p.name).join(', ')}
          </Alert>
        )}
      </Paper>

      {/* Test 2: Bus Search API */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Test 2: Search Buses
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          GET /api/v1/buses/search?from_district=Dhaka&to_district=Chittagong
        </Typography>
        
        <Button 
          variant="contained" 
          onClick={handleTestSearch}
          disabled={searchLoading}
          sx={{ mb: 2 }}
        >
          {searchLoading ? <CircularProgress size={24} /> : 'Test Search'}
        </Button>
        
        {searchError && (
          <Alert severity="error">
            Error: {(searchError as any)?.response?.data?.detail || (searchError as Error).message}
          </Alert>
        )}
        
        {searchData && (
          <Alert severity="success">
            ✅ Success! Found {searchData.total_results} routes
            {searchData.routes.length > 0 && (
              <>
                <br />
                First route: {searchData.routes[0].provider} - {searchData.routes[0].from_district} to {searchData.routes[0].to_district} (৳{searchData.routes[0].estimated_fare})
              </>
            )}
          </Alert>
        )}
      </Paper>

      {/* Summary */}
      <Paper sx={{ p: 2, bgcolor: 'primary.light' }}>
        <Typography variant="h6" gutterBottom>
          Test Summary
        </Typography>
        <Typography variant="body2">
          • Providers API: {providersLoading ? '⏳ Loading...' : providersError ? '❌ Failed' : providersData ? '✅ Passed' : '⏸️ Not tested'}
        </Typography>
        <Typography variant="body2">
          • Search API: {searchLoading ? '⏳ Loading...' : searchError ? '❌ Failed' : searchData ? '✅ Passed' : '⏸️ Not tested'}
        </Typography>
      </Paper>
    </Box>
  );
}
