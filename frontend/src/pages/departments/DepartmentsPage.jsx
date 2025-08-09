import React, { useState } from 'react';
import CustomTable from '../../components/CustomTable';
import { Alert, Button } from 'react-bootstrap';
import { useDepartments, useDeleteDepartment } from '../../hooks/useDepartments';
import { useAuth } from '../../context/AuthContext';
import AddDepartmentModal from '../../components/departments/AddDepartmentModal';
import EditDepartmentModal from '../../components/departments/EditDepartmentModal';
import { toast } from 'react-toastify'; //   import toast

const DepartmentsPage = () => {
  const { data: departments = [], isLoading, error, refetch } = useDepartments();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);

  const deleteMutation = useDeleteDepartment();

  const canEdit = user?.permissions?.departments?.includes('edit_departments');
  const canDelete = user?.permissions?.departments?.includes('delete_departments');
  const canCreate = user?.permissions?.departments?.includes('create_departments');

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Created At', accessor: 'created_at' },
  ];

  const handleEdit = (row) => {
    setEditDepartment(row);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete "${row.name}"?`)) {
      try {
        await deleteMutation.mutateAsync(row.department_id);
        toast.success('Department deleted successfully'); //   success toast
        refetch();
      } catch (err) {
        // toast console.error('Failed to delete department'); // 
      }
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Departments</h3>
        {canCreate && (
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add Department
          </Button>
        )}
      </div>

      {error ? (
        <Alert variant="danger">Failed to load departments.</Alert>
      ) : (
        <CustomTable
          columns={columns}
          data={departments}
          isLoading={isLoading}
          itemsPerPage={5}
          showActions={true}
          showEdit={canEdit}
          showDelete={canDelete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/*   Add Department Modal */}
      <AddDepartmentModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          refetch();
        }}
      />

      {/*   Edit Department Modal */}
      <EditDepartmentModal
        show={!!editDepartment}
        department={editDepartment}
        onClose={() => setEditDepartment(null)}
        onSuccess={() => {
          setEditDepartment(null);
          refetch();
        }}
      />
    </div>
  );
};

export default DepartmentsPage;
