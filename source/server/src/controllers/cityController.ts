import { Request, Response } from "express";
import City from "../db/models/city";
import { Types } from "mongoose";
import Country from "../db/models/country";

export const createCity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, countryId } = req.body;
  try {
    if (!name) {
      res.status(400).json({ message: "Invalid name format" });
    } else {
      console.log("at try 1");
      const country = await Country.findById(countryId);
      if (!country) {
        res.status(404).json({ message: "Country is not found." });
      } else {
        console.log("at try 2");
        const existingCity = await City.findOne({ name: name });
        console.log("at try 3", existingCity);
        if (existingCity) {
          console.log("at try 4");
          if (country.cities.includes(existingCity._id))
            res.status(401).json({ message: "City already exists" });
          else {
            console.log("at try 3");
            country.cities.push(existingCity._id);
            await country.save();
            res.status(201).json(existingCity);
          }
        } else {
          const newCity = new City({
            name,
          });
          await newCity.save();
          country.cities.push(newCity._id);
          await country.save();
          res.status(201).json(newCity);
        }
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

export const deleteCity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { countryId } = req.query;
  try {
    const deletedCity = await City.findByIdAndDelete(id);
    if (!deletedCity) {
      res.status(404).json({ message: "City not found." });
    } else {
      const country = await Country.findByIdAndUpdate(
        countryId,
        { $pull: { cities: id } },
        { new: true }
      );
      res.status(204).json(deletedCity);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred." });
    }
  }
};

export const getAllCities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

export const getCityById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const city = await City.findById(id);
    if (!city) {
      res.status(404).json({ message: "City not found" });
      return;
    }
    res.json(city);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
};

export const updateCity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;
  console.log(name);
  try {
    const updateCity = await City.findByIdAndUpdate(id, name);
    if (!updateCity) {
      res.status(404).json({ message: "City not found" });
      return;
    }
    res.status(200).json(updateCity);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred." });
    }
  }
};
