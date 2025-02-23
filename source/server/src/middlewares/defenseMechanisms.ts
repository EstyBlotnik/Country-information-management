import rateLimit from "express-rate-limit"; // Importing express-rate-limit to limit request rates
import NodeCache from "node-cache"; // Importing NodeCache for caching login attempts

// Setting up the rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again in 2 minutes.",
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

