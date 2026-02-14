import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { authAPI } from '@/lib/api';
import type { LoginRequest, RegisterRequest } from '@/types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const response = await authAPI.login(credentials);
        setAuth(response.data.user, response.data.access_token);
        toast.success('Login realizado com sucesso!');
        router.push('/dashboard');
      } catch (error: any) {
        const message = error.response?.data?.message || 'Erro ao fazer login';
        toast.error(message);
        throw error;
      }
    },
    [setAuth, router],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        const response = await authAPI.register(data);
        setAuth(response.data.user, response.data.access_token);
        toast.success('Conta criada com sucesso!');
        router.push('/dashboard');
      } catch (error: any) {
        const message = error.response?.data?.message || 'Erro ao criar conta';
        toast.error(message);
        throw error;
      }
    },
    [setAuth, router],
  );

  const handleLogout = useCallback(() => {
    logout();
    toast.success('Desconectado com sucesso!');
    router.push('/login');
  }, [logout, router]);

  return { login, register, logout: handleLogout };
};
