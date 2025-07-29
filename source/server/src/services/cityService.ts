import { ERRORS_MESSAGES } from "../constants";
import City from "../db/models/city";
import Country from "../db/models/country";

export const createCityAtCountry = async (name: string, countryId: string) => {
  try {
    const country = await Country.findById(countryId);
    if (!country) {
      throw new Error(ERRORS_MESSAGES.COUNTRY.NOT_FOUND);
    }
    const existingCity = await City.findOne({ name: name });
    if (existingCity) {
      if (country.cities.includes(existingCity._id)) {
        throw new Error(ERRORS_MESSAGES.CITY.ALREADY_EXISTS);
      }
      country.cities.push(existingCity._id);
      await country.save();
      return existingCity;
    }
    const newCity = new City({ name });
    await newCity.save();
    country.cities.push(newCity._id);
    await country.save();
    return newCity;
  } catch (err) {
    throw new Error(err ? err.toString() : ERRORS_MESSAGES.CITY.ERROR_ADD);
  }
};

export const deleteCityFromDb = async (id: string) => {
  try {
    const deletedCity = await City.findByIdAndDelete(id);
    return deletedCity;
  } catch (err) {
    throw new Error(err ? err.toString() : ERRORS_MESSAGES.CITY.ERROR_DELETE);
  }
};

export const deleteCityFromCountry = async (
  countryId: string,
  cityId: string
) => {
  try {
    const country = await Country.findByIdAndUpdate(
      countryId,
      { $pull: { cities: cityId } },
      { new: true }
    );
    if (!country) {
      throw new Error(ERRORS_MESSAGES.COUNTRY.NOT_FOUND);
    }
    return country;
  } catch (err) {
    throw new Error(
      err ? err.toString() : ERRORS_MESSAGES.CITY.ERROR_DELETE_FROM_COUNTRY
    );
  }
};

export const getCities = async () => {
  try {
    const cities = await City.find();
    return cities;
  } catch (err) {
    throw new Error(err ? err.toString() : ERRORS_MESSAGES.CITY.NOT_FOUND);
  }
};

export const getCityByItsId = async (cityId: string) => {
  try {
    const city = await City.findById(cityId);
    return city;
  } catch (err) {
    throw new Error(err ? err.toString() : ERRORS_MESSAGES.CITY.NOT_FOUND);
  }
};

export const updateCityName = async (cityId: string, newName: string) => {
  try {
    const updatedCity = await City.findByIdAndUpdate(
      cityId,
      { name: newName },
      { new: true }
    );
    return updatedCity;
  } catch (err) {
    throw new Error(err ? err.toString() : ERRORS_MESSAGES.CITY.ERROR_UPDATE);
  }
};
