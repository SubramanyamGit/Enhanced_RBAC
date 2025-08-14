import { Navbar, Container, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../styles/layout.css';

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const initial = user?.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <Navbar className="navbar-custom bg-custom-blue text-white px-4 w-100" expand="lg">
      <Container fluid className="justify-content-between align-items-center">
        <Navbar.Brand
          as={Link}
          to="/dashboard"
          className="text-white fw-bold"
          style={{ textDecoration: "none" }}
        >
          RBAC System
        </Navbar.Brand>

        <Dropdown align="end">
          <Dropdown.Toggle
            as="div"
            className="custom-avatar-toggle"
            id="avatar-toggle"
          >
            {initial}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item disabled>{user?.full_name}</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
