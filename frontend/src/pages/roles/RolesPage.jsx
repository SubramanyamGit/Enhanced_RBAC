import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import CustomTable from '../../components/CustomTable';
import { useGetRoles, useDeleteRole } from '../../hooks/useRoles';
import { useAuth } from '../../context/AuthContext';
import AddRoleModal from '../../components/roles/AddRoleModal';
import EditRoleModal from '../../components/roles/EditRoleModal';
import { toast } from 'react-toastify';

const RolesPage = () => {
  const { data: roles = [], isLoading, error, refetch } = useGetRoles();
  const deleteRole = useDeleteRole();
  const { user } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editRole, setEditRole] = useState(null);

  const canCreate = user?.permissions?.roles?.includes('create_roles');
  const canEdit = user?.permissions?.roles?.includes('edit_roles');
  const canDelete = user?.permissions?.roles?.includes('delete_roles');

  const columns = [
    { header: 'Role Name', accessor: 'name' },
    { header: 'Department', accessor: 'department_name' },
    { header: 'Created At', accessor: 'created_at' },
  ];

  const handleEdit = (role) => setEditRole(role);

  const handleDelete = async (role) => {
    if (window.confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      try {
        await deleteRole.mutateAsync(role.role_id);
        toast.success('Role deleted successfully');
        refetch();
      } catch (err) {
        // toast console.error('Failed to delete role');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Roles</h3>
        {canCreate && (
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add Role
          </Button>
        )}
      </div>

      {error ? (
        <Alert variant="danger">Failed to load roles.</Alert>
      ) : (
        <CustomTable
          columns={columns}
          data={roles}
          isLoading={isLoading}
          itemsPerPage={5}
          showActions={true}
          showEdit={canEdit}
          showDelete={canDelete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add Modal */}
      <AddRoleModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          refetch();
        }}
      />

      {/* Edit Modal */}
      <EditRoleModal
        show={!!editRole}
        role={editRole}
        onClose={() => setEditRole(null)}
        onSuccess={() => {
          setEditRole(null);
          refetch();
        }}
      />
    </div>
  );
};

export default RolesPage;
