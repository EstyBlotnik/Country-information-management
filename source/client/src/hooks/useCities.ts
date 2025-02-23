import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  fetchCities,
  deleteCity,
  addCity,
  updateCity,
} from "../services/citiesService";
import { CityData, CountryData } from "../types/countryTypes";

export const useCities = () => {
  const queryClient = useQueryClient();

  // Fetch cities
  const {
    data: cities,
    isLoading,
    error,
  } = useQuery<CityData[], Error>({
    queryKey: ["city"],
    queryFn: fetchCities, // Fetch cities from the API
  });

  // Delete a city
  const deleteMutation = useMutation<
    void,
    Error,
    { cityId: string; countryId: string }
  >({
    mutationFn: ({ cityId, countryId }) => deleteCity(cityId, countryId),
    onSuccess: (_, { cityId, countryId }) => {
      // Update cache after deletion
      // Remove deleted city from the city cache
      queryClient.setQueryData<CityData[]>(
        ["city"],
        (oldData) => oldData?.filter((city) => city._id !== cityId) || []
      );
      // Remove deleted city from the country cache as well
      queryClient.setQueryData<CountryData[]>(
        ["country"],
        (oldCountries) =>
          oldCountries?.map((country) =>
            country._id === countryId
              ? {
                  ...country,
                  cities: country.cities.filter((city) => city._id !== cityId),
                }
              : country
          ) || []
      );
    },
    onError: (error) => {
      console.error("Error deleting country:", error);
      toast.error(`Error deleting the city: ${error.message}`);
    },
  });

  // Add a new city
  const addMutation = useMutation<
    CityData,
    Error,
    { name: string; countryId: string }
  >({
    mutationFn: ({ name, countryId }) => addCity(name, countryId),
    onSuccess: (newCity, variables) => {
      // Add newly created city to the city cache
      queryClient.setQueryData<CityData[]>(["city"], (oldData) => [
        ...(oldData || []),
        newCity,
      ]);
      // Add newly created city to the country cache
      queryClient.setQueryData<CountryData[]>(
        ["country"],
        (oldCountries) =>
          oldCountries?.map((country) =>
            country._id === variables.countryId
              ? { ...country, cities: [...(country.cities || []), newCity] }
              : country
          ) || []
      );
      toast.success("City added successfully");
      console.log("Cache updated after adding new city");
    },
    onError: (error) => {
      console.error("Error adding city:", error);
      toast.error(`Error adding the city: ${error.message}`);
    },
  });
  // Update a city
  const updateMutation = useMutation<
    void,
    Error,
    { countryId: string; cityId: string; updatedData: CityData }
  >({
    mutationFn: ({ updatedData }) => updateCity(updatedData),
    onSuccess: (_, { countryId, cityId, updatedData }) => {
      // Update city data in the city cache after successful update
      queryClient.setQueryData<CityData[]>(
        ["city"],
        (oldData) =>
          oldData?.map((city) =>
            city._id === cityId ? { ...city, ...updatedData } : city
          ) || []
      );
      // Update city data in the country cache after successful update
      queryClient.setQueryData<CountryData[]>(
        ["country"],
        (oldData) =>
          oldData?.map((country) =>
            country._id === countryId
              ? {
                  ...country,
                  cities: country.cities.map((city) =>
                    city._id === cityId ? { ...city, ...updatedData } : city
                  ),
                }
              : country
          ) || []
      );
      toast.success("City updated successfully");
      console.log("Cache updated after city update");
    },
    onError: (error) => {
      toast.error(`Error updating the country: ${error.message}`);
      console.error("Error deleting country:", error);
    },
  });

  // Get a specific city by its ID from the cache
  const getCityById = (id: string): CityData | undefined => {
    return queryClient
      .getQueryData<CityData[]>(["city"])
      ?.find((city) => city._id === id);
  };

  return {
    cities,
    isLoading,
    error,
    deleteCity: deleteMutation.mutate,
    deleteMutation,
    addCity: addMutation.mutate,
    addMutation,
    updateCity: updateMutation.mutate,

    getCityById,
  };
};
