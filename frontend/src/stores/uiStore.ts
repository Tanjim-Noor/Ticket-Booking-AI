/**
 * UI Store - Manages global UI state
 * Uses Zustand for state management (no persistence needed)
 */
import { create } from 'zustand';

type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  message: string;
  severity: NotificationSeverity;
  open: boolean;
}

interface UIState {
  notification: Notification;
  
  // Actions
  showNotification: (message: string, severity: NotificationSeverity) => void;
  hideNotification: () => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  notification: {
    message: '',
    severity: 'info',
    open: false,
  },
  
  showNotification: (message, severity) =>
    set({
      notification: {
        message,
        severity,
        open: true,
      },
    }),
  
  hideNotification: () =>
    set((state) => ({
      notification: {
        ...state.notification,
        open: false,
      },
    })),
  
  showSuccess: (message) =>
    set({
      notification: {
        message,
        severity: 'success',
        open: true,
      },
    }),
  
  showError: (message) =>
    set({
      notification: {
        message,
        severity: 'error',
        open: true,
      },
    }),
  
  showWarning: (message) =>
    set({
      notification: {
        message,
        severity: 'warning',
        open: true,
      },
    }),
  
  showInfo: (message) =>
    set({
      notification: {
        message,
        severity: 'info',
        open: true,
      },
    }),
}));
