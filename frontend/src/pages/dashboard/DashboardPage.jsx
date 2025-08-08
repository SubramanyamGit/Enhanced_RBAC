import { Card, Row, Col } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const { full_name, role, permissions } = user || {};

  const hasUsersAccess = permissions?.users?.includes("view_users");
  const hasRolesAccess = permissions?.roles?.includes("view_roles");
  const hasApprovalsAccess = permissions?.approvals?.includes("approve_permission_requests");

  return (
    <div className="dashboard w-100 h-100 ">
      <div className="mb-4">
        <h2 className="fw-semibold text-dark">Dashboard</h2>
        <p className="text-muted">Welcome back, <strong>{full_name}</strong></p>
      </div>

      <Row className="g-4">
        {hasUsersAccess && (
          <Col md={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h5 className="text-primary mb-2">👤 Users</h5>
                <p className="text-muted">Manage and view users assigned to roles.</p>
              </Card.Body>
            </Card>
          </Col>
        )}

        {hasRolesAccess && (
          <Col md={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h5 className="text-primary mb-2">🔐 Roles</h5>
                <p className="text-muted">View, assign, and modify role definitions.</p>
              </Card.Body>
            </Card>
          </Col>
        )}

        {hasApprovalsAccess && (
          <Col md={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h5 className="text-primary mb-2">  Approvals</h5>
                <p className="text-muted">Review and approve access requests.</p>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default DashboardPage;
