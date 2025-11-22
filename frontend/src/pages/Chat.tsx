import { Container, Box, Typography, IconButton, Paper } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useEffect, useRef } from 'react';
import { useChatMutation } from '@/hooks';
import { useChatStore, useUIStore } from '@/stores';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';
import WelcomeMessage from '@/components/WelcomeMessage';

export default function Chat() {
  const { messages, clearMessages } = useChatStore();
  const { showSuccess } = useUIStore();
  const { mutate: sendMessage, isPending } = useChatMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleSendMessage = (message: string) => {
    if (message.length > 500) {
      useUIStore.getState().showError('Message too long. Maximum 500 characters.');
      return;
    }
    sendMessage(message);
  };

  const handleClearChat = () => {
    clearMessages();
    showSuccess('Chat cleared');
  };

  return (
    <Container maxWidth="xl" sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', py: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          AI Chat Assistant
        </Typography>
        {messages.length > 0 && (
          <IconButton
            onClick={handleClearChat}
            color="error"
            size="small"
            title="Clear chat"
          >
            <DeleteOutlineIcon />
          </IconButton>
        )}
      </Paper>

      {/* Messages Container */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          mb: 2,
          px: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'grey.100',
            borderRadius: 1,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.400',
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'grey.500',
            },
          },
        }}
      >
        {messages.length === 0 ? (
          <WelcomeMessage onSuggestionClick={handleSendMessage} />
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                sources={(message as any).sources} // Sources are attached to assistant messages
              />
            ))}
            {isPending && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} disabled={isPending} />
    </Container>
  );
}
