import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { STATUS_CODES, ERRORS_MESSAGES } from "../constants";

dotenv.config();

// Define interface for the request object to include user details
interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

// Helper function to verify JWT token and decode its payload
export const verifyToken = (token: string) => {
  try {
    // Verify and decode the token using the secret key from environment variables
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };
  } catch (error) {
    // Throw an error if token verification fails
    throw new Error(ERRORS_MESSAGES.ACCESS.INVALID_TOKEN);
  }
};

// Middleware to check if the user is an admin
export const adminMiddleware = (
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

      // Check if the decoded user role is 'Admin'
      if (req.user.role !== "Admin" || req.user.role === undefined) {
        res.status(STATUS_CODES.FORBIDDEN).json({ message: ERRORS_MESSAGES.ACCESS.ADMIN_ONLY });
        return;
      }
    }
  } catch (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERRORS_MESSAGES.ACCESS.INVALID_TOKEN });
    return;
  }
  next();
};

// Middleware to allow access to either the admin or the user itself
export const checkUserOrAdminAccess = (
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
      const { id } = req.params;

      const decoded = verifyToken(token);
      req.user = decoded;

      // Check if the user is either an admin or the user themselves
      if (req.user.role !== "Admin" && req.user.id !== id) {
        res.status(STATUS_CODES.FORBIDDEN).json({ message: ERRORS_MESSAGES.ACCESS.ADMIN_ONLY });
        return;
      }
    }
  } catch (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERRORS_MESSAGES.ACCESS.INVALID_TOKEN });
    return;
  }
  next();
};

export default adminMiddleware;
