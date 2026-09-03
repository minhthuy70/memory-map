import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface OAuthData {
  provider: 'google' | 'facebook';
  email: string;
  name?: string;
  avatar?: string;
  providerId: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    isEmailVerified?: boolean;
  };
}

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  oauth: async (data: OAuthData): Promise<AuthResponse> => {
    const response = await api.post('/auth/oauth', data);
    return response.data;
  },

  sendVerificationCode: async (email: string): Promise<{ success: boolean; message: string; debugCode?: string }> => {
    const response = await api.post('/auth/send-verification-code', { email });
    return response.data;
  },

  verifyEmail: async (data: { email: string; code: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/verify-email', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData) => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  deactivateAccount: async () => {
    const response = await api.post('/auth/deactivate-account');
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/auth/delete-account');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
