import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react';
import type { Booking } from '@/types';

interface BookingCardProps {
  booking: Booking;
  onCancel: (id: number) => void;
  isCancelling?: boolean;
}

export default function BookingCard({ booking, onCancel, isCancelling = false }: BookingCardProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleCancelClick = () => {
    setConfirmCancel(true);
  };

  const handleConfirmCancel = () => {
    onCancel(booking.id);
    setConfirmCancel(false);
  };

  return (
    <>
      <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', borderRadius: 3 }}>
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Header: ID and Status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold" color="primary" sx={{ lineHeight: 1.2 }}>
                #{booking.id}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <DirectionsBusIcon color="action" sx={{ fontSize: 16 }} />
                <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: 120 }}>
                  {booking.provider}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={booking.status}
              color={getStatusColor(booking.status) as any}
              size="small"
              sx={{ 
                fontWeight: 'bold', 
                textTransform: 'capitalize', 
                height: 24,
                fontSize: '0.75rem'
              }}
            />
          </Box>

          {/* Route Info */}
          <Box sx={{ 
            mb: 2, 
            bgcolor: 'action.hover', 
            p: 1.5, 
            borderRadius: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" color="text.secondary" fontSize="0.75rem">From</Typography>
                <Typography variant="body2" fontWeight="bold" noWrap title={booking.from_district}>
                  {booking.from_district}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">→</Typography>
              <Box sx={{ minWidth: 0, flex: 1, textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary" fontSize="0.75rem">To</Typography>
                <Typography variant="body2" fontWeight="bold" noWrap title={booking.to_district}>
                  {booking.to_district}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

          {/* Trip Details */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 14 }} />
                  Date
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {new Date(booking.travel_date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5, justifyContent: 'flex-end' }}>
                  <EventSeatIcon sx={{ fontSize: 14 }} />
                  Seats
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {booking.num_seats}
                </Typography>
              </Box>
            </Box>

            {booking.dropping_point && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 14 }} />
                  Dropping Point
                </Typography>
                <Typography variant="body2" fontWeight="medium" sx={{ wordBreak: 'break-word' }}>
                  {booking.dropping_point}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>

        {/* Footer: Fare and Action */}
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Total Fare
            </Typography>
            <Typography variant="h6" color="primary.main" fontWeight="bold" sx={{ lineHeight: 1 }}>
              ৳{booking.total_fare}
            </Typography>
          </Box>
          {booking.status === 'confirmed' && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<CancelIcon />}
              onClick={handleCancelClick}
              disabled={isCancelling}
              sx={{ borderRadius: 2, textTransform: 'none', minWidth: 'auto', px: 2 }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
      >
        <DialogTitle>Cancel Booking?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel booking #{booking.id}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancel(false)}>No, Keep it</Button>
          <Button onClick={handleConfirmCancel} color="error" autoFocus>
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
