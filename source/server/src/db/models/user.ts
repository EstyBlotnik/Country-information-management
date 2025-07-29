import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "../types/user";
import { RoleEnum } from '../enums/roleEnum';
import { ERRORS_MESSAGES } from './../../constants';

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    minlength: [2, ERRORS_MESSAGES.USER.MIN_LEN],
    maxlength: [50, ERRORS_MESSAGES.USER.MAX_LEN],
  },
  lastName: {
    type: String,
    required: true,
    minlength: [2, ERRORS_MESSAGES.USER.MIN_LEN],
    maxlength: [50, ERRORS_MESSAGES.USER.MAX_LEN],
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
    enum: Object.values(RoleEnum)
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    minlength: [2, ERRORS_MESSAGES.USER.MIN_LEN],
    maxlength: [50, ERRORS_MESSAGES.USER.MAX_LEN],
  },
  password: { type: String, required: true, minlength: 2, maxlength: 100 },
  JoiningDate: { type: Date, default: () => new Date() },
  authorizationRequests: [
    { type: Types.ObjectId, ref: "AuthorizationRequest" },
  ],
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
