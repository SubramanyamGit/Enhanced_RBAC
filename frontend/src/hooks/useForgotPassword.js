// src/hooks/useForgotPassword.js
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../api/axiosInstance';

export const useForgotPassword = () =>
  useMutation({
    mutationFn: async (email) => {
      const { data } = await axiosInstance.post('/sign_in/forgot-password', { email });
      return data;
    },
  });
