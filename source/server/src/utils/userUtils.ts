import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../db/types/user";
import { ERRORS_MESSAGES } from "../constants";

export const bcryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const createToken = async (user: IUser) => {
  try {
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "6h" }
    );
    return token;
  } catch (err) {
    throw new Error(err ? err.toString() : ERRORS_MESSAGES.USER.CREATE_TOKEN);
  }
};
