import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstanceWithToken } from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isPasswordChanged,setIsPasswordChanged] = useState(localStorage.getItem("isPasswordChanged"))
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user details (roles + permissions)
  const fetchUser = async () => {
    try {
      const res = await axiosInstanceWithToken.get("/users/my_permissions");
      setUser(res.data);
    } catch (err) {
        console.error(" Failed to fetch user:", err);
      // logout(); // token might be invalid
    }
  };

  useEffect(() => {
    if (token) fetchUser();
  }, [token]);

  const login = (jwtToken,mustChangePassword) => {
      console.log("jwtToken", jwtToken);
    localStorage.setItem("isPasswordChanged", !mustChangePassword);

    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout,isPasswordChanged }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
