// hooks/useRequests.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstanceWithToken } from '../api/axiosInstance';

export const useRequestsByStatus = (status) =>
  useQuery({
    queryKey: ['requests', status],
    queryFn: async () => {
      const res = await axiosInstanceWithToken.get(`/requests?status=${status}`);
      return res.data;
    },
  });


export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axiosInstanceWithToken.post('/requests', data),
    onSuccess: () => queryClient.invalidateQueries(['requests']),
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, requested_by, permission_id, permission_name }) =>
      axiosInstanceWithToken.patch(`/requests/${id}/approve`, {
        requested_by,
        permission_id,
        permission_name,
      }),
    onSuccess: () => queryClient.invalidateQueries(['requests']),
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejection_reason, requested_by, permission_id, permission_name }) =>
      axiosInstanceWithToken.patch(`/requests/${id}/reject`, {
        rejection_reason,
        requested_by,
        permission_id,
        permission_name,
      }),
    onSuccess: () => queryClient.invalidateQueries(['requests']),
  });
};

