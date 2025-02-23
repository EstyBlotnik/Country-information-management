import { Request, Response } from "express";
import User from "../db/models/user";
import jwt from "jsonwebtoken";
import AuthorizationRequest from "../db/models/authorizationRequest";
import bcrypt from "bcryptjs";

// Get all users
export const allUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    console.log(users);
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user by ID
export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("deleteUserById");
  try {
    const { id } = req.params;
    const token = req.cookies.token;
    console.log("admin token:", token);
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        role: string;
      };
      console.log("decoded:", decoded);
      if (decoded.id === id) {
        res.status(403).json({
          message: "Access denied. You can't delete your own account.",
        });
        return;
      }
    }
    const deletedUser = await User.findByIdAndDelete(id);
    console.log(id, deletedUser);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found." });
    } else {
      res.status(204).json(deletedUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Change the role of a user based on authorization request approval
export const changeRoleResponse = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("changeRoleResponse");
  try {
    const { id } = req.params;
    const { approved } = req.body;
    console.log("approved: ", approved);
    console.log("id: ", id);
    if (!id) {
      res.status(400).json({ message: "Missing reqest." });
      return;
    }
    const reqest = await AuthorizationRequest.findById(id);
    console.log("reqest: ", reqest);
    if (!reqest) {
      res.status(404).json({ message: "Request not found." });
      return;
    }
    const user = await User.findById(reqest.userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    if (approved === "true") {
      console.log("approved=true");
      user.role = reqest.requestedRole;
      reqest.status = "Approved";
    } else {
      reqest.status = "Denied";
    }
    user.closedRequests.push(reqest._id);
    user.openRequest = undefined;
    await user.save();
    reqest.responseDate = new Date();
    await reqest.save();
    res.status(200).json({ user, reqest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all authorization requests
export const allReqs = async (req: Request, res: Response): Promise<void> => {
  try {
    const reqests = await AuthorizationRequest.find();
    console.log(reqests);
    res.status(200).json({ reqests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new user
export const addUser = async (req: Request, res: Response): Promise<void> => {
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
    console.log(profilePicture);
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
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.json({
      message: "User registered successfully",
      newUser: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}