import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstanceWithToken } from '../api/axiosInstance';

export const usePermissions = () =>
  useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const res = await axiosInstanceWithToken.get('/permissions');
      return res.data;
    },
  });

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstanceWithToken.post('/permissions', data),
    onSuccess: () => queryClient.invalidateQueries(['permissions']),
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => axiosInstanceWithToken.patch(`/permissions/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['permissions']),
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstanceWithToken.delete(`/permissions/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['permissions']),
  });
};
