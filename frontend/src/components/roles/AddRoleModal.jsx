import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateRole } from '../../hooks/useRoles';
import { toast } from 'react-toastify';
import { useDepartments } from '../../hooks/useDepartments';
import { usePermissions } from '../../hooks/usePermissions'; //   create/use this hook
import Select from 'react-select';

const AddRoleModal = ({ show, onClose, onSuccess }) => {
  const createRole = useCreateRole();
  const { data: departments = [] } = useDepartments();
  const { data: permissions = [] } = usePermissions(); //   fetch permissions

  const [permissionOptions, setPermissionOptions] = useState([]);

  useEffect(() => {
   if (Array.isArray(permissions)) {
  setPermissionOptions(
    permissions.map(p => ({
      value: p.permission_id,
      label: p.name,
    }))
  );
}
  }, [permissions]);

  const formik = useFormik({
    initialValues: {
      name: '',
      department_id: '',
      permission_ids: [], //   new field
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Role name is required'),
      department_id: Yup.string().required('Department is required'),
      permission_ids: Yup.array().min(1, 'At least one permission is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await createRole.mutateAsync({
          name: values.name,
          department_id: values.department_id,
          permission_ids: values.permission_ids.map(p => p.value),
        });
        toast.success('Role created successfully');
        resetForm();
        onSuccess();
        onClose();
      } catch (err) {
        // toast.error('Failed to create role');
      }
    },
  });

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Label>Role Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.touched.name && !!formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Department</Form.Label>
            <Form.Select
              name="department_id"
              value={formik.values.department_id}
              onChange={formik.handleChange}
              isInvalid={formik.touched.department_id && !!formik.errors.department_id}
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.department_id}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Permissions</Form.Label>
            <Select
              options={permissionOptions}
              isMulti
              name="permission_ids"
              onChange={(selected) => formik.setFieldValue('permission_ids', selected)}
              value={formik.values.permission_ids}
              onBlur={() => formik.setFieldTouched('permission_ids', true)}
                            closeMenuOnSelect={false}
            />
            {formik.touched.permission_ids && formik.errors.permission_ids && (
              <div className="text-danger mt-1">{formik.errors.permission_ids}</div>
            )}
          </Form.Group>

          <Button
            type="submit"
            className="mt-4"
            variant="primary"
            disabled={createRole.isLoading}
          >
            {createRole.isLoading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddRoleModal;
