import { Box, Paper, Typography, Chip, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  sources?: Array<Record<string, any>>;
}

export default function ChatMessage({ message, sources }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        animation: 'fadeInUp 0.3s ease-out',
        '@keyframes fadeInUp': {
          from: {
            opacity: 0,
            transform: 'translateY(10px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '70%', gap: 1 }}>
        {!isUser && (
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            <SmartToyIcon sx={{ fontSize: 20 }} />
          </Avatar>
        )}
        
        <Box>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: isUser ? 'primary.main' : 'grey.100',
              color: isUser ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2,
              borderTopRightRadius: isUser ? 0 : 2,
              borderTopLeftRadius: isUser ? 2 : 0,
              '& p': { m: 0, mb: 1, '&:last-child': { mb: 0 } },
              '& ul, & ol': { m: 0, mb: 1, pl: 2 },
              '& li': { mb: 0.5 },
              '& strong': { fontWeight: 600 },
              '& table': { width: '100%', borderCollapse: 'collapse', mb: 1 },
              '& th, & td': { border: '1px solid', borderColor: 'divider', p: 0.5 },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </Paper>

          {/* Sources */}
          {!isUser && sources && sources.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {sources.map((source, index) => (
                <Chip
                  key={index}
                  label={typeof source === 'string' ? source : JSON.stringify(source)}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          )}

          {/* Timestamp */}
          {timestamp && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {timestamp}
            </Typography>
          )}
        </Box>

        {isUser && (
          <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
            <PersonIcon sx={{ fontSize: 20 }} />
          </Avatar>
        )}
      </Box>
    </Box>
  );
}
