import mongoose, { Schema, Document, Types } from "mongoose";
import { ICountry } from "../types/country";
import { ERRORS_MESSAGES } from "../../constants";

const countrySchema = new Schema<ICountry>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: [2, ERRORS_MESSAGES.COUNTRY.MIN_LEN],
    maxlength: [50, ERRORS_MESSAGES.COUNTRY.MAX_LEN],
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
    minlength: [2, ERRORS_MESSAGES.GENERAL.MIN_LEN_REG],
    maxlength: [50, ERRORS_MESSAGES.GENERAL.MAX_LEN_REG],
  },
  cities: [{ type: Types.ObjectId, ref: "City" }],
});

const Country = mongoose.model<ICountry>("Country", countrySchema);

export default Country;
