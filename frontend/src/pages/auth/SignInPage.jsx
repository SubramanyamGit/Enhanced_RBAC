import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import loginImage from "../../assets/login-image.png"; // Optional

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const res = await axiosInstance.post("/sign_in", values);
      console.log(res.data.token)
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setStatus(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className="vh-100 p-0">
      <Row className="h-100 g-0">
        {/* Left side */}
        <Col
          md={6}
          className="d-none d-md-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#0b57d0" }}
        >
          {loginImage && (
            <img
              src={loginImage}
              alt="Login"
              style={{ maxWidth: "70%", height: "auto" }}
            />
          )}
        </Col>

        {/* Right side */}
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
            <h2 className=" text-primary mb-4">Sign In</h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                errors,
                isSubmitting,
                status,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.email && !!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="password" className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password && !!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100"
                    style={{ backgroundColor: "#0b57d0", border: "none" }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </Button>

                  {status && <Alert variant="danger" className="mt-3">{status}</Alert>}
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignInPage;
