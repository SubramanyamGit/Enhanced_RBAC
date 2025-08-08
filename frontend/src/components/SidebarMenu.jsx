import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaLock, FaCheck, FaBars, FaFolder } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; //   context hook
import "../styles/layout.css";

// icon mapping based on menu_key
const icons = {
  users: <FaUsers className="me-2" />,
  roles: <FaLock className="me-2" />,
  approvals: <FaCheck className="me-2" />,
  departments: <FaFolder className="me-2" />, //   new key
};

const SidebarMenu = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth(); //   Get menu from context

  const menuItems = user?.menu || []; // safe fallback

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
        {menuItems.map((item) => (
          <Nav.Link
            key={item.route}
            as={Link}
            to={item.route}
            className={location.pathname === item.route ? "active" : ""}
          >
            {icons[item.key] || <FaFolder className="me-2" />} {/* default icon */}
            {!collapsed && item.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default SidebarMenu;
