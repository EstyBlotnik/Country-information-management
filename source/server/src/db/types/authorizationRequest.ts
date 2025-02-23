import { Types } from "mongoose";

export interface IAuthorizationRequest extends Document {
  requestDate: Date;
  responseDate: Date;
  userId: Types.ObjectId;
  requestedRole: "Add" | "Delete" | "Edit";
  status: "Approved" | "Denied" | "Pending";
}
