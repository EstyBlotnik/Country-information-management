import express from "express";
import {
  addUser,
  allReqs,
  allUsers,
  changeRoleResponse,
  deleteUserById,
} from "../controllers/adminController";
import upload from "../middlewares/upload";

const router = express.Router();

router.get("/users", allUsers);
router.delete("/users/:id", deleteUserById);
router.get("/allReqests", allReqs);
router.put("/changeRoleResponse/:id", changeRoleResponse);
router.post("/addUser", upload.single("profilePicture"), addUser);

export default router;
