import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useUpdateDepartment } from '../../hooks/useDepartments';
import { toast } from 'react-toastify'; //   Import toast

const EditDepartmentModal = ({ show, department, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const updateMutation = useUpdateDepartment();

  useEffect(() => {
    if (department) {
      setName(department.name || '');
      setDescription(department.description || '');
    }
  }, [department]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isSame =
      name.trim() === (department?.name || '').trim() &&
      description.trim() === (department?.description || '').trim();

    if (isSame) {
      toast.info('No changes found');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        department_id: department.department_id,
        data: { name, description },
      });
      toast.success('Department updated successfully');
      onSuccess();
    } catch (err) {
      // toast console.error('Failed to update department');
    }
  };

  if (!department) return null;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Department</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Department Name</Form.Label>
            <Form.Control
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Updating...' : 'Update'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditDepartmentModal;
