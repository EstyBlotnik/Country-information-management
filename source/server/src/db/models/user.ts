import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    minlength: [2, "firstName must contain at least 2 characters."],
    maxlength: [50, "firstName can contain up to 50 characters."],
  },
  lastName: {
    type: String,
    required: true,
    minlength: [2, "lastName must contain at least 2 characters."],
    maxlength: [50, "lastName can contain up to 50 characters."],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 50,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
    match: /^[0-9]{10}$/,
  },
  profilePicture: { type: String },
  role: {
    type: String,
    required: true,
    enum: ["View", "Edit", "Add", "Delete", "Admin"],
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    minlength: [2, "userName must contain at least 2 characters."],
    maxlength: [50, "userName can contain up to 50 characters."],
  },
  password: { type: String, required: true, minlength: 2, maxlength: 100 },
  JoiningDate: { type: Date, default: () => new Date() },
  authorizationRequests: [
    { type: Types.ObjectId, ref: "AuthorizationRequest" },
  ],
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
