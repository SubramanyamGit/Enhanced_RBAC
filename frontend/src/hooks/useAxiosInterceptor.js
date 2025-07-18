import { useEffect } from "react";
import {axiosInstanceWithToken} from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export const useAxiosInterceptor = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const interceptor = axiosInstanceWithToken.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
        toast.error("Session expired. Please sign in again.");
          logout(); //logout on token expiry
        }
        return Promise.reject(error);
      }
    );

    return () => axiosInstanceWithToken.interceptors.response.eject(interceptor);
  }, [logout]);
};
