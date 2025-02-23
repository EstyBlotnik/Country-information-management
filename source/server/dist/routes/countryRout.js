"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contry_1 = __importDefault(require("../db/models/contry"));
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   const response = await axios.get("https://restcountries.com/v3.1/all");
    //   console.log(response);
    const { name, flag, population, region } = req.body;
    try {
        if (!name || !name.common) {
            res.status(400).json({ message: "Invalid name format" });
        }
        else {
            const existingCountry = yield contry_1.default.findOne({ name: name.common });
            if (existingCountry) {
                res.status(401).json({ message: "Country already exists" });
            }
            else {
                const newCountry = new contry_1.default({
                    name: name.common,
                    flag,
                    population,
                    region,
                });
                yield newCountry.save();
                res.status(201).json(newCountry);
            }
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ message: "err.message" });
        }
        else {
            res.status(400).json({ message: "An unknown error occurred." });
        }
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countries = yield contry_1.default.find();
        res.json(countries);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred." });
        }
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, flag, population, region } = req.body;
    if (!name || !flag || !population || !region) {
        res.status(400).json({ message: "Invalid data format" });
    }
    else {
        try {
            const countryById = yield contry_1.default.findById(id);
            if (!countryById) {
                res.status(404).json({ message: "Country not found" });
                return;
            }
            const existingCountry = yield contry_1.default.findOne({ name });
            if (existingCountry) {
                res.status(401).json({ message: "Country already exists" });
            }
            else {
                const updatedCountry = yield contry_1.default.findByIdAndUpdate(id, {
                    name,
                    flag,
                    population,
                    region,
                }, { new: true });
                res.status(200).json(updatedCountry);
            }
        }
        catch (err) {
            if (err instanceof Error) {
                res.status(400).json({ message: err.message });
            }
            else {
                res.status(400).json({ message: "An unknown error occurred." });
            }
        }
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    try {
        const deletedCountry = yield contry_1.default.findByIdAndDelete(id);
        if (!deletedCountry) {
            res.status(404).json({ message: "Country not found." });
        }
        else {
            res.status(204).json(deletedCountry);
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: "An unknown error occurred." });
        }
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const country = yield contry_1.default.findById(id);
        if (!country) {
            res.status(404).json({ message: "Country not found." });
        }
        else {
            res.json(country);
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred." });
        }
    }
}));
exports.default = router;
