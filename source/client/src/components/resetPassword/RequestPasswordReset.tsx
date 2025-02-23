import React from "react";
import { TextField, Button, Box } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../../style/signupForm.scss";
import { forgotPasword } from "../../services/resetPasswordService";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .test("no-noSQL", "Invalid email", (value) => {
      return !/[{}$]/.test(value);
    }),
});

const PasswordResetRequest = () => {
  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const response = await forgotPasword(values.email); // sends a mail to reset password
        if (response.success) {
          toast.success("Reset link sent successfully.");
        } else {
          toast.error("Something went wrong. Please try again later.");
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
            <h2>Request Password Reset</h2>
            <p>Please enter your email address to receive a reset link.</p>

            <Field
              name="email"
              as={TextField}
              label="Email"
              fullWidth
              variant="outlined"
              helperText={<ErrorMessage name="email" />}
              error={Boolean(<ErrorMessage name="email" />)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="landing-page__button"
            >
              Send Reset Link
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordResetRequest;
