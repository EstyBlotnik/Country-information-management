import { Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  role: "View" | "Edit" | "Add" | "Delete" | "Admin";
  userName: string;
  password: string;
  JoiningDate: Date;
  authorizationRequests: Types.ObjectId[];
}
