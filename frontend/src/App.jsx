import { Routes, Route, useNavigate } from "react-router-dom";
import SignInPage from "./pages/auth/SignInPage";
import AppLayout from "./components/AppLayout";
import UsersPage from "./pages/users/UsersPage";
import RolesPage from "./pages/roles/RolesPage";
// import ApprovalsPage from "./pages/admin/ApprovalsPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { useEffect } from "react";
import { useAuth } from "../src/context/AuthContext";
import { useAxiosInterceptor } from "./hooks/useAxiosInterceptor";
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

      {/* All authenticated routes use the same layout */}
      <Route path="/" element={<AppLayout />}>
        {/* Admin-only routes */}
        <Route path="admin/users" element={<UsersPage />} />
        <Route path="admin/departments" element={<DepartmentsPage />} />
        <Route path="admin/roles" element={<RolesPage />} />
        <Route path="admin/menus" element={<MenuPage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="requests" element={<RequestPage />} />

        <Route path="dashboard" element={<DashboardPage />} />

        {/* Regular user routes */}
        {/* <Route path="dashboard" element={<DashboardPage />} /> */}
        {/* <Route path="profile" element={<ProfilePage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
