import City from "../db/models/city";
import Country from "../db/models/country";

export const createCityAtCountry = async (name: string, countryId: string) => {
  try {
    const country = await Country.findById(countryId);
    if (!country) {
      throw new Error("Country not found");
    }
    const existingCity = await City.findOne({ name: name });
    if (existingCity) {
      if (country.cities.includes(existingCity._id)) {
        throw new Error("City already exists");
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
    throw new Error(err ? err.toString() : "Could not add new city");
  }
};

export const deleteCityFromDb = async (id: string) => {
  try {
    const deletedCity = await City.findByIdAndDelete(id);
    return deletedCity;
  } catch (err) {
    throw new Error(err ? err.toString() : "Could not delete city");
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
      throw new Error("Country not found");
    }
    return country;
  } catch (err) {
    throw new Error(
      err ? err.toString() : "Could not delete city from country"
    );
  }
};

export const getCities = async () => {
  try {
    const cities = await City.find();
    return cities;
  } catch (err) {
    throw new Error(err ? err.toString() : "Could not retrieve cities");
  }
};

export const getCityByItsId = async (cityId: string) => {
    try {
      const city = await City.findById(cityId);
      return city;
    } catch (err) {
      throw new Error(err? err.toString() : "Could not retrieve city");
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
      throw new Error(err ? err.toString() : "Could not update city name");
    }
};