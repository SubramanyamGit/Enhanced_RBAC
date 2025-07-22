import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstanceWithToken } from "../api/axiosInstance";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstanceWithToken.get("/users");
      return res.data;
    },
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async ({ user_id, data }) => {
      const res = await axiosInstanceWithToken.patch(`/users/${user_id}`, data);
      return res.data;
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (user_id) => {
      const res = await axiosInstanceWithToken.delete(`/users/${user_id}`);
      return res.data;
    },
  });
};
