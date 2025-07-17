import SidebarMenu from "./SidebarMenu";
import TopNavbar from "./TopNavbar";
import { Outlet } from "react-router-dom";
import '../styles/layout.css'

const AppLayout = () => {
  return (
    <div className="vw-100 ">
      <TopNavbar />

      <div className="d-flex " style={{ minHeight: "calc(100vh - 60px)" }}>
        <SidebarMenu />

        <main className="flex-grow-1 p-4 " style={{ background: "#f8f9fa" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
