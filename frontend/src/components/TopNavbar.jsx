import { Navbar, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import '../styles/layout.css'
const TopNavbar = () => {
  const { user } = useAuth();
  const initial = user?.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <Navbar className="navbar-custom bg-custom-blue text-white px-4 w-100" expand="lg">
      <Container fluid className="justify-content-between align-items-center">
        <Navbar.Brand className="text-white fw-bold">RBAC System</Navbar.Brand>

        <div
          className="d-flex align-items-center justify-content-center rounded-circle bg-white text-primary fw-semibold"
          style={{ width: 36, height: 36, fontSize: 16 }}
        >
          {initial}
        </div>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
