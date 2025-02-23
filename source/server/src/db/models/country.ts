import mongoose, { Schema, Document, Types } from "mongoose";
import { ICountry } from "../types/country";

const countrySchema = new Schema<ICountry>({
  name: { type: String, required: true, unique: true },
  flag: { type: String, required: true },
  population: { type: Number, required: true },
  region: { type: String, required: true },
  cities: [{ type: Types.ObjectId, ref: 'City' }],
});

const Country = mongoose.model<ICountry>("Country", countrySchema);

export default Country;
