// hooks/useMenu.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstanceWithToken } from '../api/axiosInstance';

export const useMenus = () =>
  useQuery({
    queryKey: ['menus'],
    queryFn: async () => {
      const res = await axiosInstanceWithToken.get('/menus');
      return res.data;
    },
  });

export const useCreateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstanceWithToken.post('/menus', data),
    onSuccess: () => queryClient.invalidateQueries(['menus']),
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => axiosInstanceWithToken.patch(`/menus/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['menus']),
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstanceWithToken.delete(`/menus/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['menus']),
  });
};
