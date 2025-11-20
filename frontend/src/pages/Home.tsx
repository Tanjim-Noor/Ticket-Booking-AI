import { Container, Typography, Button, Box, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Bus Ticket Booking AI
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your intelligent assistant for bus travel in Bangladesh
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <ChatIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                AI Chatbot
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Ask questions about routes, prices, and providers
              </Typography>
              <Button variant="contained" onClick={() => navigate('/chat')}>
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Search Buses
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Find available routes between districts
              </Typography>
              <Button variant="contained" onClick={() => navigate('/search')}>
                Search Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <BookOnlineIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                My Bookings
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                View and manage your ticket bookings
              </Typography>
              <Button variant="contained" onClick={() => navigate('/bookings')}>
                View Bookings
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
