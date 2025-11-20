import { Container, Typography, Box } from '@mui/material';

export default function Search() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Search Buses
        </Typography>
        <Typography color="text.secondary">
          Bus search interface coming soon...
        </Typography>
      </Box>
    </Container>
  );
}
