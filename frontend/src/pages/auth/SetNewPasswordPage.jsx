import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import loginImage from "../../assets/login-image.png";
import { useSetNewPassword } from "../../hooks/useSetNewPassword";
import { toast } from "react-toastify";

const SetNewPasswordPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useSetNewPassword();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  return (
    <Container fluid className="vh-100 p-0">
      <Row className="h-100 g-0">
        <Col
          md={6}
          className="d-none d-md-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#0b57d0" }}
        >
          {loginImage && (
            <img
              src={loginImage}
              alt="Reset Password"
              style={{ maxWidth: "70%", height: "auto" }}
            />
          )}
        </Col>

        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
            <h2 className="text-primary mb-4">Set New Password</h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                mutate(
                  { password: values.newPassword },
                  {
                    onSuccess: () => {
                      toast.success("Password Updated Suceesfully, Login Now!");
                      localStorage.removeItem("token");
                      localStorage.removeItem("isPasswordChanged");
                      navigate("/signin");
                    },
                  }
                );
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                errors,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group controlId="newPassword" className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      placeholder="Enter new password"
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.newPassword && !!errors.newPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.newPassword}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="confirmPassword" className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter new password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.confirmPassword && !!errors.confirmPassword
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100"
                    style={{ backgroundColor: "#0b57d0", border: "none" }}
                    disabled={isPending}
                  >
                    {isPending ? "Saving..." : "Set Password"}
                  </Button>

                  {error && (
                    <Alert variant="danger" className="mt-3">
                      {error.response?.data?.message || error.message}
                    </Alert>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SetNewPasswordPage;
