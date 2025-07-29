import mongoose, { Schema } from "mongoose";
import { IAuthorizationRequest } from "../types/authorizationRequest";
import { RoleEnum } from "../enums/roleEnum";

const requestSchema = new Schema<IAuthorizationRequest>({
  requestDate: { type: Date, default: () => new Date(), required: true },
  responseDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requestedRole: {
    type: String,
    enum: [RoleEnum.ADD, RoleEnum.DELETE, RoleEnum.EDIT],
    required: true,
  },
  status: {
    type: String,
    enum: ["Approved", "Denied", "Pending"],
    required: true,
    default: "Pending",
  },
});

const AuthorizationRequest = mongoose.model<IAuthorizationRequest>(
  "AuthorizationRequest",
  requestSchema
);

export default AuthorizationRequest;
