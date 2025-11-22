import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import type { BusRoute } from '@/types';

interface RouteCardProps {
  route: BusRoute;
}

export default function RouteCard({ route }: RouteCardProps) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Navigate to bookings page with pre-filled route data
    navigate('/bookings', {
      state: {
        route: route,
      },
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Provider */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DirectionsBusIcon color="primary" />
          <Typography variant="h6" component="h3">
            {route.provider}
          </Typography>
        </Box>

        {/* Route */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
          <Chip label={route.from_district} color="primary" variant="outlined" />
          <ArrowForwardIcon color="action" />
          <Chip label={route.to_district} color="secondary" variant="outlined" />
        </Box>

        {/* Fare */}
        <Box>
          <Typography variant="h4" color="primary.main" fontWeight="bold">
            ৳{route.min_price} - ৳{route.max_price}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Price Range
          </Typography>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          {route.description}
        </Typography>

        {/* Book Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleBookNow}
          sx={{ mt: 'auto' }}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
}
