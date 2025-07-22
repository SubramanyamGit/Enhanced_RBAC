// useDepartments.js
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstanceWithToken } from "../api/axiosInstance";

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await axiosInstanceWithToken.get("/departments");
      return res.data;
    },
  });
};

export const useCreateDepartment = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstanceWithToken.post("/departments", data);
      return res.data;
    },
  });
};

export const useUpdateDepartment = () => {
  return useMutation({
    mutationFn: async ({ department_id, data }) => {
      const res = await axiosInstanceWithToken.patch(`/departments/${department_id}`, data);
      return res.data;
    },
  });
};

export const useDeleteDepartment = () => {
  return useMutation({
    mutationFn: async (department_id) => {
      const res = await axiosInstanceWithToken.delete(`/departments/${department_id}`);
      return res.data;
    },
  });
};

