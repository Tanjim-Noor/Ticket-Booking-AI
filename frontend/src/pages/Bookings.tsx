import { Container, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingForm from '@/components/BookingForm';
import BookingsList from '@/components/BookingsList';
import BookingConfirmation from '@/components/BookingConfirmation';
import type { Booking } from '@/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Bookings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Check for pre-filled data from navigation
  const preFilledData = location.state as {
    fromDistrict?: string;
    toDistrict?: string;
    provider?: string;
    fare?: number;
  } | undefined;

  useEffect(() => {
    // If we have pre-filled data, ensure we're on the New Booking tab
    if (preFilledData) {
      setActiveTab(0);
    }
  }, [preFilledData]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBookingSuccess = (booking: Booking) => {
    setConfirmedBooking(booking);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setConfirmedBooking(null);
    // Clear navigation state
    navigate(location.pathname, { replace: true, state: undefined });
  };

  const handleViewBookings = () => {
    handleCloseConfirmation();
    setActiveTab(1); // Switch to My Bookings tab
  };

  const handleBookAnother = () => {
    handleCloseConfirmation();
    setActiveTab(0); // Stay on New Booking tab, form will reset
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Bus Ticket Booking
      </Typography>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="New Booking" />
          <Tab label="My Bookings" />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        <BookingForm 
          preFilledData={preFilledData} 
          onSuccess={handleBookingSuccess} 
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <BookingsList />
      </TabPanel>

      <BookingConfirmation
        open={showConfirmation}
        booking={confirmedBooking}
        onClose={handleCloseConfirmation}
        onViewBookings={handleViewBookings}
        onBookAnother={handleBookAnother}
      />
    </Container>
  );
}
