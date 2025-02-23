import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  role: {
    type: String,
    required: true,
    enum: ["View", "Edit", "Add", "Delete", "Admin"],
  },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  JoiningDate: { type: Date, default: () => new Date() },
  openRequest: { type: Types.ObjectId, ref: "AuthorizationRequest" },
  closedRequests: [{ type: Types.ObjectId, ref: "AuthorizationRequest" }],
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
