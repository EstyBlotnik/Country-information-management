import mongoose, { Schema, Document, Types } from "mongoose";
import { ICity } from "../types/city";

const citySchema = new Schema<ICity>({
  name: { type: String, required: true, unique: true },
});

const City = mongoose.model<ICity>("City", citySchema);

export default City;
