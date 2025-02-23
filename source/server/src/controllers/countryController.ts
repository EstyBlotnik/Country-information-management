import { Request, Response } from "express";
import Country from "../db/models/country";
import City from "../db/models/city";
import { Types } from "mongoose";

export const createCountry = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, flag, population, region } = req.body;
  try {
    if (!name) {
      res.status(400).json({ message: "Invalid name format" });
    } else {
      const existingCountry = await Country.findOne({ name: name });
      if (existingCountry) {
        res.status(401).json({ message: "Country already exists" });
      } else {
        const newCountry = new Country({
          name,
          flag,
          population,
          region,
        });
        await newCountry.save();
        res.status(201).json(newCountry);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(402).json({ message: err.message });
    } else {
      res.status(403).json({ message: "An unknown error occurred." });
    }
  }
};

export const deleteCountry = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedCountry = await Country.findByIdAndDelete(id);
    if (!deletedCountry) {
      res.status(404).json({ message: "Country not found." });
    } else {
      res.status(204).json(deletedCountry);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred." });
    }
  }
};

export const updateCountry = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, flag, population, region } = req.body;
  console.log("reqBody: ", req.body);

  if (!name || !flag || !population || !region) {
    res.status(400).json({ message: "Invalid data format" });
  } else {
    try {
      const countryById = await Country.findById(id).populate("cities");
      if (!countryById) {
        res.status(404).json({ message: "Country not found" });
        return;
      }
      console.log(countryById);
      const existingCountry = await Country.findOne({ name });
      console.log(existingCountry);

      const cityIds: Types.ObjectId[] = [];
      if (
        existingCountry &&
        existingCountry._id.toString() !== countryById._id.toString()
      ) {
        res.status(409).json({ message: "Country name already exists" });
      } else {
        const updatedCountry = await Country.findByIdAndUpdate(
          id,
          {
            name,
            flag,
            population,
            region,
          },
          { new: true }
        );
        res.status(200).json(updatedCountry);
      }
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({ message: "An unknown error occurred." });
      }
    }
  }
};

export const getAllCountries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const countries = await Country.find().populate({
      path: "cities",
      model: "City",
      select: "name",
    });
    res.json(countries);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

export const getCountryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const country = await Country.findById(id);
    if (!country) {
      res.status(404).json({ message: "Country not found" });
      return;
    }
    res.json(country);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};


