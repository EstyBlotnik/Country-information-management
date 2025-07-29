import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { verifyToken } from "./adminMiddlware";
import { STATUS_CODES, ERRORS_MESSAGES } from "../constants";

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
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: ERRORS_MESSAGES.ACCESS.NO_TOKEN });
      return;
    } else {
      const decoded = verifyToken(token);
      req.user = decoded;

      // Check if the user's role is allowed to add resources (Admin, Add, Edit, Delete)
      if (!["Admin", "Add", "Edit", "Delete"].includes(req.user.role)) {
        res.status(STATUS_CODES.FORBIDDEN).json({ message: ERRORS_MESSAGES.ACCESS.ADD_ONLY });
        return;
      }
    }
  } catch (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERRORS_MESSAGES.ACCESS.INVALID_TOKEN });
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
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: ERRORS_MESSAGES.ACCESS.NO_TOKEN });
      return;
    } else {
      // Verify the token and store the decoded payload in the request object
      const decoded = verifyToken(token);
      req.user = decoded;
      // Check if the user's role is allowed to edit resources (Admin, Edit, Delete)
      if (!["Admin", "Edit", "Delete"].includes(req.user.role)) {
        res.status(STATUS_CODES.FORBIDDEN).json({ message: ERRORS_MESSAGES.ACCESS.EDIT_ONLY });
        return;
      }
    }
  } catch (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERRORS_MESSAGES.ACCESS.INVALID_TOKEN });
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
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: ERRORS_MESSAGES.ACCESS.NO_TOKEN });
      return;
    } else {
      const decoded = verifyToken(token);
      req.user = decoded;

      // Check if the user's role is allowed to delete resources (Admin, Delete)
      if (!["Admin", "Delete"].includes(req.user.role)) {
        res.status(STATUS_CODES.FORBIDDEN).json({ message: ERRORS_MESSAGES.ACCESS.DELETE_ONLY });
        return;
      }
    }
  } catch (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERRORS_MESSAGES.ACCESS.INVALID_TOKEN });
    return;
  }
  next();
};
