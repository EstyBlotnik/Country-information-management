import mongoose, { Schema, Document, Types } from "mongoose";
import { ICountry } from "../types/country";

const countrySchema = new Schema<ICountry>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: [2, "Country name must contain at least 2 characters."],
    maxlength: [50, "Country name can contain up to 50 characters."],
  },
  flag: { type: String, required: true, minlength: 2, maxlength: 50 },
  population: {
    type: Number,
    required: true,
    min: [1, "Population must be greater than 0"],
  },
  region: {
    type: String,
    required: true,
    minlength: [2, "region must contain at least 2 characters."],
    maxlength: [50, "region name can contain up to 50 characters."],
  },
  cities: [{ type: Types.ObjectId, ref: "City" }],
});

const Country = mongoose.model<ICountry>("Country", countrySchema);

export default Country;
