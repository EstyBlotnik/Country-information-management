import React from "react";
import { TextField, Button, Grid, Box, Typography } from "@mui/material";
import { Formik, Field, Form, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { useUser } from "../../hooks/useUser";
import "../../style/signupForm.scss";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .test("no-noSQL", "Invalid first name", (value) => {
      return !/[{}$]/.test(value);
    }),
  lastName: Yup.string()
    .required("Last Name is required")
    .test("no-noSQL", "Invalid last name", (value) => {
      return !/[{}$]/.test(value);
    }),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .test("no-noSQL", "Invalid email format", (value) => {
      return !/[{}$]/.test(value);
    }),
  phoneNumber: Yup.string()
    .matches(/^(\d{10})$/, "Phone number must be 10 digits")
    .required("Phone number is required")
    .test("no-noSQL", "Invalid phoneNumber", (value) => {
      return !/[{}$]/.test(value);
    }),
  userName: Yup.string()
    .required("Username is required")
    .test("no-noSQL", "Invalid Username", (value) => {
      return !/[{}$]/.test(value);
    }),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one digit")
    .matches(/[\W_]/, "Password must contain at least one special character")
    .required("Password is required")
    .test("no-noSQL", "Invalid Password", (value) => {
      return !/[{}$]/.test(value);
    }),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  profilePicture: Yup.mixed().nullable(),
});

const SignupForm = () => {
  const { registerUser } = useUser();

  // Handles file input changes, updates form state.
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue("profilePicture", file);
    }
  };

  // Processes form data and submits it.
  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === "profilePicture" && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });

    console.log("FormData being sent:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    console.log("formData: " + formData);
    registerUser(formData as any);
  };

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        profilePicture: null,
        userName: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Box className="landing-page__box">
            <h2 className="landing-page__title">Sign Up</h2>
            <p className="landing-page__description">
              Please fill in your details to create an account
            </p>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Field name="firstName">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label="First Name"
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12} md={6}>
                <Field name="lastName">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Field name="email">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Field name="phoneNumber">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Field name="userName">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label="User Name"
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Field name="password">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Password"
                      type="password"
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Field name="confirmPassword">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label="confirm Password"
                      type="password"
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="contained"
                  color="primary"
                  startIcon={<PhotoCameraIcon />}
                  style={{
                    padding: "10px",
                    margin: "10px",
                    textAlign: "center",
                  }}
                >
                  upload profil image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                    hidden
                  />
                </Button>
                <ErrorMessage
                  name="profilePicture"
                  component="div"
                  className="error-message"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              className="landing-page__button"
            >
              Sign Up
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
