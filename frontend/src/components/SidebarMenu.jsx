import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaLock, FaCheck, FaBars } from "react-icons/fa";
import { useState } from "react";
import "../styles/layout.css";

const icons = {
  users: <FaUsers className="me-2" />,
  roles: <FaLock className="me-2" />,
  approvals: <FaCheck className="me-2" />,
};

const SidebarMenu = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { key: "users", label: "Users", route: "/admin/users" },
    { key: "roles", label: "Roles", route: "/admin/roles" },
    { key: "approvals", label: "Approvals", route: "/admin/approvals" },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button
        className="btn text-white w-100 text-start mb-3"
        onClick={() => setCollapsed(!collapsed)}
      >
        <FaBars />
        {!collapsed && <span className="ms-2 fw-bold">RBAC</span>}
      </button>

      <Nav className="flex-column">
        {menu.map((item) => (
          <Nav.Link
            key={item.route}
            as={Link}
            to={item.route}
            className={location.pathname === item.route ? "active" : ""}
          >
            {icons[item.key]}
            {!collapsed && item.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default SidebarMenu;
