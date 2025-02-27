import Country from "../db/models/country";

export const getCountryByIdService = async (countryId: string | undefined) => {
  try {
    const country = await Country.findById(countryId).populate("cities");
    if (!country) {
      throw new Error("Country not found");
    }
    return country;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching the country");
  }
};

export const getAllCountriesService = async () => {
  try {
    const countries = await Country.find().populate("cities");
    return countries;
  } catch (error) {
    throw new Error("Failed to fetch countries");
  }
};

export const getCountryByName = async (countryName: string) => {
  try {
    const country = await Country.findOne({ name: countryName });
    if (!country) {
      throw new Error("Country not found");
    }
    return country;
  } catch (error) {
    throw new Error("An error occurred while fetching the country");
  }
};

export const updateCountryById = async (
  id: string,
  name: string,
  flag: string,
  population: string,
  region: string
) => {
  try {
    const updatedCountry = await Country.findByIdAndUpdate(
      id,
      { name, flag, population, region },
      { new: true }
    );
    if (!updatedCountry) {
      throw new Error("Country not found");
    }
    return updatedCountry;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while updating the country");
  }
};

export const createCountryService = async (
  name: string,
  flag: string,
  population: string,
  region: string
) => {
  try {
    const newCountry = await Country.create({ name, flag, population, region });
    await newCountry.save();
    return newCountry;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while creating the country");
  }
};

export const deleteCountryById = async (id:string) => {
    try {
    const deletedCountry = await Country.findByIdAndDelete(id);
    if (!deletedCountry) {
      throw new Error("Country not found");
    }
    return deletedCountry;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while deleting the country");
  }
}