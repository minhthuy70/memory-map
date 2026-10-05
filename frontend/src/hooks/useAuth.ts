import { useAuthStore } from '@/store/auth-store';

export function useAuth() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return {
    token,
    user,
    userId,
  };
}
