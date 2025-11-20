import { Container, Typography, Box } from '@mui/material';

export default function Chat() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          AI Chatbot
        </Typography>
        <Typography color="text.secondary">
          Chat interface coming soon...
        </Typography>
      </Box>
    </Container>
  );
}
