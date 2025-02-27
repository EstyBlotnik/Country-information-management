import dotenv from "dotenv";
import { Request, Response } from "express";
import {
  createResetToken,
  deleteResetToken,
  getresetTokenByToken,
  sendEmail,
} from "../services/passwordService";
import {
  bcryptPassword,
  getUserByEmail,
  getUserById,
} from "../services/userService";

dotenv.config();

export const requestPasswordReset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resetToken = await createResetToken(user._id.toString());
    const resetUrl = `http://localhost:5173/passwordreset/${resetToken.token}`;
    sendEmail(
      email,
      "RESET PASS",
      `Click here to reset your password: ${resetUrl}`
    );
    res.status(200).json({ message: "Reset password link sent to email" });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ message: "Token and new password are required" });
      return;
    }
    const resetToken = await getresetTokenByToken(token);
    if (!resetToken || resetToken.expiresAt < new Date()) {
      res.status(403).json({ message: "Token not found or expired" });
      return;
    }
    const user = await getUserById(resetToken.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const hashedPassword = await bcryptPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    await deleteResetToken(token);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
