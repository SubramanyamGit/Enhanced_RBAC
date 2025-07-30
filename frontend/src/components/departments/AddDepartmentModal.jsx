import React from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateDepartment } from '../../hooks/useDepartments';
import { toast } from 'react-toastify';

const AddDepartmentModal = ({ show, onClose, onSuccess }) => {
  const createDepartment = useCreateDepartment();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .required('Department name is required'),
      description: Yup.string().max(1000, 'Description too long'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await createDepartment.mutateAsync(values);
        toast.success('Department created successfully');
        resetForm();
        onSuccess();
      } catch (err) {
        // toast.error('Failed to create department');
      }
    },
  });

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Department</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Label>Department Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && !!formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.description && !!formik.errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="mt-4"
            disabled={createDepartment.isLoading}
          >
            {createDepartment.isLoading ? (
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

export default AddDepartmentModal;
