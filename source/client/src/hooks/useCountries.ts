import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CountryData, CountryWithoutID } from "../types/countryTypes";
import { toast } from "react-toastify";
import {
  fetchCountries,
  deleteCountry,
  updateCountry,
  addCountry,
} from "../services/countryService";

export const useCountries = () => {
  const queryClient = useQueryClient();

  // Fetch countries
  const {
    data: countries,
    isLoading,
    error,
  } = useQuery<CountryData[], Error>({
    queryKey: ["country"],
    queryFn: fetchCountries,
  });

  // Delete a country
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (countryId) => deleteCountry(countryId),
    onSuccess: (_, id) => {
      // Update cache after deletion
      queryClient.setQueryData<CountryData[]>(
        ["country"],
        (oldData) => oldData?.filter((country) => country._id !== id) || []
      );
    },
    onError: (error) => {
      console.error("Error deleting country:", error);
    },
  });

  // Update a country
  const updateMutation = useMutation<
    void,
    Error,
    { countryId: string; updatedData: CountryData }
  >({
    mutationFn: ({ countryId, updatedData }) =>
      updateCountry(countryId, updatedData),
    onSuccess: (data, { countryId, updatedData }) => {
      // Update cache after update
      queryClient.setQueryData<CountryData[]>(
        ["country"],
        (oldData) =>
          oldData?.map((country) =>
            country._id === countryId ? { ...country, ...updatedData } : country
          ) || []
      );
      toast.success("Country updated successfully");
      console.log("Cache updated after country update");
    },
    onError: (error) => {
      toast.error(`Error updating the country: ${error.message}`);
      console.error("Error deleting country:", error);
    },
  });

  // Add a new country
  const addMutation = useMutation<CountryData, Error, CountryWithoutID>({
    mutationFn: (newCountry) => addCountry(newCountry),
    onSuccess: (newCountry) => {
      // Update cache after adding a new country
      queryClient.setQueryData<CountryData[]>(["country"], (oldData) => [
        ...(oldData || []),
        newCountry,
      ]);
      toast.success("Country added successfully");
      console.log("Cache updated after adding new country");
    },
    onError: (error) => {
      console.error("Error adding country:", error);
      toast.error(`Error adding the country: ${error.message}`);
    },
  });

  // Get a specific country by its ID from the cache
  const getCountryById = (id: string): CountryData | undefined => {
    return queryClient
      .getQueryData<CountryData[]>(["country"])
      ?.find((country) => country._id === id);
  };

  return {
    countries,
    isLoading,
    error,
    deleteCountry: deleteMutation.mutate,
    deleteMutation,
    updateCountry: updateMutation.mutate,
    updateMutation,
    addCountry: addMutation.mutate,
    addMutation,
    getCountryById,
  };
};
