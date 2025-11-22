import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  MenuItem,
  Autocomplete,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useBookingStore } from '@/stores';
import { useCreateBooking } from '@/hooks';
import { DISTRICTS } from '@/constants/districts';
import type { Booking, BookingCreateRequest, BusRoute } from '@/types';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

interface BookingFormProps {
  preFilledData?: {
    route?: BusRoute;
  };
  onSuccess: (booking: Booking) => void;
}

const STEPS = ['Customer Info', 'Trip Details', 'Confirm'];

export default function BookingForm({ preFilledData, onSuccess }: BookingFormProps) {
  const { customerInfo, setCustomerInfo } = useBookingStore();
  const { mutate: createBooking, isPending, error } = useCreateBooking(onSuccess);
  const [activeStep, setActiveStep] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: customerInfo.name || '',
    customer_email: customerInfo.email || '',
    customer_phone: customerInfo.phone || '',
    from_district: preFilledData?.route?.from_district || '',
    to_district: preFilledData?.route?.to_district || '',
    provider: preFilledData?.route?.provider || '',
    travel_date: '',
    num_seats: 1,
    dropping_point: ''
  });

  // Update form when preFilledData changes
  useEffect(() => {
    if (preFilledData?.route) {
      setFormData(prev => ({
        ...prev,
        from_district: preFilledData.route?.from_district || prev.from_district,
        to_district: preFilledData.route?.to_district || prev.to_district,
        provider: preFilledData.route?.provider || prev.provider
      }));
    }
  }, [preFilledData]);

  // Calculate Fare
  const route = preFilledData?.route;
  const selectedDroppingPoint = route?.dropping_points.find(dp => dp.name === formData.dropping_point);
  const pricePerSeat = selectedDroppingPoint?.price || route?.min_price || 500;
  const totalFare = pricePerSeat * formData.num_seats;

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate Customer Info
      if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
        return; // Add validation UI later
      }
      // Save to store
      setCustomerInfo({
        name: formData.customer_name,
        email: formData.customer_email,
        phone: formData.customer_phone
      });
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    const bookingRequest: BookingCreateRequest = {
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone,
      from_district: formData.from_district,
      to_district: formData.to_district,
      provider: formData.provider,
      travel_date: formData.travel_date,
      num_seats: formData.num_seats,
      dropping_point: formData.dropping_point || undefined
    };
    createBooking(bookingRequest);
  };

  const isStep1Valid = formData.customer_name && formData.customer_email && formData.customer_phone;
  const isStep2Valid = formData.from_district && formData.to_district && formData.provider && formData.travel_date && formData.num_seats > 0;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to create booking. Please try again.
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                required
                placeholder="+8801700000000"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Trip Details
              </Typography>
            </Grid>
            
            {/* Route Info */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                options={DISTRICTS}
                value={formData.from_district}
                onChange={(_, newValue) => setFormData({ ...formData, from_district: newValue || '' })}
                renderInput={(params) => <TextField {...params} label="From" required />}
                disabled={!!preFilledData?.route?.from_district}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                options={DISTRICTS}
                value={formData.to_district}
                onChange={(_, newValue) => {
                  setFormData({ 
                    ...formData, 
                    to_district: newValue || '',
                    dropping_point: '' // Reset dropping point when destination changes
                  });
                }}
                renderInput={(params) => <TextField {...params} label="To" required />}
                disabled={!!preFilledData?.route?.to_district}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Bus Provider"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                required
                disabled={!!preFilledData?.route?.provider}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DirectionsBusIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Travel Details */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Travel Date"
                type="date"
                value={formData.travel_date}
                onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Number of Seats"
                type="number"
                value={formData.num_seats}
                onChange={(e) => setFormData({ ...formData, num_seats: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)) })}
                required
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
            
            {/* Dropping Point */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Dropping Point"
                value={formData.dropping_point}
                onChange={(e) => setFormData({ ...formData, dropping_point: e.target.value })}
                disabled={!route?.dropping_points || route.dropping_points.length === 0}
                helperText={!route?.dropping_points ? "No dropping points available" : "Select your preferred dropping point"}
                required
              >
                {route?.dropping_points.map((dp) => (
                  <MenuItem key={dp.name} value={dp.name}>
                    {dp.name} (৳{dp.price})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Booking
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1" fontWeight="medium">{formData.customer_name}</Typography>
                  <Typography variant="body2" color="text.secondary">{formData.customer_phone}</Typography>
                  <Typography variant="body2" color="text.secondary">{formData.customer_email}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Route</Typography>
                  <Typography variant="body1" fontWeight="medium">{formData.provider}</Typography>
                  <Typography variant="body2">{formData.from_district} → {formData.to_district}</Typography>
                  <Typography variant="body2">{new Date(formData.travel_date).toLocaleDateString()}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2">Seats: {formData.num_seats}</Typography>
                      {formData.dropping_point && (
                        <Typography variant="body2">Dropping: {formData.dropping_point}</Typography>
                      )}
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" display="block">Total Fare</Typography>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        ৳{totalFare}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={isPending}>
              Back
            </Button>
          )}
          {activeStep < STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 0 ? !isStep1Valid : !isStep2Valid}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isPending ? 'Confirming...' : 'Confirm Booking'}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
