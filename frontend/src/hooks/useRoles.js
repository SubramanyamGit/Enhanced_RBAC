import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstanceWithToken } from "../api/axiosInstance";

export const useGetRoles = () =>
  useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await axiosInstanceWithToken.get("/roles");
      return res.data;
    },
  });

export const useCreateRole = () =>
  useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstanceWithToken.post("/roles", data);
      return res.data;
    },
  });

export const useUpdateRole = () =>
  useMutation({
    mutationFn: async ({ role_id, data }) => {
      const res = await axiosInstanceWithToken.patch(`/roles/${role_id}`, data);
      return res.data;
    },
  });

export const useDeleteRole = () =>
  useMutation({
    mutationFn: async (role_id) => {
      const res = await axiosInstanceWithToken.delete(`/roles/${role_id}`);
      return res.data;
    },
  });
