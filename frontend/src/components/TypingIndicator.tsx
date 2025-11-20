import { Box, CircularProgress, Typography } from '@mui/material';

export default function TypingIndicator() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2,
        animation: 'fadeIn 0.3s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <CircularProgress size={16} />
      <Typography variant="body2" color="text.secondary">
        AI is thinking...
      </Typography>
    </Box>
  );
}
