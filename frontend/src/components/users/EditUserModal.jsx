import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Button, Form } from "react-bootstrap";
import { useUpdateUser } from "../../hooks/useUsers";
import { useGetRoles } from "../../hooks/useRoles";

const EditUserModal = ({ show, user, onClose, onSuccess }) => {
  const updateUser = useUpdateUser();
  const { data: roles = [] } = useGetRoles();
console.log("user",user);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      full_name: user?.full_name || "",
      user_status: user?.user_status || "Active",
      role_id: user?.role_id || "",
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required("Name is required"),
      user_status: Yup.string().required("Status is required"),
      role_id: Yup.number().required("Role is required"),
    }),
    onSubmit: async (values) => {
      try {
        await updateUser.mutateAsync({ user_id: user.user_id, data: values });
        onSuccess();
      } catch (err) {
        console.error("Update error", err);
      }
    },
  });

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="full_name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formik.values.full_name}
              onChange={formik.handleChange}
              isInvalid={formik.touched.full_name && !!formik.errors.full_name}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.full_name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="user_status" className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="user_status"
              value={formik.values.user_status}
              onChange={formik.handleChange}
              isInvalid={formik.touched.user_status && !!formik.errors.user_status}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.user_status}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="role_id" className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role_id"
              value={formik.values.role_id}
              onChange={formik.handleChange}
              isInvalid={formik.touched.role_id && !!formik.errors.role_id}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.role_id}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={updateUser.isLoading}>
              {updateUser.isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserModal;
