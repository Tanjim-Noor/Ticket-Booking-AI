import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Alert,
  Skeleton,
  InputAdornment
} from '@mui/material';
import { useState } from 'react';
import { useBookings, useCancelBooking } from '@/hooks';
import BookingCard from './BookingCard';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export default function BookingsList() {
  const [searchType, setSearchType] = useState<'email' | 'phone'>('email');
  const [searchValue, setSearchValue] = useState('');
  const [queryValue, setQueryValue] = useState(''); // Value actually used for query

  const { data, isLoading, isError, refetch } = useBookings(
    {
      customer_email: searchType === 'email' ? queryValue : undefined,
      customer_phone: searchType === 'phone' ? queryValue : undefined
    },
    !!queryValue // Only run query if we have a value
  );

  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking(() => {
    refetch(); // Refresh list after cancellation
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setQueryValue(searchValue.trim());
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setQueryValue('');
  };

  return (
    <Box>
      {/* Search Section */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom align="center">
          Find Your Bookings
        </Typography>
        
        <FormControl component="fieldset" sx={{ width: '100%', mb: 2, display: 'flex', alignItems: 'center' }}>
          <RadioGroup
            row
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'email' | 'phone')}
          >
            <FormControlLabel value="email" control={<Radio />} label="By Email" />
            <FormControlLabel value="phone" control={<Radio />} label="By Phone" />
          </RadioGroup>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder={searchType === 'email' ? "Enter your email address" : "Enter your phone number"}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={!searchValue.trim()}
            sx={{ minWidth: 100 }}
          >
            Search
          </Button>
          {queryValue && (
            <Button
              variant="outlined"
              onClick={handleClear}
              sx={{ minWidth: 100 }}
              startIcon={<ClearIcon />}
            >
              Clear
            </Button>
          )}
        </Box>
      </Box>

      {/* Results Section */}
      {isLoading && (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid size={{ xs: 12, md: 6, lg: 6 }} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error fetching bookings. Please check your input and try again.
        </Alert>
      )}

      {!isLoading && !isError && queryValue && data?.bookings.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No bookings found for this {searchType}.
          </Typography>
        </Box>
      )}

      {!isLoading && !isError && data && data.bookings.length > 0 && (
        <Grid container spacing={3}>
          {data.bookings.map((booking) => (
            <Grid size={{ xs: 12, md: 6, lg: 6 }} key={booking.id}>
              <BookingCard
                booking={booking}
                onCancel={(id) => cancelBooking(id)}
                isCancelling={isCancelling}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
