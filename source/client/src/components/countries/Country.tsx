import { FaSpinner } from "react-icons/fa";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { countryState } from "../../states/country";
import { useNavigate } from "react-router-dom";
import { useCountries } from "../../hooks/useCountries";
import { CountryData } from "../../types/countryTypes";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "../../style/Country.scss";
import { useMemo } from "react";
import VerificationDialog from "./VerificationDialogue";
import { useUser } from "../../hooks/useUser";
import LoadingPage from "../LoadingPage";
export const Country = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [countryId, setCountryId] = useState<string>("");

  const setCountry = useSetRecoilState(countryState);
  const country = useRecoilValue(countryState);
  const navigate = useNavigate();
  const { user } = useUser();
  const { countries, isLoading, error, deleteMutation } = useCountries();
  useEffect(() => {
    if (deleteMutation.isSuccess) {
      toast.success("Country deleted successfully");
    }

    if (deleteMutation.isError) {
      toast.error("Error deleting the country");
    }
  }, [deleteMutation.isSuccess, deleteMutation.isError]);

  const rows: GridRowsProp = useMemo(
    () =>
      countries?.map((country) => ({
        id: country._id,
        _id: country._id,
        name: country.name,
        region: country.region,
        flag: country.flag,
        population: country.population,
      })) || [],
    [countries]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "name", headerName: "name", width: 150 },
      { field: "region", headerName: "region", width: 130 },
      { field: "population", headerName: "population", width: 130 },
      {
        field: "flag",
        headerName: "flag",
        width: 120,
        renderCell: (params) => (
          <img
            src={params.value}
            alt="Flag"
            style={{ width: "70px", height: "40px" }}
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 270,
        renderCell: (params) => (
          <div>
            {user && ["Admin", "Delete", "Edit"].includes(user.role) && (
              <button
                className="button button-edit"
                onClick={() => handleEdit(params.row)}
              >
                Edit
              </button>
            )}
            {user && (user.role === "Admin" || user?.role === "Delete") && (
              <button
                className="button button-delete"
                onClick={() => handleDeleteConfirmation(params.row.id)}
              >
                Delete
              </button>
            )}
            <button
              className="button button-detail"
              onClick={() => handleDetails(params.row)}
            >
              More
            </button>
          </div>
        ),
      },
    ],
    [user]
  );

  // Navigates to the edit page of the selected country and sets the country data in the state.
  const handleEdit = (selectedCountry: CountryData) => {
    console.log(selectedCountry);
    setCountry(selectedCountry);
    console.log("selectedCountry set to state", selectedCountry);
    navigate(`/editCountry/${selectedCountry._id}`);
    console.log(country);
  };

  // Navigates to the details page of the selected country and sets the country data in the state.
  const handleDetails = (selectedCountry: CountryData) => {
    setCountry(selectedCountry);
    navigate(`/veiwCountry/${selectedCountry._id}`);
  };

  // Opens a dialog to confirm the deletion of a country by setting its ID in the state.
  const handleDeleteConfirmation = (id: string) => {
    setDeleteDialogOpen(true);
    setCountryId(id);
  };

  // Deletes the country by calling the delete mutation and closing the confirmation dialog.
  const handleDelete = (id: string) => {
    console.log("Deleting country with id:", id);
    setDeleteDialogOpen(false);
    deleteMutation.mutate(id);
  };

  // Handles the cancellation of the delete action and logs the event.
  const handleCancel = () => {
    console.log("delete country was canceld");
  };

  if (isLoading) return <LoadingPage />;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="container">
      <h1 className="title">Countries list:</h1>
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
      {user && ["Edit", "Delete", "Add", "Admin"].includes(user.role) && (
        <button
          className="add-country-button"
          onClick={() => navigate("/addCountry")}
        >
          <FaPlus style={{ marginRight: "8px" }} />
          Add a country
        </button>
      )}
      <VerificationDialog
        dialogFor="delete"
        open={deleteDialogOpen}
        onClose={() => {
          handleCancel();
          setDeleteDialogOpen(false);
        }}
        onDelete={() => {
          handleDelete(countryId);
          setDeleteDialogOpen(false);
        }}
        countryId={countryId}
      />
    </div>
  );
};
