import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, isPasswordChanged } = useAuth();

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (!isPasswordChanged) {
    return <Navigate to="/set-new-password" replace />;
  }

  return children;
};

export default ProtectedRoute;
