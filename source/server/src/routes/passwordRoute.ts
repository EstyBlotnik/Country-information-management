import express from "express";
import {
  resetPassword,
  requestPasswordReset,
} from "../controllers/paswordController";

const router = express.Router();

router.post("/get-mail", requestPasswordReset);

router.post("/reset-password/:token", resetPassword);

export default router;
