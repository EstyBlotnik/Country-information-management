import { Request, Response } from "express";
import dotenv from "dotenv";

import {
  createAuthorizationRequest,
  createUser,
  getUserById,
  getUserByOrMailUserNamePassword,
  getUserByUserName,
  matchPassword,
} from "../services/userService";
import { STATUS_CODES, ERRORS_MESSAGES, SUCCESS_MESSAGES } from "../constants";
import { bcryptPassword, createToken } from "../utils/userUtils";

dotenv.config();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, password } = req.body;
    const user = await getUserByUserName(userName);
    if (!user) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: ERRORS_MESSAGES.USER.INVALID_DATA_LOGIN });
      return;
    }

    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: ERRORS_MESSAGES.USER.INVALID_DATA_LOGIN });
      return;
    }

    const token = await createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 21600000,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({
      message: SUCCESS_MESSAGES.USER.USER_LOGDIN,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: ERRORS_MESSAGES.SERVER_ERROR });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phoneNumber, userName, password } =
      req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !userName ||
      !password
    ) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: ERRORS_MESSAGES.MISSING_DATA });
      return;
    }

    const existingUser = await getUserByOrMailUserNamePassword(
      email,
      userName,
      phoneNumber
    );

    if (existingUser) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: ERRORS_MESSAGES.USER.DUPLICATE_USER });
      return;
    }
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : "";
    const hashedPassword = await bcryptPassword(password);

    const newUser = await createUser(
      firstName,
      lastName,
      email,
      phoneNumber,
      profilePicture,
      userName,
      hashedPassword
    );
    const token = await createToken(newUser);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 21600000, //1000*60*60*6 6hours
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.json({
      message: SUCCESS_MESSAGES.USER.REGISTERD,
      token,
      newUser: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: ERRORS_MESSAGES.SERVER_ERROR });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERRORS_MESSAGES.USER.NOT_FOUND });
      return;
    }
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: ERRORS_MESSAGES.SERVER_ERROR });
  }
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, userName } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !userName) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: ERRORS_MESSAGES.NO_UPDATES_PROVIDED });
      return;
    }
    const existingUser = await getUserByOrMailUserNamePassword(
      email,
      userName,
      phoneNumber
    );

    if (existingUser && existingUser._id.toString() !== id) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        message: ERRORS_MESSAGES.USER.DUPLICATE_USER,
      });
      return;
    }

    const user = await getUserById(id);

    if (!user) {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERRORS_MESSAGES.USER.NOT_FOUND });
      return;
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.userName = userName || user.userName;

    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: ERRORS_MESSAGES.SERVER_ERROR });
  }
};

export const changeRoleRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { newRole } = req.body;
    const user = await getUserById(id);
    if (!user) {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERRORS_MESSAGES.USER.NOT_FOUND });
      return;
    }
    if (user.role === newRole) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: ERRORS_MESSAGES.USER.ROLE_EXISTING });
      return;
    }
    const request = await createAuthorizationRequest(id, newRole);
    user.authorizationRequests.push(request._id);
    await user.save();
    res.json(request);
  } catch (err) {
    console.error(err);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: ERRORS_MESSAGES.SERVER_ERROR });
  }
};
