import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUpdatePermission } from '../../hooks/usePermissions';
import { toast } from 'react-toastify';

const EditPermissionModal = ({ show, permission, onClose, onSuccess }) => {
  const updatePermission = useUpdatePermission();
console.log("permos",permission);

  const formik = useFormik({
    initialValues: {
      name: permission?.name || '',
      description: permission?.description || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Permission name is required'),
    }),
    onSubmit: async (values) => {
      try {
        await updatePermission.mutateAsync({ id: permission.permission_id, data: values });
        toast.success('Permission updated');
        onSuccess();
      } catch {
        // toast.error('Failed to update permission');
      }
    },
  });

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Permission</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Label>Permission Name</Form.Label>
            <Form.Control
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
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </Form.Group>

          <Button type="submit" className="mt-4" variant="primary">Update</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPermissionModal;
