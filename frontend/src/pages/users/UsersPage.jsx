import React, { useState } from "react";
import CustomTable from "../../components/CustomTable";
import { Spinner, Alert, Button } from "react-bootstrap";
import dayjs from "dayjs";
import { useUsers, useDeleteUser } from "../../hooks/useUsers";
import { useAuth } from "../../context/AuthContext";
import AddUserModal from "../../components/users/AddUserModal";
import EditUserModal from "../../components/users/EditUserModal";
import { toast } from "react-toastify";

const UsersPage = () => {
  const { data: users = [], isLoading, error, refetch } = useUsers();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const deleteUserMutation = useDeleteUser();

  const canEdit = user?.permissions?.users?.includes("edit_users");
  const canDelete = user?.permissions?.users?.includes("delete_users");
  const canCreate = user?.permissions?.users?.includes("create_users");

  const columns = [
    { header: "Name", accessor: "full_name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "roles" },
    { header: "Status", accessor: "user_status" },
    {
      header: "Created At",
      accessor: (row) => dayjs(row.created_at).format("MMM D, YYYY h:mm A"),
    },
  ];

  const handleEdit = (row) => {
    setEditUser(row);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.full_name}?`)) {
      try {
        await deleteUserMutation.mutateAsync(row.user_id);
        refetch();
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Users</h3>
        {canCreate && (
          <Button onClick={() => setShowAddModal(true)} variant="primary">
            + Add User
          </Button>
        )}
      </div>

      {error ? (
        <Alert variant="danger">Failed to load users.</Alert>
      ) : (
        <CustomTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          itemsPerPage={5}
          showActions={true}
          showEdit={canEdit}
          showDelete={canDelete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AddUserModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          refetch();
        }}
      />

      <EditUserModal
        show={!!editUser}
        user={editUser}
        onClose={() => setEditUser(null)}
        onSuccess={() => {
          toast.success("User Updated Successfully")
          setEditUser(null);
          refetch();
        }}
      />
    </div>
  );
};

export default UsersPage;
