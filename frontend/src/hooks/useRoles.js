import { useQuery } from "@tanstack/react-query";
import { axiosInstanceWithToken } from "../api/axiosInstance";

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await axiosInstanceWithToken.get("/roles");
      return res.data;
    },
  });
};
