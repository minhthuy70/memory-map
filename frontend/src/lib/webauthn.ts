import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
} from '@simplewebauthn/browser';
import { authApi } from './auth-api';

export const parseWebAuthnError = (err: any): string => {
  if (!err) return 'Lỗi xác thực sinh trắc học không xác định.';
  const name = err.name || '';
  const message = err.message || '';

  if (name === 'NotAllowedError') {
    return 'Bạn đã hủy yêu cầu quét vân tay / nhận diện khuôn mặt.';
  }
  if (name === 'NotSupportedError') {
    return 'Trình duyệt hoặc thiết bị của bạn không hỗ trợ tính năng WebAuthn / Passkeys.';
  }
  if (name === 'InvalidStateError') {
    return 'Thiết bị hoặc cảm biến sinh trắc học này đã được đăng ký trước đó cho tài khoản của bạn.';
  }
  if (name === 'SecurityError') {
    return 'Lỗi bảo mật WebAuthn: Chỉ hoạt động trên HTTPS hoặc localhost.';
  }
  if (name === 'AbortError') {
    return 'Quá trình xác thực sinh trắc học đã bị gián đoạn.';
  }
  if (name === 'ConstraintError') {
    return 'Thiết bị không đáp ứng tiêu chuẩn bảo mật yêu cầu.';
  }

  return message || 'Xác thực sinh trắc học thất bại. Vui lòng thử lại.';
};

export const webauthnHelper = {
  /**
   * Check if current browser supports WebAuthn
   */
  isSupported: (): boolean => {
    if (typeof window === 'undefined') return false;
    return browserSupportsWebAuthn();
  },

  /**
   * Check if device has built-in biometric sensor (Touch ID, Windows Hello, Face ID)
   */
  isPlatformAuthenticatorAvailable: async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    try {
      return await platformAuthenticatorIsAvailable();
    } catch {
      return false;
    }
  },

  /**
   * Register new biometric credential / Passkey using WebAuthn API
   */
  registerBiometric: async (deviceName?: string) => {
    if (!webauthnHelper.isSupported()) {
      throw new Error('Trình duyệt của bạn không hỗ trợ WebAuthn / Sinh trắc học.');
    }

    try {
      // 1. Get options from backend
      const options = await authApi.getWebAuthnRegisterOptions();

      // 2. Invoke native browser biometric prompt (Windows Hello / Touch ID / Face ID)
      const regResponse = await startRegistration({ optionsJSON: options });

      // 3. Send response to backend for verification and storage
      const result = await authApi.verifyWebAuthnRegister({
        response: regResponse,
        deviceName: deviceName || 'Cảm biến vân tay / Khuôn mặt (Biometric)',
      });

      return result;
    } catch (err: any) {
      throw new Error(parseWebAuthnError(err));
    }
  },

  /**
   * Authenticate / Login using biometric credential / Passkey
   */
  loginWithBiometric: async (email?: string, rememberMe?: boolean) => {
    if (!webauthnHelper.isSupported()) {
      throw new Error('Trình duyệt của bạn không hỗ trợ WebAuthn / Sinh trắc học.');
    }

    try {
      // 1. Get login options from backend
      const options = await authApi.getWebAuthnLoginOptions(email);

      // 2. Invoke native browser biometric prompt
      const authResponse = await startAuthentication({ optionsJSON: options });

      // 3. Send response to backend for verification and session creation
      const result = await authApi.verifyWebAuthnLogin({
        response: authResponse,
        rememberMe,
      });

      return result;
    } catch (err: any) {
      throw new Error(parseWebAuthnError(err));
    }
  },
};
