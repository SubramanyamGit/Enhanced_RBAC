import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { useUsers } from "../../hooks/useUsers";
import { useAuth } from "../../context/AuthContext";

const UsersPage = () => {
  const { data: users, isLoading, error } = useUsers();
  const { user } = useAuth();

  const canEdit = user?.permissions?.users?.includes("edit_users");

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Failed to load users.</Alert>;

  return (
    <div>
      <h3 className="mb-4">Users</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            {canEdit && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users?.map((u) => (
            <tr key={u.user_id}>
              <td>{u.full_name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              {canEdit && (
                <td>
                  <Button variant="outline-primary" size="sm">
                    Edit
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersPage;
