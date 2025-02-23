import React from "react";
import { TextField, Button, Grid, Box, Avatar } from "@mui/material";
import { Formik, Field, Form, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { useUser } from "../../hooks/useUser";
import { useUsers } from "../../hooks/useUsers";
import "../../style/signupForm.scss";
import API_URL from "../../config/apiConfig";
import { useNavigate } from "react-router-dom";
import { isEditingState, selctedUserState } from "../../states/user";
import { useRecoilValue, useSetRecoilState } from "recoil";

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
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^(\d{10})$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  userName: Yup.string()
    .required("Username is required")
    .test("no-noSQL", "Invalid Username", (value) => {
      return !/[{}$]/.test(value);
    }),
  profilePicture: Yup.mixed().nullable(),
});

const EditUserForm = ({ editFor }: { editFor: "mySelf" | "anOtherUser" }) => {
  const { user, updateUser } = useUser();
  const { updateSelectedUser } = useUsers();
  const navigate = useNavigate();
  const selectedUser = useRecoilValue(selctedUserState);
  const setIsEditingState = useSetRecoilState(isEditingState);
  /*
  This function is triggered when a user selects a new profile picture. 
  It updates the form field for profilePicture with the chosen file.
  */
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue("profilePicture", file);
    }
  };
  /*
  This is the function that gets called when the form is submitted.
  If editFor is "mySelf", the data is sent to the logged-in user's profile (via updateUser).
  If editFor is "anOtherUser", the data is sent to a selected user’s profile (via updateSelectedUser).
 */
  const handleSubmit = (values: any) => {
    console.log("values:", values);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "profilePicture" && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });
    console.log("formData: ");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    if (editFor === "mySelf") {
      user?._id &&
        updateUser({ userId: user._id, updatedData: formData as any });
    } else {
      selectedUser?._id &&
        updateSelectedUser({
          userId: selectedUser._id,
          updatedData: formData as any,
        });
      setIsEditingState(false);
    }
  };

  // Cancels the edit action.
  const handleCancel = () => {
    if (editFor === "mySelf") {
      navigate("/profile");
    } else {
      setIsEditingState(false);
    }
  };
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <Formik
      enableReinitialize
      initialValues={{
        firstName:
          editFor === "mySelf"
            ? user?.firstName || ""
            : selectedUser?.firstName || "",
        lastName:
          editFor === "mySelf"
            ? user?.lastName || ""
            : selectedUser?.lastName || "",
        email:
          editFor === "mySelf" ? user?.email || "" : selectedUser?.email || "",
        phoneNumber:
          editFor === "mySelf"
            ? user?.phoneNumber || ""
            : selectedUser?.phoneNumber || "",
        profilePicture: null,
        userName:
          editFor === "mySelf"
            ? user?.userName || ""
            : selectedUser?.userName || "",
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
            <Grid item xs={12} container justifyContent="center">
              <Avatar
                src={
                  editFor === "mySelf"
                    ? `${API_URL}${user.profilePicture}` ||
                      "/default-avatar.png"
                    : `${API_URL}${selectedUser?.profilePicture}` ||
                      "/default-avatar.png"
                }
                alt={user.userName}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, setFieldValue)}
              />
              <label htmlFor="profilePicture">
                <Button variant="contained" component="span">
                  Change profile picture
                </Button>
              </label>
              <ErrorMessage
                name="profilePicture"
                component="div"
                className="error-message"
              />
            </Grid>

            <h2 className="landing-page__title">
              {editFor === "mySelf" ? "Edit Profile" : "Edit User"}
            </h2>
            <p className="landing-page__description">
              You can edit{" "}
              {editFor === "mySelf" ? "your personal" : "users personal"}{" "}
              details here.{" "}
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
            </Grid>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                paddingTop: "4px",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                className="landing-page__button"
              >
                Save changes
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={handleCancel}
                className="landing-page__button"
              >
                Cancel
              </Button>
            </div>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default EditUserForm;
