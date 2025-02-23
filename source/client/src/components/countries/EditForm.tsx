import { Formik, Form, Field, FieldProps, FieldArray } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useCountries } from "../../hooks/useCountries";
import "../../style/editFile.scss";
import { useParams } from "react-router-dom";
import { CityData, CountryData } from "../../types/countryTypes";
import VerificationDialog from "./VerificationDialogue";
import { useUser } from "../../hooks/useUser";
import { useCities } from "../../hooks/useCities";
import CityInputDialog from "./CityInputDialog";

const CountryScema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name is too Short!")
    .max(50, "Name is too Long!")
    .required("Name is equired")
    .test("no-noSQL", "Invalid Name", (value) => {
      return !/[{}$]/.test(value);
    }),
  flag: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .matches(/^https:\/\//, "must start with 'https://'")
    .test("no-noSQL", "Invalid Name", (value) => {
      return value ? !/[{}$]/.test(value) : true;
    }),
  population: Yup.number()
    .positive("Population must be positive")
    .integer("Population must be an integer")
    .required("Population is required"),
  region: Yup.string()
    .min(3, "Region is too Short!")
    .max(50, "Region is too Long!")
    .required("Region is required")
    .test("no-noSQL", "Invalid region", (value) => {
      return !/[{}$]/.test(value);
    }),
});

export const ValidationCountryData = () => {
  const { updateCountry, getCountryById, addCountry } = useCountries();
  const { addCity, deleteCity, updateCity } = useCities();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [country, setCountry] = useState<CountryData | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, isLoading } = useUser();
  const [openDialog, setOpenDialog] = useState(false);

  // Fetches the country data by its id when the component loads. 
  // Updates the country state with the fetched data.
  useEffect(() => {
    if (id) {
      const fetchedCountry = getCountryById(id);
      if (fetchedCountry) {
        setCountry(fetchedCountry);
      }
    }
    console.log("country:", country);
  }, [id, getCountryById, navigate]);

  // Checks if the user has the required role (Admin, Delete, Edit) to view or edit the country. 
  // If the user is unauthorized, they are redirected to the /countries page.
  useEffect(() => {
    if (!country) {
      if (
        !isLoading &&
        (!user || !["Admin", "Delete", "Add", "Edit"].includes(user.role))
      ) {
        navigate("/countries");
      }
    } else {
      if (
        !isLoading &&
        (!user || !["Admin", "Delete", "Edit"].includes(user.role))
      ) {
        navigate("/countries");
      }
    }
  }, [user, isLoading, navigate, country]);

  // Adds a new city to the selected country by calling the addCity function and updating the country state with the new city.
  const handleAddCity = async (cityName: string) => {
    if (!country) return;
    try {
      addCity({ name: cityName, countryId: country._id });
      setCountry((prev) => ({
        ...prev!,
        cities: [...prev!.cities, { name: cityName }],
      }));
    } catch (error) {
      console.error("Error adding city:", error);
    }
  };

  // Deletes a city from the selected country by calling the deleteCity function and removing the city from the country state.
  const handleDeleteCity = async (cityId: string) => {
    if (!country) return;
    try {
      deleteCity({ cityId, countryId: country._id });
      setCountry((prev) => ({
        ...prev!,
        cities: prev!.cities.filter((city) => city._id !== cityId),
      }));
    } catch (error) {
      console.error("Error deleting city:", error);
    }
  };

  // Updates the name of an existing city within the selected country by calling the updateCity function 
  // and updating the country state with the modified city name.
  const handleUpdateCity = async (updatedData: CityData) => {
    if (!country) return;
    try {
      updateCity({
        countryId: country._id,
        cityId: updatedData?._id || "",
        updatedData,
      });
      setCountry((prev) => {
        const updatedCities = [...prev!.cities];
        const cityIndex = updatedCities.findIndex(
          (city) => city._id === updatedData._id
        );

        if (cityIndex !== -1) {
          updatedCities[cityIndex].name = updatedData.name;
        }

        return { ...prev!, cities: updatedCities };
      });
    } catch (error) {
      console.error("Error updating city:", error);
    }
  };

  // Redirects the user back to the /countries page without saving any changes (cancel action).
  const handleCancelEdit = (): void => {
    console.log("Cancel edit action triggered.");
    navigate("/countries");
  };

  // Opens the cancellation confirmation dialog (VerificationDialog), 
  // asking the user if they are sure they want to leave without saving changes.
  const handleCancelConfirmation = () => {
    setCancelDialogOpen(true);
  };

  return (
    <div className="form-container">
      <h1>{country ? "Edit Country" : "Add Country"}</h1>
      <Formik
        key={country ? country._id : "new"}
        initialValues={{
          name: country ? country.name : "",
          flag: country ? country.flag : "",
          population: country ? country.population : 0,
          region: country ? country.region : "",
        }}
        validationSchema={CountryScema}
        onSubmit={(values) => {
          const countryId = country ? country._id : "0";
          if (country) {
            updateCountry({
              countryId,
              updatedData: { ...values, cities: [], _id: countryId },
            });
          } else {
            addCountry({ ...values, cities: [] });
          }

          console.log("submitted: ", { ...values, cities: [] });
          navigate("/countries");
        }}
      >
        {({ values, errors, touched, dirty, isValid }) => (
          <Form>
            <Field name="name">
              {({ field, meta }: FieldProps) => (
                <TextField
                  {...field}
                  label="Country Name"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
            {errors.name && touched.name ? <div>{errors.name}</div> : null}
            <Field name="flag">
              {({ field, meta }: FieldProps) => (
                <TextField
                  {...field}
                  label="Flag URL"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
            {errors.flag && touched.flag ? <div>{errors.flag}</div> : null}

            <Field name="population" type="number">
              {({ field, meta }: FieldProps) => (
                <TextField
                  {...field}
                  label="Population"
                  type="number"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
            {errors.population && touched.population ? (
              <div>{errors.population}</div>
            ) : null}

            <Field name="region">
              {({ field, meta }: FieldProps) => (
                <TextField
                  {...field}
                  label="Region"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
            {errors.region && touched.region ? (
              <div>{errors.region}</div>
            ) : null}
            {country && (
              <div className="cities-container">
                <h3>Cities</h3>
                {country?.cities.length ? (
                  country.cities.map((city, index) => (
                    <div key={city?._id || index} className="city-field">
                      <TextField
                        value={city.name}
                        onChange={(e) =>
                          handleUpdateCity({
                            _id: city._id,
                            name: e.target.value,
                          })
                        }
                        label={`City ${index + 1}`}
                      />
                      <Button onClick={() => handleDeleteCity(city?._id || "")}>
                        Delete
                      </Button>
                    </div>
                  ))
                ) : (
                  <div>No cities listed</div>
                )}
                <Button type="button" onClick={() => setOpenDialog(true)}>
                  Add a city
                </Button>
              </div>
            )}

            <div className="buttons-container">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!dirty || !isValid}
                className="btn ok-button"
              >
                OK
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCancelConfirmation}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <VerificationDialog
        dialogFor={country ? "edit" : "add"}
        open={cancelDialogOpen}
        onClose={() => {
          setCancelDialogOpen(false);
        }}
        onCancele={handleCancelEdit}
      />
      <CityInputDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onAddCity={handleAddCity}
      />
    </div>
  );
};
