import React from "react";
import { TextField, Button, Grid, Box } from "@mui/material";
import { Formik, Field, Form, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { useUsers } from "../../hooks/useUsers";
import "../../style/signupForm.scss";
import { USER, USER_MESSAGES } from "../../constats";
import { INITIAL_USER } from "../../initial";

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

const AddUserForm = () => {
  const { addUser } = useUsers();

  //Handles uploading a profile picture and updates the profile Picture field.
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue("profilePicture", file);
    }
  };

  //Handles form submission and sends the form data to the server.
  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "profilePicture" && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    addUser(formData as any);
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
            <h2 className="landing-page__title">Add a new user</h2>
            <p className="landing-page__description">
              Please fill in all new user details:
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
                      label={`${USER.PASSWORD_LABEL} 1`}
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFieldValue)}
                  data-testid="profile-picture-upload"
                />
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
              Create new user
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddUserForm;
