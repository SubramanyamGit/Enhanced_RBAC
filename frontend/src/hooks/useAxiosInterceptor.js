import { useEffect } from "react";
import { axiosInstanceWithToken } from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export const useAxiosInterceptor = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const interceptor = axiosInstanceWithToken.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;

        if (status === 401) {
          toast.error("Session expired. Please sign in again.");
          logout(); // Token expired or unauthorized
        } else {
          // Show global toast for all other errors (403, 404, 500, etc.)
          const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "An unexpected error occurred.";
          toast.error(message);
        }

        return Promise.reject(error);
      }
    );

    return () =>
      axiosInstanceWithToken.interceptors.response.eject(interceptor);
  }, [logout]);
};
