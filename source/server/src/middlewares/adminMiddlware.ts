import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
    throw new Error("Invalid token.");
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
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    } else {
      const decoded = verifyToken(token);
      req.user = decoded;

      // Check if the decoded user role is 'Admin'
      if (req.user.role !== "Admin" || req.user.role === undefined) {
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
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
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    } else {
      const { id } = req.params;

      const decoded = verifyToken(token);
      req.user = decoded;

      // Check if the user is either an admin or the user themselves
      if (req.user.role !== "Admin" && req.user.id !== id) {
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
    return;
  }
  next();
};

export default adminMiddleware;
