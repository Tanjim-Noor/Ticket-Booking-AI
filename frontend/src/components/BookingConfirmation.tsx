
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import type { Booking } from '@/types';

interface BookingConfirmationProps {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
  onViewBookings: () => void;
  onBookAnother: () => void;
}

export default function BookingConfirmation({
  open,
  booking,
  onClose,
  onViewBookings,
  onBookAnother
}: BookingConfirmationProps) {
  // const theme = useTheme();

  if (!booking) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 64 }} />
          <Typography variant="h5" component="div" fontWeight="bold">
            Booking Confirmed!
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            Your ticket has been successfully booked. A confirmation email has been sent to {booking.customer_email}.
          </Typography>

          <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2, mt: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Booking ID
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  #{booking.id}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DirectionsBusIcon color="action" />
                  <Typography variant="subtitle1" fontWeight="medium">
                    {booking.provider}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={booking.from_district} size="small" />
                  <Typography variant="body2" color="text.secondary">→</Typography>
                  <Chip label={booking.to_district} size="small" />
                </Box>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Travel Date
                    </Typography>
                    <Typography variant="body2">
                      {new Date(booking.travel_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventSeatIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Seats
                    </Typography>
                    <Typography variant="body2">
                      {booking.num_seats} Seat{booking.num_seats > 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {booking.dropping_point && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Dropping Point
                  </Typography>
                  <Typography variant="body2">
                    {booking.dropping_point}
                  </Typography>
                </Grid>
              )}

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">Total Fare</Typography>
                  <Typography variant="h5" color="primary.main" fontWeight="bold">
                    ৳{booking.total_fare}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button
          variant="outlined"
          onClick={onBookAnother}
          fullWidth
        >
          Book Another
        </Button>
        <Button
          variant="contained"
          onClick={onViewBookings}
          fullWidth
          autoFocus
        >
          View My Bookings
        </Button>
      </DialogActions>
    </Dialog>
  );
}
