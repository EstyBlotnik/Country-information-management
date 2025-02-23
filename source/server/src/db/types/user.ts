import { Types } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  role: "View" | "Edit" | "Add" | "Delete" | "Admin";
  userName: string;
  password: string;
  JoiningDate: Date;
  openRequest: Types.ObjectId| undefined;
  closedRequests: Types.ObjectId[];
}
