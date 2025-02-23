import mongoose, { Schema, Document } from "mongoose";
import { IResetToken } from "../types/resetToken";

const resetTokenSchema = new Schema<IResetToken>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

resetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ResetToken = mongoose.model<IResetToken>("ResetToken", resetTokenSchema);

export default ResetToken;
