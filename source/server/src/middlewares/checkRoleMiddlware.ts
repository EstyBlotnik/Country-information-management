import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { verifyToken } from "./adminMiddlware";

dotenv.config();

// Define interface for the request object to include user details
interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

// Middleware to allow access if the user has a role that can "add" resources
export const addRole = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    } else {
      const { id } = req.params;
      console.log("id:", req.params);

      const decoded = verifyToken(token);
      req.user = decoded;

      // Check if the user's role is allowed to add resources (Admin, Add, Edit, Delete)
      if (!["Admin", "Add", "Edit", "Delete"].includes(req.user.role)) {
        res.status(403).json({ message: "Access denied. Add only." });
        return;
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
    return;
  }
  next();
};

// Middleware to allow access if the user has a role that can "edit" resources
export const editRole = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve the token from cookies
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    } else {
      const { id } = req.params;
      console.log("id:", req.params);

      // Verify the token and store the decoded payload in the request object
      const decoded = verifyToken(token);
      req.user = decoded;
      // Check if the user's role is allowed to edit resources (Admin, Edit, Delete)
      if (!["Admin", "Edit", "Delete"].includes(req.user.role)) {
        res.status(403).json({ message: "Access denied. Edit only." });
        return;
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
    return;
  }
  next();
};

// Middleware to allow access if the user has a role that can "delete" resources
export const deleteRole = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    } else {
      const { id } = req.params;
      console.log("id:", req.params);

      const decoded = verifyToken(token);
      req.user = decoded;

      // Check if the user's role is allowed to delete resources (Admin, Delete)
      if (!["Admin", "Delete"].includes(req.user.role)) {
        res.status(403).json({ message: "Access denied. Delete only." });
        return;
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
    return;
  }
  next();
};
