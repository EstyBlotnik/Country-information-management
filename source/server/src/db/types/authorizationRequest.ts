import { Types } from "mongoose";
import { RoleEnum } from "../enums/roleEnum";
export interface IAuthorizationRequest extends Document {
  requestDate: Date;
  responseDate: Date;
  userId: Types.ObjectId;
  requestedRole:
    | typeof RoleEnum.ADD
    | typeof RoleEnum.DELETE
    | typeof RoleEnum.EDIT;
  status: "Approved" | "Denied" | "Pending";
}
