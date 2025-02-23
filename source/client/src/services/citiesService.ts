import { CityData } from "../types/countryTypes";
import API_URL from "../config/apiConfig";

const apiUrl = `${API_URL}/cities`;
import axios from "axios";

// Fetch the list of cities from the API
export const fetchCities = async (): Promise<CityData[]> => {
  try {
    const response = await axios.get<CityData[]>(apiUrl);
    console.log(response.status);
    return response.data;
  } catch (error: any) {
    console.log("Failed to fetch cities");
    throw new Error(`Failed to fetch cities:${error.response?.data?.message}`);
  }
};

// Delete a city based on the cityId and countryId
export const deleteCity = async (
  cityId: string,
  countryId: string
): Promise<void> => {
  try {
    const response = await axios.delete(
      `${apiUrl}/${cityId}?countryId=${countryId}`,
      {
        withCredentials: true,
      }
    );
    console.log(response, "City deleted successfully");
  } catch (error: any) {
    console.log("Failed to delete city");
    throw new Error(`Failed to delete city: ${error.response?.data?.message}`);
  }
};

// Add a new city with the given name and countryId
export const addCity = async (name: string, countryId: string) => {
  console.log("adding data:", name, countryId);
  try {
    const response = await axios.post(
      apiUrl,
      { name, countryId },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log("Failed to add the city");
    throw new Error(`Failed to add the city: ${error.response?.data?.message}`);
  }
};

// Update an existing city's data based on the provided updatedData
export const updateCity = async (updatedData: CityData) => {
  console.log("updating data:", updatedData);
  try {
    const response = await axios.put(
      `${apiUrl}/${updatedData._id}`,
      updatedData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log("Failed to update the city");
    throw new Error(
      `Failed to update the city: ${error.response?.data?.message}`
    );
  }
};
