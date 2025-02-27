import { Request, Response } from "express";
import { ERRORS_MESSAGES } from "../constants";
import {
  createCountryService,
  deleteCountryById,
  getAllCountriesService,
  getCountryByIdService,
  getCountryByName,
  updateCountryById,
} from "../services/countryService";
export const createCountry = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, flag, population, region } = req.body;
  try {
    if (!name) {
      res.status(400).json({ message: ERRORS_MESSAGES.INVALD_NAME });
    } else {
      const existingCountry = await getCountryByName(name);
      if (existingCountry) {
        res.status(401).json({ message: ERRORS_MESSAGES.COUNTRY.EXIST });
      } else {
        const newCountry = await createCountryService(
          name,
          flag,
          population,
          region,
        );
        await newCountry.save();
        res.status(201).json(newCountry);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(402).json({ message: err.message });
    } else {
      res.status(403).json({ message: ERRORS_MESSAGES.UNKNOWN });
    }
  }
};

export const deleteCountry = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedCountry = await deleteCountryById(id);
    if (!deletedCountry) {
      res.status(404).json({ message: ERRORS_MESSAGES.COUNTRY.NOT_FOUND });
    } else {
      res.status(204).json(deletedCountry);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: ERRORS_MESSAGES.UNKNOWN });
    }
  }
};

export const updateCountry = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, flag, population, region } = req.body;

  if (!name || !flag || !population || !region) {
    res.status(400).json({ message: ERRORS_MESSAGES.MISSING_DATA });
  } else {
    try {
      const countryById = await getCountryByIdService(id);
      if (!countryById) {
        res.status(404).json({ message: ERRORS_MESSAGES });
        return;
      }
      const existingCountry = await getCountryByName(name);
      if (
        existingCountry &&
        existingCountry._id.toString() !== countryById._id.toString()
      ) {
        res.status(409).json({ message: ERRORS_MESSAGES.COUNTRY.EXIST });
      } else {
        const updatedCountry = await updateCountryById(
          id,
          name,
          flag,
          population,
          region
        );
        res.status(200).json(updatedCountry);
      }
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({ message: ERRORS_MESSAGES.UNKNOWN });
      }
    }
  }
};

export const getAllCountries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const countries = await getAllCountriesService();
    res.json(countries);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: ERRORS_MESSAGES.UNKNOWN });
    }
  }
};

export const getCountryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const country = await getCountryByIdService(id);
    if (!country) {
      res.status(404).json({ message: ERRORS_MESSAGES.COUNTRY.NOT_FOUND });
      return;
    }
    res.json(country);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: ERRORS_MESSAGES.UNKNOWN });
    }
  }
};
