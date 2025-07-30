import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreatePermission } from '../../hooks/usePermissions';
import { toast } from 'react-toastify';

const AddPermissionModal = ({ show, onClose, onSuccess }) => {
  const createPermission = useCreatePermission();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Permission name is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await createPermission.mutateAsync(values);
        toast.success('Permission created');
        resetForm();
        onSuccess();
      } catch {
        // toast.error('Failed to create permission');
      }
    },
  });

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Permission</Modal.Title>
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

          <Button type="submit" className="mt-4" variant="primary">Create</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddPermissionModal;
