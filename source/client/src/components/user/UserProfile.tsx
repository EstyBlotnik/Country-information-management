import React, { useState } from "react";
import API_URL from "../../config/apiConfig";

import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Button,
} from "@mui/material";

import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import RoleDialog from "./RoleDialog";
import LoadingPage from "../LoadingPage";

// Displays a user detail label and value.
function UserDetail({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 1,
        p: 1,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Typography fontWeight="bold">{label}:</Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}

const UserProfile = () => {
  const { user, isLoading, error } = useUser();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <Typography color="error">error louding user</Typography>;
  }

  if (!user) {
    return <Typography>no user found</Typography>;
  }
  const handleEditProfile = () => {
    navigate(`/editProfile/${user._id}`);
  };

  const handleChangeRole = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <div>
      <Card
        sx={{
          maxWidth: 500,
          margin: "auto",
          mt: 10,
          p: 3,
          textAlign: "left",
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Avatar
            src={`${API_URL}${user.profilePicture}` || "/default-avatar.png"}
            alt={user.userName}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h5">{`${user.firstName} ${user.lastName}`}</Typography>
        </Box>
        <CardContent>
          <UserDetail label="Username" value={user.userName} />
          <UserDetail label="Email" value={user.email} />
          <UserDetail label="Phone Number" value={user.phoneNumber} />
          <UserDetail
            label="Joining Date"
            value={new Date(user.JoiningDate).toLocaleDateString()}
          />
          <div>
            <UserDetail label="role" value={user.role} />
            {user.role !== "Admin" && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleChangeRole}
              >
                i want to change my role
              </Button>
            )}
          </div>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
      <RoleDialog user={user} isOpen={openDialog} onClose={handleCloseDialog} />
    </div>
  );
};

export default UserProfile;
