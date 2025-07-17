import React from 'react';
import CustomTable from '../../components/CustomTable';
import { Spinner, Alert } from 'react-bootstrap';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';

const UsersPage = () => {
  const { data: users = [], isLoading, error } = useUsers();
  const { user } = useAuth();
  console.log(user);
  
  const canEdit = user?.permissions?.users?.includes('edit_users');
  const canDelete = user?.permissions?.users?.includes('delete_users');

  const columns = [
    { header: 'Name', accessor: 'full_name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'roles' },
    { header: 'Status', accessor: 'user_status' }
  ];

  const handleEdit = (row) => {
    console.log('Edit user:', row);
    // Open modal or route to edit form
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.full_name}?`)) {
      console.log('Delete user:', row);
      // Call mutation to delete user
    }
  };

  return (
    <div className="p-4">
      <h3 className="mb-4">Users</h3>

      {error ? (
        <Alert variant="danger">Failed to load users.</Alert>
      ) : (
        <CustomTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          itemsPerPage={5}
          showActions={canEdit || canDelete}
          onEdit={canEdit ? handleEdit : undefined}
          onDelete={canDelete ? handleDelete : undefined}
        />
      )}
    </div>
  );
};

export default UsersPage;
