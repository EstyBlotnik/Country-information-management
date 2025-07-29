import { Request, Response } from "express";
import { STATUS_CODES, ERRORS_MESSAGES } from "../constants";
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
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: ERRORS_MESSAGES.INVALD_NAME });
    } else {
      if (!flag || !population || !region) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: ERRORS_MESSAGES.MISSING_DATA });
        return;
      }
      const existingCountry = await getCountryByName(name);
      if (existingCountry) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: ERRORS_MESSAGES.COUNTRY.EXIST });
      } else {
        const newCountry = await createCountryService(
          name,
          flag,
          population,
          region
        );
        await newCountry.save();
        res.status(STATUS_CODES.CREATED).json(newCountry);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log("error add country: ", err);
      res.status(STATUS_CODES.UNAUTHORIZED).json({ message: err.message });
    } else {
      res
        .status(STATUS_CODES.FORBIDDEN)
        .json({ message: ERRORS_MESSAGES.UNKNOWN });
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
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERRORS_MESSAGES.COUNTRY.NOT_FOUND });
    } else {
      res.status(204).json(deletedCountry);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    } else {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: ERRORS_MESSAGES.UNKNOWN });
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
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: ERRORS_MESSAGES.MISSING_DATA });
  } else {
    try {
      const countryById = await getCountryByIdService(id);
      if (!countryById) {
        res.status(STATUS_CODES.NOT_FOUND).json({ message: ERRORS_MESSAGES });
        return;
      }
      const existingCountry = await getCountryByName(name);
      if (
        existingCountry &&
        existingCountry._id.toString() !== countryById._id.toString()
      ) {
        res
          .status(STATUS_CODES.CONFLICT)
          .json({ message: ERRORS_MESSAGES.COUNTRY.EXIST });
      } else {
        const updatedCountry = await updateCountryById(
          id,
          name,
          flag,
          population,
          region
        );
        res.status(STATUS_CODES.SUCCESS).json(updatedCountry);
      }
    } catch (err) {
      if (err instanceof Error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
      } else {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: ERRORS_MESSAGES.UNKNOWN });
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
      res.status(STATUS_CODES.SERVER_ERROR).json({ message: err.message });
    } else {
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: ERRORS_MESSAGES.UNKNOWN });
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
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERRORS_MESSAGES.COUNTRY.NOT_FOUND });
      return;
    }
    res.json(country);
  } catch (err) {
    if (err instanceof Error) {
      res.status(STATUS_CODES.SERVER_ERROR).json({ message: err.message });
    } else {
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: ERRORS_MESSAGES.UNKNOWN });
    }
  }
};
