// src/components/auth/ForgotPasswordModal.jsx
import { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { toast } from 'react-toastify';

export default function ForgotPasswordModal({ show, onClose }) {
  const [email, setEmail] = useState('');
  const { mutateAsync, isLoading } = useForgotPassword();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await mutateAsync(email.trim());
      toast.success('If the email exists, a temporary password was sent.');
      setEmail('');
      onClose?.();
    } catch {
      // we still keep the same UI message to avoid user enumeration
      toast.success('If the email exists, a temporary password was sent.');
      onClose?.();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your account email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Send temporary password'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
