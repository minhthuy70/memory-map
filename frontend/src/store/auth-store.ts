import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '@/lib/auth-api';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  isEmailVerified?: boolean;
  memoryCount?: number;
  createdAt?: string;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  user: User | null;
  lastActivity: number | null;
  inactivityWarning: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  updateActivity: () => void;
  resetInactivityTimer: () => void;
  setInactivityWarning: (warning: boolean) => void;
}

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      lastActivity: null,
      inactivityWarning: false,
      setAuth: (token, user) => set({ token, user, lastActivity: Date.now(), inactivityWarning: false }),
      logout: async () => {
        try {
          if (get().token) {
            await authApi.logout();
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ token: null, user: null, lastActivity: null, inactivityWarning: false });
        }
      },
      isAuthenticated: () => !!get().token,
      updateActivity: () => set({ lastActivity: Date.now() }),
      resetInactivityTimer: () => set({ lastActivity: Date.now(), inactivityWarning: false }),
      setInactivityWarning: (warning) => set({ inactivityWarning: warning }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

// Inactivity checker - runs every minute
if (typeof window !== 'undefined') {
  setInterval(() => {
    const state = useAuthStore.getState();
    if (!state.token || !state.lastActivity) return;

    const now = Date.now();
    const inactiveTime = now - state.lastActivity;

    // Show warning 5 minutes before timeout
    if (inactiveTime >= INACTIVITY_TIMEOUT - WARNING_TIMEOUT && inactiveTime < INACTIVITY_TIMEOUT && !state.inactivityWarning) {
      state.setInactivityWarning(true);
    }

    // Auto logout after 30 minutes of inactivity
    if (inactiveTime >= INACTIVITY_TIMEOUT) {
      state.logout();
      window.location.href = '/login';
    }
  }, 60000); // Check every minute
}

// Activity listeners
if (typeof window !== 'undefined') {
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  
  activityEvents.forEach(event => {
    window.addEventListener(event, () => {
      const state = useAuthStore.getState();
      if (state.token) {
        state.updateActivity();
        if (state.inactivityWarning) {
          state.setInactivityWarning(false);
        }
      }
    });
  });
}
