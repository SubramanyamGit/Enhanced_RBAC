import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUpdateMenu } from '../../hooks/useMenu';
import { toast } from 'react-toastify';

const EditMenuModal = ({ show, menu, onClose, onSuccess }) => {
  const updateMenu = useUpdateMenu();

  const formik = useFormik({
    initialValues: {
      label: menu?.label || '',
      route: menu?.route || '',
      menu_key: menu?.menu_key || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      label: Yup.string().required('Label is required'),
      route: Yup.string().required('Route is required'),
      menu_key: Yup.string().required('Menu Key is required'),
    }),
    onSubmit: async (values) => {
      try {
        await updateMenu.mutateAsync({ id: menu.id, data: values });
        toast.success('Menu updated');
        onSuccess();
      } catch {
        // toast.error('Failed to update menu');
      }
    },
  });

  if (!menu) return null;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Menu</Modal.Title>
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

          <Button className="mt-4" type="submit" variant="primary">Update</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditMenuModal;
