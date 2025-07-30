import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../src/context/AuthContext";
import { useAxiosInterceptor } from "./hooks/useAxiosInterceptor";

// Pages
import SignInPage from "./pages/auth/SignInPage";
import SetNewPasswordPage from "./pages/auth/SetNewPasswordPage";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import UsersPage from "./pages/users/UsersPage";
import RolesPage from "./pages/roles/RolesPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import DepartmentsPage from "./pages/departments/DepartmentsPage";
import PermissionsPage from "./pages/permissions/PermissionsPage";
import MenuPage from "./pages/menu/MenuPage";
import RequestPage from "./pages/requests/RequestsPage";

function App() {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, []);

  useAxiosInterceptor();

  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/set-new-password" element={<SetNewPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="admin/users" element={<UsersPage />} />
        <Route path="admin/departments" element={<DepartmentsPage />} />
        <Route path="admin/roles" element={<RolesPage />} />
        <Route path="admin/menus" element={<MenuPage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="requests" element={<RequestPage />} />
      </Route>
    </Routes>
  );
}

export default App;
