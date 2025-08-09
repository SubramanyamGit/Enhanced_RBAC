import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import CustomTable from "../../components/CustomTable";
import {
  usePermissions,
  useDeletePermission,
} from "../../hooks/usePermissions";
import { useAuth } from "../../context/AuthContext";
import AddPermissionModal from "../../components/permissions/AddPermissionModal";
import EditPermissionModal from "../../components/permissions/EditPermissionModal";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const PermissionsPage = () => {
  const {
    data: permissions = [],
    isLoading,
    error,
    refetch,
  } = usePermissions();
  const deletePermission = useDeletePermission();
  const { user } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editPermission, setEditPermission] = useState(null);

  const canCreate =
    user?.permissions?.permissions?.includes("create_permissions");
  const canEdit = user?.permissions?.permissions?.includes("edit_permissions");
  const canDelete =
    user?.permissions?.permissions?.includes("delete_permissions");

  const columns = [
    { header: "Permission Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Created At",
      accessor: (row) => dayjs(row.created_at).format("MMM D, YYYY h:mm A"),
    },
    {
      header: "Updated At",
      accessor: (row) => dayjs(row.updated_at).format("MMM D, YYYY h:mm A"),
    },
  ];

  const handleEdit = (permission) => setEditPermission(permission);

  const handleDelete = async (permission) => {
    if (window.confirm(`Delete permission "${permission.permission_name}"?`)) {
      try {
        await deletePermission.mutateAsync(permission.permission_id);
        toast.success("Permission deleted");
        refetch();
      } catch {
        // toast console.error("Failed to delete permission");
      }
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Permissions</h3>
        {canCreate && (
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add Permission
          </Button>
        )}
      </div>

      {error ? (
        <Alert variant="danger">Failed to load permissions.</Alert>
      ) : (
        <CustomTable
          columns={columns}
          data={permissions}
          isLoading={isLoading}
          itemsPerPage={10}
          showActions={true}
          showEdit={canEdit}
          showDelete={canDelete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AddPermissionModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          refetch();
        }}
      />

      <EditPermissionModal
        show={!!editPermission}
        permission={editPermission}
        onClose={() => setEditPermission(null)}
        onSuccess={() => {
          setEditPermission(null);
          refetch();
        }}
      />
    </div>
  );
};

export default PermissionsPage;
