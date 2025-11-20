import { Container, Typography, Box } from '@mui/material';

export default function Bookings() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          My Bookings
        </Typography>
        <Typography color="text.secondary">
          Bookings management interface coming soon...
        </Typography>
      </Box>
    </Container>
  );
}
