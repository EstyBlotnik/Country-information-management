import ResetToken from "../db/models/resetToken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { ERRORS_MESSAGES } from "../constants";

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
    if (error instanceof Error) {
      throw new Error(
        `${ERRORS_MESSAGES.PASSWORD.SENDING_EMAIL}: ${error.message}`
      );
    } else {
      throw new Error(ERRORS_MESSAGES.PASSWORD.SENDING_EMAIL);
    }
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
    throw new Error(ERRORS_MESSAGES.PASSWORD.CREAT_TOKEN);
  }
};

export const getresetTokenByToken = async (token: string) => {
  try {
    const resetToken = await ResetToken.findOne({ token });
    return resetToken;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(ERRORS_MESSAGES.PASSWORD.FETCH_TOKEN);
  }
};

export const deleteResetToken = async (token: string) => {
  try {
    return await ResetToken.deleteOne({ token });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(ERRORS_MESSAGES.PASSWORD.DELETE_TOKEN);
  }
};
