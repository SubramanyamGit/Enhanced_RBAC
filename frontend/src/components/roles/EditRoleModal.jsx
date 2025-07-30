import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateRole } from "../../hooks/useRoles";
import { toast } from "react-toastify";
import { useDepartments } from "../../hooks/useDepartments";
import { usePermissions } from "../../hooks/usePermissions";
import Select from "react-select";

const EditRoleModal = ({ show, role, onClose, onSuccess }) => {
  const updateRole = useUpdateRole();
  const { data: departments = [] } = useDepartments();
  const { data: permissions = [] } = usePermissions();

  const [assignedPermissions, setAssignedPermissions] = useState([]);
  const [unassignedPermissions, setUnassignedPermissions] = useState([]);
  const [permissionOptions, setPermissionOptions] = useState([]);

  useEffect(() => {
    if (permissions && role?.permission_ids) {
      const assigned = permissions.filter(p =>
        role.permission_ids.includes(p.permission_id)
      );
      const unassigned = permissions.filter(p =>
        !role.permission_ids.includes(p.permission_id)
      );

      setAssignedPermissions(
        assigned.map(p => ({ value: p.permission_id, label: p.name }))
      );
      setUnassignedPermissions(
        unassigned.map(p => ({ value: p.permission_id, label: p.name }))
      );

      setPermissionOptions(
        permissions.map(p => ({ value: p.permission_id, label: p.name }))
      );
    }
  }, [permissions, role]);

  const formik = useFormik({
    initialValues: {
      name: "",
      department_id: "",
      grant_permissions: [],
      revoke_permissions: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Role name is required"),
      department_id: Yup.string().required("Department is required"),
    }),
    onSubmit: async (values) => {
      try {
        await updateRole.mutateAsync({
          role_id: role.role_id,
          data: {
            name: values.name,
            department_id: values.department_id,
            grant_permissions: values.grant_permissions.map(p => p.value),
            revoke_permissions: values.revoke_permissions.map(p => p.value),
          },
        });
        toast.success("Role updated successfully");
        onSuccess();
      } catch {
        // toast.error("Failed to update role");
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (role) {
      formik.setValues({
        name: role.name || "",
        department_id: role.department_id || "",
        grant_permissions: [],
        revoke_permissions: [],
      });
    }
  }, [role]);

  if (!role) return null;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Role</Modal.Title>
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
              isInvalid={
                formik.touched.department_id && !!formik.errors.department_id
              }
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
            <Form.Label>Revoke Permissions</Form.Label>
            <Select
              isMulti
              options={assignedPermissions}
              value={formik.values.revoke_permissions}
              onChange={(selected) =>
                formik.setFieldValue("revoke_permissions", selected)
              }
              closeMenuOnSelect={false}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Grant Permissions</Form.Label>
            <Select
              isMulti
              options={unassignedPermissions}
              value={formik.values.grant_permissions}
              onChange={(selected) =>
                formik.setFieldValue("grant_permissions", selected)
              }
              closeMenuOnSelect={false}
            />
          </Form.Group>

          <Button
            type="submit"
            className="mt-4"
            variant="primary"
            disabled={updateRole.isLoading}
          >
            {updateRole.isLoading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditRoleModal;
