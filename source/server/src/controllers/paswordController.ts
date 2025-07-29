import dotenv from "dotenv";
import { Request, Response } from "express";
import {
  createResetToken,
  deleteResetToken,
  getresetTokenByToken,
  sendEmail,
} from "../services/passwordService";
import { getUserByEmail, getUserById } from "../services/userService";
import {
  STATUS_CODES,
  ERRORS_MESSAGES,
  RESET_PASSWORD,
  SUCCESS_MESSAGES,
} from "../constants";
import { bcryptPassword } from "../utils/userUtils";

dotenv.config();

export const requestPasswordReset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERRORS_MESSAGES.EMAIL_REQUIRED });
      return;
    }
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(STATUS_CODES.NOT_FOUND).json({ message: ERRORS_MESSAGES.USER.NOT_ADMIN });
      return;
    }

    const resetToken = await createResetToken(user._id.toString());
    const resetUrl = `http://localhost:5173/passwordreset/${resetToken.token}`;
    sendEmail(
      email,
      RESET_PASSWORD.EMAIL_TITLE,
      `Click here to reset your password: ${resetUrl}`
    );
    res
      .status(STATUS_CODES.SUCCESS)
      .json({ message: SUCCESS_MESSAGES.RESET_PASSWORD.EMAIL_SENT });
  } catch (error) {
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: ERRORS_MESSAGES.SERVER_ERROR });
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
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERRORS_MESSAGES.MISSING_DATA });
      return;
    }
    const resetToken = await getresetTokenByToken(token);
    if (!resetToken || resetToken.expiresAt < new Date()) {
      res.status(STATUS_CODES.FORBIDDEN).json({ message: ERRORS_MESSAGES.PASSWORD.NO_TOKEN });
      return;
    }
    const user = await getUserById(resetToken.userId);
    if (!user) {
      res.status(STATUS_CODES.NOT_FOUND).json({ message: ERRORS_MESSAGES.USER.NOT_FOUND });
      return;
    }
    const hashedPassword = await bcryptPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    await deleteResetToken(token);
    res
      .status(STATUS_CODES.SUCCESS)
      .json({ message: SUCCESS_MESSAGES.RESET_PASSWORD.PASSWORT_RESET });
  } catch (error) {
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: ERRORS_MESSAGES.SERVER_ERROR });
  }
};
