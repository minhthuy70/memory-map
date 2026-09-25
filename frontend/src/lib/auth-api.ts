import api from './api';

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
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

export type LoginResponse = 
  | (AuthResponse & { requires2FA?: false })
  | { requires2FA: true; tempToken: string; message: string };

export interface TwoFactorStatusResponse {
  enabled: boolean;
  hasSecret: boolean;
  backupCodesCount: number;
  lastUsedAt?: string | null;
}

export interface TwoFactorGenerateResponse {
  secret: string;
  qrCodeUrl: string;
  otpauthUrl: string;
}

export interface TwoFactorEnableResponse {
  success: boolean;
  message: string;
  backupCodes: string[];
}

export interface TwoFactorBackupCodesResponse {
  success: boolean;
  backupCodes: string[];
}

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<LoginResponse> => {
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

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string; resetLink?: string }> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  verifyResetToken: async (token: string): Promise<{ valid: boolean; email: string }> => {
    const response = await api.get('/auth/verify-reset-token', { params: { token } });
    return response.data;
  },

  resetPassword: async (data: { token: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/reset-password', data);
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

  requestEmailChange: async (newEmail: string): Promise<{ success: boolean; message: string; newEmail: string; debugCode?: string }> => {
    const response = await api.post('/auth/request-email-change', { newEmail });
    return response.data;
  },

  confirmEmailChange: async (data: { code: string }): Promise<{ access_token: string; user: any; message: string }> => {
    const response = await api.post('/auth/confirm-email-change', data);
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

  // 2FA / TOTP Endpoints
  verify2FALogin: async (data: {
    tempToken: string;
    code: string;
    rememberMe?: boolean;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/2fa/verify', data);
    return response.data;
  },

  get2FAStatus: async (): Promise<TwoFactorStatusResponse> => {
    const response = await api.get('/auth/2fa/status');
    return response.data;
  },

  generate2FA: async (): Promise<TwoFactorGenerateResponse> => {
    const response = await api.post('/auth/2fa/generate');
    return response.data;
  },

  enable2FA: async (code: string): Promise<TwoFactorEnableResponse> => {
    const response = await api.post('/auth/2fa/enable', { code });
    return response.data;
  },

  disable2FA: async (data: { password?: string; code?: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/2fa/disable', data);
    return response.data;
  },

  generateBackupCodes: async (): Promise<TwoFactorBackupCodesResponse> => {
    const response = await api.post('/auth/2fa/backup-codes');
    return response.data;
  },
};
