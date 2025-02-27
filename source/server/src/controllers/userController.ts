import { Request, Response } from "express";
import dotenv from "dotenv";

import {
  bcryptPassword,
  createAuthorizationRequest,
  createToken,
  createUser,
  getUserById,
  getUserByOrMailUserNamePassword,
  getUserByUserName,
  matchPassword,
} from "../services/userService";

dotenv.config();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, password } = req.body;
    const user = await getUserByUserName(userName);
    if (!user) {
      res.status(401).json({ message: "Invalid userName or password" });
      return;
    }

    const isMatch = await matchPassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid userName or password" });
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
      message: "User login successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const existingUser = await getUserByOrMailUserNamePassword(
      email,
      userName,
      phoneNumber
    );

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    // const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    // if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
    //   res.status(400).json({ message: "Invalid image format" });
    //   return;
    // }
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
      maxAge: 21600000,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.json({
      message: "User registered successfully",
      token,
      newUser: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, userName } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !userName) {
      res.status(400).json({ message: "No updates provided" });
      return;
    }
    const existingUser = await getUserByOrMailUserNamePassword(
      email,
      userName,
      phoneNumber
    );

    if (existingUser && existingUser._id.toString() !== id) {
      res.status(400).json({
        message:
          "User with this email, username, or phone number already exists.",
      });
      return;
    }

    const user = await getUserById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.userName = userName || user.userName;

    // const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    // if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
    //   res.status(400).json({ message: "Invalid image format" });
    //   return;
    // }
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.role === newRole) {
      res.status(400).json({ message: "User already has this role" });
      return;
    }
    const request = await createAuthorizationRequest(id, newRole);
    user.authorizationRequests.push(request._id);
    await user.save();
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
