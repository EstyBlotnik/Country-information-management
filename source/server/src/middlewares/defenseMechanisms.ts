import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit"; // Importing express-rate-limit to limit request rates
import NodeCache from "node-cache"; // Importing NodeCache for caching login attempts
import { ERRORS_MESSAGES } from "../constants";

// Setting up the rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
  message: ERRORS_MESSAGES.LOGIN_LIMIT,
  headers: true,
});

// Initialize cache for tracking login attempts per user
const loginAttempts = new NodeCache({ stdTTL: 600 });
// Function to track login attempts for a given username
export const trackLoginAttempts = (username: string): number => {
  const attempts = (loginAttempts.get(username) as number) || 0;
  loginAttempts.set(username, attempts + 1);
  return attempts + 1;
};

// Function to calculate the delay for the next login attempt based on the number of attempts
export const getLoginDelay = (attempts: number): number => {
  return Math.min(2 ** attempts * 1000, 30000);
};

export const LimitAttemptsByUsername = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userName } = req.body;
  const attempts = trackLoginAttempts(userName);
  const delay = getLoginDelay(attempts);
  if (attempts > 3) {
    res.status(429).send(`Wait ${delay / 1000} seconds before trying again.`);
    return;
  }
  next();
};
