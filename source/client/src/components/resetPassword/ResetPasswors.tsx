import { TextField, Button, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../../style/signupForm.scss";
import { resetPasswort } from "../../services/resetPasswordService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one digit")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("Password is required")
    .test("no-noSQL", "Invalid password", (value) => {
      return !/[{}$]/.test(value);
    }),

  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const response = await resetPasswort(token, values.password); // resets the password
        if (response.success) {
          toast.success("Password changed successfully..");
          navigate("/login");
        } else {
          toast.error(response.message||"Something went wrong.");
        }
        setSubmitting(false);
      }}
    >
      {() => (
        <Form
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Box className="landing-page__box">
            <h2>Reset Your Password</h2>
            <p>Please enter a new password and confirm it.</p>

            <Field
              name="password"
              as={TextField}
              label="New Password"
              fullWidth
              variant="outlined"
              type="password"
              helperText={<ErrorMessage name="password" />}
              error={Boolean(<ErrorMessage name="password" />)}
            />

            <Field
              name="confirmPassword"
              as={TextField}
              label="Confirm Password"
              fullWidth
              variant="outlined"
              type="password"
              helperText={<ErrorMessage name="confirmPassword" />}
              error={Boolean(<ErrorMessage name="confirmPassword" />)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="landing-page__button"
            >
              Reset Password
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordReset;
