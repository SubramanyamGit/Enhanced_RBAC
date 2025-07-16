import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../api/axiosInstance";

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (values) => {
      const res = await axiosInstance.post("/sign_in", values);
      return res.data; // contains token and user
    },
  });
};
