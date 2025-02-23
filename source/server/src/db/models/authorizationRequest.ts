import mongoose, { Schema } from "mongoose";
import { IAuthorizationRequest } from "../types/authorizationRequest";

const requestSchema = new Schema<IAuthorizationRequest>({
  requestDate: { type: Date, default: Date.now },
  responseDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  requestedRole: { type: String, enum: ["Add", "Delete", "Edit"] },
  status: { type: String, enum: ["Approved", "Denied", "Pending"] },
});

const AuthorizationRequest = mongoose.model<IAuthorizationRequest>("AuthorizationRequest", requestSchema);

export default AuthorizationRequest;
