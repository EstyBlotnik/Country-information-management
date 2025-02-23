import express, { Request, Response } from "express";
import {
  createCountry,
  deleteCountry,
  updateCountry,
  getAllCountries,
  getCountryById,
} from "../controllers/countryController";
import {
  editRole,
  deleteRole,
  addRole,
} from "../middlewares/checkRoleMiddlware";

const router = express.Router();

router.post("/", addRole, createCountry); // "Add" role

router.get("/", getAllCountries);

router.put("/:id", editRole, updateCountry); //"Edit" role

router.delete("/:id", deleteRole, deleteCountry); //"Delete" role

router.get("/:id", getCountryById);

export default router;
