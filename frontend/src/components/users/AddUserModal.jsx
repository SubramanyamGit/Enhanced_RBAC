import { useCallback } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { axiosInstanceWithToken } from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useGetRoles } from "../../hooks/useRoles";

const AddUserModal = ({ show, onClose, onSuccess }) => {
  const { data: roles = [], isLoading: rolesLoading } = useGetRoles();

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
      role_id: "",
      user_status: "Active",
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-zA-Z]/, "Must contain letters")
        .matches(/[0-9]/, "Must contain numbers")
        .matches(/[!@#$%^&*]/, "Must include a special character")
        .required("Password is required"),
      role_id: Yup.string().required("Role is required"),
      user_status: Yup.string().oneOf(["Active", "Inactive"]),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await axiosInstanceWithToken.post("/users", values);
        toast.success("User created successfully");
        resetForm();
        onSuccess?.();
        onClose();
      } catch (err) {
        console.error(err);
        // toast.error("Failed to create user");
      }
    },
  });

  const { resetForm } = formik;

  const onCancelOrClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  return (
    <Modal show={show} onHide={onCancelOrClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formik.handleSubmit} noValidate>
        <Modal.Body>
          {rolesLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="full_name"
                  value={formik.values.full_name}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.full_name && !!formik.errors.full_name
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.full_name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.email && !!formik.errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.password && !!formik.errors.password
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role_id"
                  value={formik.values.role_id}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.role_id && !!formik.errors.role_id
                  }
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

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="user_status"
                  value={formik.values.user_status}
                  onChange={formik.handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onCancelOrClose}
            disabled={formik.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={formik.isSubmitting || rolesLoading}
          >
            {formik.isSubmitting ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Add User"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
