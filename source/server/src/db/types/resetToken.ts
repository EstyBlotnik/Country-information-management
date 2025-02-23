import { Types } from "mongoose";

export interface IResetToken extends Document {
  userId: Types.ObjectId;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}
