import { Row, Col } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import PermissionsOverview from "../../components/PermissionsOverview"; // adjust path

const DashboardPage = () => {
  const { user } = useAuth();
  const { full_name, permissions } = user || {};

  return (
    <div className="dashboard w-100 h-100">
      <div className="mb-4">
        <h2 className="fw-semibold text-dark">Dashboard</h2>
        <p className="text-muted">
          Welcome back, <strong>{full_name || "User"}</strong>
        </p>
      </div>

      <Row className="g-4">
        <Col xs={12}>
          <PermissionsOverview permissions={permissions} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
