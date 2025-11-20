/**
 * Chat Store - Manages conversation state
 * Uses Zustand for state management with localStorage persistence
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  conversationId: string | null;
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setConversationId: (id: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      conversationId: null,
      
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, { ...message, timestamp: new Date() }],
        })),
      
      clearMessages: () =>
        set({ messages: [], conversationId: null }),
      
      setConversationId: (id) =>
        set({ conversationId: id }),
    }),
    {
      name: 'chat-storage', // localStorage key
      partialize: (state) => ({
        messages: state.messages,
        conversationId: state.conversationId,
      }),
    }
  )
);
