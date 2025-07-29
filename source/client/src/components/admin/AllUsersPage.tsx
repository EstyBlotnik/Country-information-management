import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useState } from "react";
import "../../style/Country.scss";
import { useMemo } from "react";
import VerificationDialog from "../countries/VerificationDialogue";
import { useUsers } from "../../hooks/useUsers";
import { Avatar } from "@mui/material";
import { userData } from "../../types/userTypes";
import API_URL from "../../config/apiConfig";
import { useSetRecoilState } from "recoil";
import { isEditingState, selctedUserState } from "../../states/user";
import LoadingPage from "../LoadingPage";
import { USER } from "../../constats";
export const AllUsersPage = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const { users, isLoading, error, deleteMutation, getUserById } = useUsers();
  const setSelectedUser = useSetRecoilState(selctedUserState);
  const setIsEditingState = useSetRecoilState(isEditingState);

  const rows: GridRowsProp = useMemo(
    () =>
      users?.map((user) => ({
        id: user._id,
        _id: user._id,
        profilePicture: user.profilePicture,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      })) || [],
    [users]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: USER.PROFILE_PICTURE,
        headerName: "Profile Picture",
        width: 150,
        renderCell: (params) => (
          <Avatar
            src={`${API_URL}${params.value}` || USER.DEFAULT_PICTURE}
            alt="user profle"
            sx={{ width: 50, height: 50, mb: 2 }}
          />
        ),
      },

      { field: "name", headerName: "name", width: 150 },
      { field: "email", headerName: "email", width: 150 },
      { field: "phoneNumber", headerName: "phoneNumber", width: 150 },

      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        renderCell: (params) => (
          <div>
            <button
              className="button button-edit"
              onClick={() => handleEdit(params.row)}
            >
              Edit
            </button>
            <button
              className="button button-delete"
              onClick={() => handleDeleteConfirmation(params.row.id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Sets user data for editing
  const handleEdit = (selectedUser: userData) => {
    const fullSelectedUser = getUserById(selectedUser?._id || "");
    setSelectedUser(fullSelectedUser || selectedUser);
    setIsEditingState(true);
  };

  // Opens confirmation dialog for deletion
  const handleDeleteConfirmation = (id: string) => {
    setDeleteDialogOpen(true);
    setUserId(id);
  };

  //Deletes user after confirmation
  const handleDelete = (id: string) => {
    setDeleteDialogOpen(false);
    deleteMutation.mutate(id);
  };

  if (isLoading) return <LoadingPage />;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="container">
      <h1 className="title">users list:</h1>
      <DataGrid
        rows={rows}
        columns={columns}
        className="data-grid"
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 20, 25]}
      />
      <VerificationDialog
        dialogFor="delete"
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
        }}
        onDelete={() => {
          handleDelete(userId);
          setDeleteDialogOpen(false);
        }}
        countryId={userId}
      />
    </div>
  );
};
