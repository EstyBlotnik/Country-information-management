import { ERRORS_MESSAGES } from "../constants";
import Country from "../db/models/country";

export const getCountryByIdService = async (countryId: string | undefined) => {
  try {
    const country = await Country.findById(countryId).populate("cities");
    console.log(countryId);
    console.log("county by id: " + country);
    return country;
  } catch (error) {
    console.error(error);
    throw new Error(ERRORS_MESSAGES.COUNTRY.FAILD_FETCH_COUNTRY);
  }
};

export const getAllCountriesService = async () => {
  try {
    const countries = await Country.find().populate("cities");
    return countries;
  } catch (error) {
    throw new Error(ERRORS_MESSAGES.COUNTRY.FAILD_FETCH_COUNTRIES);
  }
};

export const getCountryByName = async (countryName: string) => {
  try {
    // const countries = await Country.find();
    // console.log(countries);
    console.log("countryName: " + countryName);
    const country = await Country.findOne({ name: countryName });
    console.log("country: ", country);
    return country;
  } catch (error) {
    throw new Error(ERRORS_MESSAGES.COUNTRY.FAILD_FETCH_COUNTRY);
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
      throw new Error(ERRORS_MESSAGES.COUNTRY.NOT_FOUND);
    }
    return updatedCountry;
  } catch (error) {
    console.error(error);
    throw new Error(ERRORS_MESSAGES.COUNTRY.ERROR_UPDATE);
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
    throw new Error(ERRORS_MESSAGES.COUNTRY.ERROR_CREATE);
  }
};

export const deleteCountryById = async (id: string) => {
  try {
    const deletedCountry = await Country.findByIdAndDelete(id);
    return deletedCountry;
  } catch (error) {
    console.error(error);
    throw new Error(ERRORS_MESSAGES.COUNTRY.ERROR_DELETE);
  }
};
