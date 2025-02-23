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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
test("should add a new country", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.default)
        .post("/countries")
        .send({
        name: { common: "South Georgia" },
        flag: "sg",
        population: 30,
        region: "Antarctic",
    })
        .expect(201);
}));
test("add country - no name sent", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.default)
        .post("/countries")
        .send({
        flag: "ca",
        population: 37742154,
        region: "North America",
    })
        .expect(400);
}));
test("add country - country already exist", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.default)
        .post("/countries")
        .send({
        name: { common: "South Georgia" },
        flag: "https://flagcdn.com/w320/gs.png",
        population: 30,
        region: "Antarctic",
    })
        .expect(401);
}));
test("add country - missing details", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.default)
        .post("/countries")
        .send({
        name: { common: "ggg" },
    })
        .expect(400);
}));
test("get all countries", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.default).get("/countries").expect(200);
}));
test("get country by id", () => __awaiter(void 0, void 0, void 0, function* () {
    const existingCountryId = "678f834037a891f2168c0002";
    const expectedCountry = {
        _id: existingCountryId,
        name: "South Georgia",
        flag: "https://flagcdn.com/w320/gs.png",
        population: 30,
        region: "Antarctic",
    };
    const response = yield (0, supertest_1.default)(app_1.default)
        .get(`/countries/${existingCountryId}`)
        .expect(200);
    expect(response.body).toMatchObject(expectedCountry);
}));
test("get country by id - id does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
    const existingCountryId = "507f1f77bcf86cd799439011";
    const response = yield (0, supertest_1.default)(app_1.default)
        .get(`/countries/${existingCountryId}`)
        .expect(404);
}));
test("get country by id - not an id format", () => __awaiter(void 0, void 0, void 0, function* () {
    const existingCountryId = "1";
    const response = yield (0, supertest_1.default)(app_1.default)
        .get(`/countries/${existingCountryId}`)
        .expect(500);
}));
test("update country", () => __awaiter(void 0, void 0, void 0, function* () {
    const existingCountryId = "678f827fbde9ee39c111df1a";
    const updatedCountry = {
        name: { common: "Grenada" },
        flag: "https://flagcdn.com/w320/gd.png",
        population: 112519,
        region: "Americas",
    };
    const response = yield (0, supertest_1.default)(app_1.default)
        .put(`/countries/${existingCountryId}`)
        .send(updatedCountry)
        .expect(200);
}));
test("update country- name already exists", () => __awaiter(void 0, void 0, void 0, function* () {
    const existingCountryId = "678f827fbde9ee39c111df1a";
    const updatedCountry = {
        name: "Grenada",
        flag: "https://flagcdn.com/w320/gd.png",
        population: 112519,
        region: "Americas",
    };
    const response = yield (0, supertest_1.default)(app_1.default)
        .put(`/countries/${existingCountryId}`)
        .send(updatedCountry)
        .expect(401);
}));
test("update country - id does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
    const existingCountryId = "507f1f77bcf86cd799439011";
    const updatedCountry = {
        name: "123",
        flag: "https://flagcdn.com/w320/gd.png",
        population: 112519,
        region: "Americas",
    };
    const response = yield (0, supertest_1.default)(app_1.default)
        .put(`/countries/${existingCountryId}`)
        .send(updatedCountry)
        .expect(404);
}));
test("update country - missing data", () => __awaiter(void 0, void 0, void 0, function* () {
    const existingCountryId = "678f827fbde9ee39c111df1a";
    const updatedCountry = {
        name: "123"
    };
    const response = yield (0, supertest_1.default)(app_1.default)
        .put(`/countries/${existingCountryId}`)
        .send(updatedCountry)
        .expect(400);
}));
test("delete country", () => __awaiter(void 0, void 0, void 0, function* () {
    const existingCountryId = "678f93bd9bd6225c2afbdad3";
    yield (0, supertest_1.default)(app_1.default)
        .delete(`/countries/${existingCountryId}`)
        .expect(204);
}));
test("delete country - id does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
    const existingCountryId = "507f1f77bcf86cd799439011";
    yield (0, supertest_1.default)(app_1.default)
        .delete(`/countries/${existingCountryId}`)
        .expect(404);
}));
