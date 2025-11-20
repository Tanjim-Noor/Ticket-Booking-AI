import { Box, Typography, Chip } from '@mui/material';
import WavingHandIcon from '@mui/icons-material/WavingHand';

interface WelcomeMessageProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  "Show me buses from Dhaka to Chattogram",
  "What are the cheapest routes under 500 taka?",
  "Tell me about Hanif bus service",
  "Which buses go to Sylhet?",
];

export default function WelcomeMessage({ onSuggestionClick }: WelcomeMessageProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 3,
        textAlign: 'center',
      }}
    >
      <WavingHandIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
      
      <Typography variant="h4" gutterBottom>
        Welcome to Bus Booking AI
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
        I'm your AI assistant for bus ticket booking in Bangladesh. Ask me about routes, fares, providers, or any travel-related questions!
      </Typography>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
        Try asking:
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', maxWidth: 600 }}>
        {suggestions.map((suggestion, index) => (
          <Chip
            key={index}
            label={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            clickable
            color="primary"
            variant="outlined"
            sx={{
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
