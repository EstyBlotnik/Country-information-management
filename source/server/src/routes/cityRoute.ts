import express, { Request, Response } from "express";
import {
  createCity,
  deleteCity,
  getAllCities,
  getCityById,
  updateCity,
} from "../controllers/cityController";
import { editRole } from "../middlewares/checkRoleMiddlware";

const router = express.Router();

router.post("/", editRole, createCity); //"Edit" role

router.get("/", getAllCities);

router.delete("/:id", editRole, deleteCity); //"Edit" role

router.get("/:id", getCityById);

router.put("/:id", editRole, updateCity); //"Edit" role

export default router;
