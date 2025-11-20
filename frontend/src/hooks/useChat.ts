/**
 * Chat Hooks - TanStack Query hooks for chat operations
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/services/api';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';
import type { ChatRequest, ChatResponse } from '@/types';

export const useChatMutation = () => {
  const queryClient = useQueryClient();
  const { addMessage, setConversationId, conversationId } = useChatStore();
  const { showError } = useUIStore();

  return useMutation({
    mutationFn: async (message: string) => {
      const request: ChatRequest = {
        message,
        conversation_id: conversationId || undefined,
      };
      
      // Add user message to store immediately
      addMessage({
        role: 'user',
        content: message,
      });

      const response = await chatApi.sendMessage(request);
      return response.data;
    },
    onSuccess: (data: ChatResponse) => {
      // Add assistant response to store
      addMessage({
        role: 'assistant',
        content: data.response,
      });
      
      // Update conversation ID if new
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Failed to send message';
      showError(errorMessage);
      console.error('Chat error:', error);
    },
  });
};
