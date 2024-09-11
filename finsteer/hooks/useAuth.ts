import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../store/authSlice';
import { loginUser, registerUser, logoutUser } from '../services/api';
import { showNotification } from '../services/notifications';
import { RootState } from '../store';

export const useAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(setUser(data));
      router.push('/dashboard');
      showNotification('Login successful', 'success');
    },
    onError: (error: any) => {
      showNotification(error.message, 'error');
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      dispatch(setUser(data));
      router.push('/dashboard');
      showNotification('Registration successful', 'success');
    },
    onError: (error: any) => {
      showNotification(error.message, 'error');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(clearUser());
      router.push('/auth/login');
      showNotification('Logout successful', 'success');
    },
    onError: (error: any) => {
      showNotification(error.message, 'error');
    },
  });

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await loginMutation.mutateAsync({ email, password });
      } catch (error) {
        console.error('Login error:', error);
      }
    },
    [loginMutation],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        await registerMutation.mutateAsync({ name, email, password });
      } catch (error) {
        console.error('Registration error:', error);
      }
    },
    [registerMutation],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logoutMutation]);

  return { user, login, register, logout };
};