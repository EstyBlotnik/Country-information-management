import mongoose, { Schema, Document, Types } from "mongoose";
import { ICity } from "../types/city";

const citySchema = new Schema<ICity>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: [2, "City name must contain at least 2 characters."],
    maxlength: [50, "City name name can contain up to 50 characters."],
  },
});

const City = mongoose.model<ICity>("City", citySchema);

export default City;
