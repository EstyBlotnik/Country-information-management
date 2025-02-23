import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../db/models/user";
import AuthorizationRequest from "../db/models/authorizationRequest";
import {
  getLoginDelay,
  trackLoginAttempts,
} from "../middlewares/defenseMechanisms";

dotenv.config();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, password } = req.body;
    const attempts = trackLoginAttempts(userName);
    const delay = getLoginDelay(attempts);

    if (attempts > 3) {
      res.status(429).send(`Wait ${delay / 1000} seconds before trying again.`);
      return;
    }
    const user = await User.findOne({ userName })
      .populate("openRequest")
      .populate("closedRequests");
    if (!user) {
      res.status(401).json({ message: "Invalid userName or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid userName or password" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
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

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }, { phoneNumber }],
    });
    
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
      res.status(400).json({ message: "Invalid image format" });
      return;
    }
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : "";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      profilePicture,
      role: "View",
      userName,
      password: hashedPassword,
      JoiningDate: new Date(),
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "6h" }
    );
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
    const user = await User.findById(id)
      .populate("openRequest")
      .populate("closedRequests");
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
    console.log(req.body);
    console.log("req.file:", req.file);
    console.log("req.files:", req.files);

    if (!firstName || !lastName || !email || !phoneNumber || !userName) {
      res.status(400).json({ message: "No updates provided" });
      return;
    }
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }, { phoneNumber }],
    });

    if (existingUser && existingUser._id.toString() !== id) {
      res.status(400).json({
        message:
          "User with this email, username, or phone number already exists.",
      });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.userName = userName || user.userName;

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (req.file && !allowedMimeTypes.includes(req.file.mimetype)) {
      res.status(400).json({ message: "Invalid image format" });
      return;
    }
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
    console.log("id: " + id + ", new role: " + newRole);
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.role === newRole || user.openRequest) {
      res.status(400).json({ message: "User already has this role" });
      return;
    }
    const request = new AuthorizationRequest({
      requestDate: new Date(),
      userId: id,
      requestedRole: newRole,
      status: "Pending",
    });

    console.log("request: ", request);
    await request.save();
    user.openRequest = request._id;
    await user.save();
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
