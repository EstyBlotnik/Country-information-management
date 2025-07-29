import { Request, Response } from "express";
import {
  createCityAtCountry,
  deleteCityFromCountry,
  deleteCityFromDb,
  getCities,
  getCityByItsId,
  updateCityName,
} from "../services/cityService";
import { STATUS_CODES, ERRORS_MESSAGES } from "../constants";

export const createCity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, countryId } = req.body;
  try {
    if (!name) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERRORS_MESSAGES.INVALD_NAME });
    } else {
      const newCity = await createCityAtCountry(name, countryId);
      res.status(STATUS_CODES.CREATED).json(newCity);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ message: err.message });
    } else {
      res.status(STATUS_CODES.FORBIDDEN).json({ message: ERRORS_MESSAGES.UNKNOWN });
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
      res.status(STATUS_CODES.NOT_FOUND).json({ message: ERRORS_MESSAGES.CITY.NOT_FOUND });
    } else {
      await deleteCityFromCountry(countryId?.toString() || "", id);
      res.status(204).json(deletedCity);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    } else {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERRORS_MESSAGES.UNKNOWN });
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
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: err.message });
    } else {
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: ERRORS_MESSAGES.UNKNOWN });
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
      res.status(STATUS_CODES.NOT_FOUND).json({ message: ERRORS_MESSAGES.CITY.NOT_FOUND });
      return;
    }
    res.json(city);
  } catch (err) {
    if (err instanceof Error) {
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: err.message });
    } else {
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: ERRORS_MESSAGES.UNKNOWN });
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
      res.status(STATUS_CODES.NOT_FOUND).json({ message: ERRORS_MESSAGES.CITY.NOT_FOUND });
      return;
    }
    res.status(STATUS_CODES.SUCCESS).json(updateCity);
  } catch (err) {
    if (err instanceof Error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    } else {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERRORS_MESSAGES.UNKNOWN });
    }
  }
};
