import express, { Request, Response } from "express";
import {
  changeRoleRequest,
  editUser,
  getUser,
  login,
  register,
} from "../controllers/userController";
import dotenv from "dotenv";
import passwordResetRoute from "./passwordRoute";
import { checkUserOrAdminAccess } from "../middlewares/adminMiddlware";
import upload from "../middlewares/upload";
import {
  LimitAttemptsByUsername,
  loginLimiter,
} from "../middlewares/defenseMechanisms";
import xssCleanMiddleware from "../middlewares/xss";
const xssClean = require("xss-clean");

dotenv.config();

const router = express.Router();

router.post(
  "/register",
  upload.single("profilePicture"),
  // xssClean,
  register
);
router.post("/login", loginLimiter, LimitAttemptsByUsername, login);
router.use("/password", passwordResetRoute);
router.get("/:id", checkUserOrAdminAccess, getUser);
router.put(
  "/:id",
  checkUserOrAdminAccess,
  upload.single("profilePicture"),
  // xssClean,
  editUser
);
router.put("/changeRole/:id", changeRoleRequest);

export default router;
