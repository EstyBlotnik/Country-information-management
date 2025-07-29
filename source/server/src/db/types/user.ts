import { Types } from "mongoose";
import { RoleEnum } from "../enums/roleEnum";

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  // role: "View" | "Edit" | "Add" | "Delete" | "Admin";
  role: (typeof RoleEnum)[keyof typeof RoleEnum];
  userName: string;
  password: string;
  JoiningDate: Date;
  authorizationRequests: Types.ObjectId[];
}
