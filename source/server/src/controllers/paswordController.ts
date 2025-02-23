import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Request, Response } from "express";
import User from "../db/models/user";
import ResetToken from "../db/models/resetToken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

dotenv.config();

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

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
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const token = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 3600000);
    const resetToken = new ResetToken({
      userId: user._id,
      token,
      expiresAt,
    });
    await resetToken.save();
    const resetUrl = `http://localhost:5173/passwordreset/${token}`;
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
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      res.status(403).json({ message: "Token not found or expired" });
      return;
    }
    const user = await User.findById(resetToken.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    await ResetToken.deleteOne({ token });
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
