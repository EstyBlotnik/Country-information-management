import { CountryData, CountryWithoutID } from "../types/countryTypes";
import API_URL from "../config/apiConfig";

const apiUrl = `${API_URL}/countries`;
import axios from "axios";

export const fetchCountries = async (): Promise<CountryData[]> => {
  try {
    const response = await axios.get<CountryData[]>(apiUrl);
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.log("Failed to fetch countries");
    throw new Error(
      `Failed to fetch countries: ${error.response?.data?.message}`
    );
  }
};

export const deleteCountry = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${apiUrl}/${id}`, {
      withCredentials: true,
    });
    console.log("Country deleted successfully");
  } catch (error: any) {
    console.log("Failed to delete country");
    throw new Error(
      `Failed to delete country: ${error.response?.data?.message}`
    );
  }
};

export const updateCountry = async (
  countryId: string,
  updatedData: CountryData
) => {
  console.log(updatedData);
  try {
    const response = await axios.put(`${apiUrl}/${countryId}`, updatedData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("Failed to update the country");
    throw new Error(
      `Failed to update the country: ${error.response?.data?.message}`
    );
  }
};

export const addCountry = async (data: CountryWithoutID) => {
  console.log("adding data:", data);
  try {
    const response = await axios.post(apiUrl, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log("Failed to add the country");
    throw new Error(
      `Failed to add the country: ${error.response?.data?.message}`
    );
  }
};
