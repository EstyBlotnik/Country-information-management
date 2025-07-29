import request from "supertest";
import app from "../app";
import { STATUS_CODES } from "../constants";
import { createToken } from "../utils/userUtils";
import { IUser } from "../db/types/user";
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
  role: "Edit",
  authorizationRequests: [],
};

test("should add a new city", async () => {
  const token = await createToken(user);
  await request(app)
    .post("/cities")
    .set("Cookie", [`token=${token}`])
    .send({
      name: "New York",
      countryId: "67a0a72652d70141bae2f233",
    })
    .expect(STATUS_CODES.CREATED);
});

test("add city - no name sent", async () => {
  const token = await createToken(user);
  await request(app)
    .post("/cities")
    .set("Cookie", [`token=${token}`])
    .send({
      countryId: "67a0a72652d70141bae2f233",
    })
    .expect(STATUS_CODES.BAD_REQUEST);
});

test("get all cities", async () => {
  await request(app).get("/cities").expect(STATUS_CODES.SUCCESS);
});

test("get city by id", async () => {
  const existingCityId = "679f17c5cd7cf4afebaea7b1";
  const response = await request(app)
    .get(`/cities/${existingCityId}`)
    .expect(STATUS_CODES.SUCCESS);
  expect(response.body._id.toString()).toBe(existingCityId.toString());
});

test("get city by id - id does not exist", async () => {
  const nonExistingCityId = "507f1f77bcf86cd799439011";
  await request(app)
    .get(`/cities/${nonExistingCityId}`)
    .expect(STATUS_CODES.NOT_FOUND);
});

test("update city", async () => {
  const token = await createToken(user);
  const existingCityId = "679f17c5cd7cf4afebaea7b1";
  const updatedCity = { name: "Vatican City" };
  await request(app)
    .put(`/cities/${existingCityId}`)
    .set("Cookie", [`token=${token}`])
    .send(updatedCity)
    .expect(STATUS_CODES.SUCCESS);
});

// test("delete city", async () => {
//   const token = await createToken(user);
//   const existingCityId = "679f17c5cd7cf4afebaea877";
//   await request(app)
//     .delete(`/cities/${existingCityId}`)
//     .set("Cookie", [`token=${token}`])
//     .send({ countryId: "67a0a72652d70141bae2f233" })
//     .expect(204);
// });

test("delete city - id does not exist", async () => {
  const token = await createToken(user);
  const nonExistingCityId = "507f1f77bcf86cd799439011";
  await request(app)
    .delete(`/cities/${nonExistingCityId}`)
    .set("Cookie", [`token=${token}`])
    .expect(404);
});
