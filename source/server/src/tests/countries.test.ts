import request from "supertest";
import app from "../app";
import { STATUS_CODES } from "../constants";
import { createToken } from "../utils/userUtils";
import { IUser } from "../db/types/user";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";

const user: IUser = {
  _id: new Types.ObjectId("67a89f03ce028f8e409929d0"),
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1 123-456-7890",
  profilePicture: "https://example.com/john-doe.jpg",
  userName: "johndoe",
  JoiningDate: new Date(),
  password: "password123",
  role: "Admin",
  authorizationRequests: [],
};
// test("should add a new country", async () => {
//   const token = await createToken(user);
//   await request(app)
//     .post("/countries")
//     .set("Cookie", [`token=${token}`])
//     .send({
//       name: "South Georgilplplpl",
//       flag: "sg",
//       population: 30,
//       region: "Antarctic",
//     })
//     .expect(STATUS_CODES.CREATED);
// });

test("add country - no name sent", async () => {
  const token = await createToken(user);
  await request(app)
    .post("/countries")
    .set("Cookie", [`token=${token}`])
    .send({
      flag: "ca",
      population: 37742154,
      region: "North America",
    })
    .expect(STATUS_CODES.BAD_REQUEST);
});

// test("add country - country already exist", async () => {
//   const token = await createToken(user);
//   await request(app)
//     .post("/countries")
//     .set("Cookie", [`token=${token}`])
//     .send({
//       name: "South Georgia",
//       flag: "https://flagcdn.com/w320/gs.png",
//       population: 30,
//       region: "Antarctic",
//     })
//     .expect(STATUS_CODES.UNAUTHORIZED);
// });

// test("add country - missing details", async () => {
//   const token = await createToken(user);
//   await request(app)
//     .post("/countries")
//     .set("Cookie", [`token=${token}`])
//     .send({
//       name: "ggg",
//     })
//     .expect(STATUS_CODES.BAD_REQUEST);
// });

// test("get all countries", async () => {
//   await request(app).get("/countries").expect(STATUS_CODES.SUCCESS);
// });

// test("get country by id", async () => {
//   const existingCountryId = "67a0a72652d70141bae2f233";
//   const response = await request(app)
//     .get(`/countries/${existingCountryId}`)
//     .expect(STATUS_CODES.SUCCESS);

//   expect(response.body._id.toString()).toBe(existingCountryId.toString());
// });

// test("get country by id - id does not exist", async () => {
//   const existingCountryId = "507f1f77bcf86cd799439011";
//   const response = await request(app)
//     .get(`/countries/${existingCountryId}`)
//     .expect(STATUS_CODES.NOT_FOUND);
// });

// test("get country by id - not an id format", async () => {
//   const existingCountryId = "1";
//   const response = await request(app)
//     .get(`/countries/${existingCountryId}`)
//     .expect(500);
// });

// test("update country", async () => {
//   const token = await createToken(user);
//   const existingCountryId = "67a0a72652d70141bae2f233";
//   const updatedCountry = {
//     name: "Thailand",
//     flag: "https://flagcdn.com/w320/th.png",
//     population: 112519,
//     region: "Americas",
//   };
//   await request(app)
//     .put(`/countries/${existingCountryId}`)
//     .set("Cookie", [`token=${token}`])
//     .send(updatedCountry)
//     .expect(STATUS_CODES.SUCCESS);
// });

// test("update country- name already exists", async () => {
//   const token = await createToken(user);
//   const existingCountryId = "67a0a72652d70141bae2f233";
//   const updatedCountry = {
//     name: "Suriname",
//     flag: "https://flagcdn.com/w320/gd.png",
//     population: 112519,
//     region: "Americas",
//   };
//   await request(app)
//     .put(`/countries/${existingCountryId}`)
//     .set("Cookie", [`token=${token}`])
//     .send(updatedCountry)
//     .expect(STATUS_CODES.CONFLICT);
// });

// test("update country - id does not exist", async () => {
//   const token = await createToken(user);
//   const existingCountryId = "507f1f77bcf86cd799439011";
//   const updatedCountry = {
//     name: "123",
//     flag: "https://flagcdn.com/w320/gd.png",
//     population: 112519,
//     region: "Americas",
//   };
//   const response = await request(app)
//     .put(`/countries/${existingCountryId}`)
//     .set("Cookie", [`token=${token}`])
//     .send(updatedCountry)
//     .expect(STATUS_CODES.NOT_FOUND);
// });

// test("update country - missing data", async () => {
//   const token = await createToken(user);
//   const existingCountryId = "678f827fbde9ee39c111df1a";
//   const updatedCountry = {
//     name: "123",
//   };
//   const response = await request(app)
//     .put(`/countries/${existingCountryId}`)
//     .set("Cookie", [`token=${token}`])
//     .send(updatedCountry)
//     .expect(STATUS_CODES.BAD_REQUEST);
// });

// test("delete country", async () => {
//   const token = await createToken(user);
//   const existingCountryId = "67c567efded479c2e4a604a4";
//   await request(app)
//     .delete(`/countries/${existingCountryId}`)
//     .set("Cookie", [`token=${token}`])
//     .expect(204);
// });

// test("delete country - id does not exist", async () => {
//   const token = await createToken(user);
//   const existingCountryId = "507f1f77bcf86cd799439011";
//   await request(app)
//     .delete(`/countries/${existingCountryId}`)
//     .set("Cookie", [`token=${token}`])
//     .expect(404);
// });
