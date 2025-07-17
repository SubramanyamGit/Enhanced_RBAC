import { useQuery } from "@tanstack/react-query";
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
