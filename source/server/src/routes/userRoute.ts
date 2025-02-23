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
import upload from "../middlewares/upload"
import { loginLimiter } from "../middlewares/defenseMechanisms";

dotenv.config();

const router = express.Router();

router.post("/register", upload.single("profilePicture"), register);
router.post("/login", loginLimiter, login);
router.use("/password", passwordResetRoute);
router.get("/:id", checkUserOrAdminAccess, getUser);
router.put("/:id", checkUserOrAdminAccess, upload.single("profilePicture"), editUser);
router.put("/changeRole/:id", changeRoleRequest);

export default router;
