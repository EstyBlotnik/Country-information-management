import User from "../db/models/user";
import ResetToken from "../db/models/resetToken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

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
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const createResetToken = async (userId: string) => {
  try {
    const token = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 3600000);
    const resetToken = new ResetToken({
      userId,
      token,
      expiresAt,
    });
    await resetToken.save();
    return resetToken;
  } catch {
    throw new Error("Error creating reset token");
  }
};
export const getresetTokenByToken = async (token: string) => {
  try {
    const resetToken = await ResetToken.findOne({ token });
    return resetToken;
  } catch (error) {
    throw new Error("Error fetching reset token");
  }
};

export const deleteResetToken = async (token: string) => {
  try {
    return await ResetToken.deleteOne({ token });
  } catch (error) {
    throw new Error("Error deleting reset token");
  }
};
