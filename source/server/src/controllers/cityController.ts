import { Request, Response } from "express";
import {
  createCityAtCountry,
  deleteCityFromCountry,
  deleteCityFromDb,
  getCities,
  getCityByItsId,
  updateCityName,
} from "../services/cityService";
import { ERRORS_MESSAGES } from "../constants";

export const createCity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, countryId } = req.body;
  try {
    if (!name) {
      res.status(400).json({ message: ERRORS_MESSAGES.INVALD_NAME });
    } else {
      const newCity = await createCityAtCountry(name, countryId);
      res.status(201).json(newCity);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(402).json({ message: err.message });
    } else {
      res.status(403).json({ message: ERRORS_MESSAGES.UNKNOWN });
    }
  }
};

export const deleteCity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { countryId } = req.query;
  try {
    const deletedCity = await deleteCityFromDb(id);
    if (!deletedCity) {
      res.status(404).json({ message: ERRORS_MESSAGES.CITY.NOT_FOUND });
    } else {
      await deleteCityFromCountry(countryId?.toString() || "", id);
      res.status(204).json(deletedCity);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: ERRORS_MESSAGES.UNKNOWN });
    }
  }
};

export const getAllCities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cities = await getCities();
    res.json(cities);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: ERRORS_MESSAGES.UNKNOWN });
    }
  }
};

export const getCityById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const city = await getCityByItsId(id);
    if (!city) {
      res.status(404).json({ message: ERRORS_MESSAGES.CITY.NOT_FOUND });
      return;
    }
    res.json(city);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: ERRORS_MESSAGES.UNKNOWN });
    }
  }
};

export const updateCity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updateCity = await updateCityName(id, name);
    if (!updateCity) {
      res.status(404).json({ message: ERRORS_MESSAGES.CITY.NOT_FOUND });
      return;
    }
    res.status(200).json(updateCity);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: ERRORS_MESSAGES.UNKNOWN });
    }
  }
};
