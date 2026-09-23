import api from './api';

export interface Session {
  id: string;
  userId: string;
  token: string;
  deviceInfo?: string;
  ipAddress?: string;
  lastActivity: string;
  expiresAt: string;
  createdAt: string;
}

export const sessionsApi = {
  getSessions: async (): Promise<Session[]> => {
    const response = await api.get('/sessions');
    return response.data;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/sessions/${sessionId}`);
  },

  deleteAllSessions: async (): Promise<{ message: string; count: number }> => {
    const response = await api.delete('/sessions/all');
    return response.data;
  },

  deleteOtherSessions: async (): Promise<{ message: string; count: number }> => {
    const response = await api.delete('/sessions/other');
    return response.data;
  },
};
