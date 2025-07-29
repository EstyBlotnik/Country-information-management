import React from "react";
import { TextField, Button, Grid, Box } from "@mui/material";
import { Formik, Field, Form, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { useUser } from "../../hooks/useUser";
import "../../style/signupForm.scss";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { INITIAL_USER } from "../../initial";
import { USER, USER_MESSAGES } from "../../constats";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required(USER_MESSAGES.FIRST_NAME_REQUIRED)
    .test(
      USER_MESSAGES.NO_SQL_TEST,
      USER_MESSAGES.FIRST_NAME_INVALID,
      (value) => {
        return !/[{}$]/.test(value);
      }
    ),
  lastName: Yup.string()
    .required(USER_MESSAGES.LAST_NAME_REQUIRED)
    .test(
      USER_MESSAGES.NO_SQL_TEST,
      USER_MESSAGES.LAST_NAME_INVALID,
      (value) => {
        return !/[{}$]/.test(value);
      }
    ),
  email: Yup.string()
    .email(USER_MESSAGES.EMAIL_INVALID)
    .required(USER_MESSAGES.EMAIL_REQUIRED)
    .test(USER_MESSAGES.NO_SQL_TEST, USER_MESSAGES.EMAIL_INVALID, (value) => {
      return !/[{}$]/.test(value);
    }),
  phoneNumber: Yup.string()
    .matches(/^(\d{10})$/, USER_MESSAGES.PHONE_MIN_LENGTH)
    .required(USER_MESSAGES.PHONE_REQUIRED)
    .test(USER_MESSAGES.NO_SQL_TEST, USER_MESSAGES.PHONE_INVALID, (value) => {
      return !/[{}$]/.test(value);
    }),
  userName: Yup.string()
    .required(USER_MESSAGES.USERNAME_REQUIRED)
    .test(
      USER_MESSAGES.NO_SQL_TEST,
      USER_MESSAGES.USERNAME_INVALID,
      (value) => {
        return !/[{}$]/.test(value);
      }
    ),
  password: Yup.string()
    .min(8, USER_MESSAGES.PASSWORD_MIN_LENGTH)
    .matches(/[A-Z]/, USER_MESSAGES.PASSWORD_UPPERCASE)
    .matches(/[a-z]/, USER_MESSAGES.PASSWORD_LOWERCASE)
    .matches(/[0-9]/, USER_MESSAGES.PASSWORD_DIGIT)
    .matches(/[\W_]/, USER_MESSAGES.PASSWORD_SPECIAL)
    .required(USER_MESSAGES.PASSWORD_REQUIRED)
    .test(
      USER_MESSAGES.NO_SQL_TEST,
      USER_MESSAGES.PASSWORD_INVALID,
      (value) => {
        return !/[{}$]/.test(value);
      }
    ),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf(
      [Yup.ref("password"), null],
      USER_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH
    )
    .required(USER_MESSAGES.CONFIRM_PASSWORD_REQUIRED),
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
      setFieldValue(USER.PROFILE_PICTURE, file);
    }
  };

  // Processes form data and submits it.
  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    console.log(values);
    Object.entries(values).forEach(([key, value]) => {
      if (key === USER.PROFILE_PICTURE && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });
    registerUser(formData as any);
  };

  return (
    <Formik
      initialValues={INITIAL_USER}
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
                <Field name={USER.FIRST_NAME}>
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label={USER.FIRST_NAME_LABEL}
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12} md={6}>
                <Field name={USER.LAST_NAME}>
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label={USER.LAST_NAME_LABEL}
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Field name={USER.EMAIL}>
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label={USER.EMAIL_LABEL}
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Field name={USER.PHONE_NUMBER}>
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label={USER.PHONE_NUMBER_LABEL}
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Field name={USER.USER_NAME}>
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label={USER.USER_NAME_LABEL}
                      fullWidth
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error ? meta.error : ""}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Field name={USER.PASSWORD}>
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label={USER.PASSWORD_LABEL}
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
                <Field name={USER.CONFIRM_PASSWORD}>
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      label={USER.CONFIRM_PASSWORD_LABEL}
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
                  {USER.PROFILE_PICTURE_LABEL}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                    hidden
                  />
                </Button>
                <ErrorMessage
                  name={USER.PROFILE_PICTURE}
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
