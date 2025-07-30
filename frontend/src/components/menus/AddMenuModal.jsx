import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateMenu } from '../../hooks/useMenu';
import { toast } from 'react-toastify';

const AddMenuModal = ({ show, onClose, onSuccess }) => {
  const createMenu = useCreateMenu();

  const formik = useFormik({
    initialValues: {
      label: '',
      route: '',
      menu_key: '',
    },
    validationSchema: Yup.object({
      label: Yup.string().required('Label is required'),
      route: Yup.string().required('Route is required'),
      menu_key: Yup.string().required('Menu Key is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await createMenu.mutateAsync(values);
        toast.success('Menu created');
        resetForm();
        onSuccess();
      } catch {
        // toast.error('Failed to create menu');
      }
    },
  });

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Menu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Label>Label</Form.Label>
            <Form.Control
              name="label"
              value={formik.values.label}
              onChange={formik.handleChange}
              isInvalid={formik.touched.label && !!formik.errors.label}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.label}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Route</Form.Label>
            <Form.Control
              name="route"
              value={formik.values.route}
              onChange={formik.handleChange}
              isInvalid={formik.touched.route && !!formik.errors.route}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.route}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Menu Key</Form.Label>
            <Form.Control
              name="menu_key"
              value={formik.values.menu_key}
              onChange={formik.handleChange}
              isInvalid={formik.touched.menu_key && !!formik.errors.menu_key}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.menu_key}
            </Form.Control.Feedback>
          </Form.Group>

          <Button className="mt-4" type="submit" variant="primary">Create</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddMenuModal;
