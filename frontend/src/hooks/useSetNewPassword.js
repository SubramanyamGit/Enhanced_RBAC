import { useMutation } from "@tanstack/react-query";
import { axiosInstanceWithToken } from "../api/axiosInstance";

export const useSetNewPassword = () => {
  return useMutation({
    mutationFn: async (values) => {
      const res = await axiosInstanceWithToken.post("/auth/set_password", values);
      return res.data;
    },
  });
};
