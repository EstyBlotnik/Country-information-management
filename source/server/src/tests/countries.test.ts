import request from "supertest";
import app from "../app";

test("should add a new country", async () => {
  await request(app)
    .post("/countries")
    .send({
      name: { common: "South Georgia" },
      flag: "sg",
      population: 30,
      region: "Antarctic",
    })
    .expect(201);
});

test("add country - no name sent", async () => {
  await request(app)
    .post("/countries")
    .send({
      flag: "ca",
      population: 37742154,
      region: "North America",
    })
    .expect(400);
});

test("add country - country already exist", async () => {
  await request(app)
    .post("/countries")
    .send({
      name: { common: "South Georgia" },
      flag: "https://flagcdn.com/w320/gs.png",
      population: 30,
      region: "Antarctic",
    })
    .expect(401);
});

test("add country - missing details", async () => {
  await request(app)
    .post("/countries")
    .send({
      name: { common: "ggg" },
    })
    .expect(400);
});

test("get all countries", async () => {
  await request(app).get("/countries").expect(200);
});

test("get country by id", async () => {
  const existingCountryId = "678f834037a891f2168c0002";
  const expectedCountry = {
    _id: existingCountryId,
    name: "South Georgia",
    flag: "https://flagcdn.com/w320/gs.png",
    population: 30,
    region: "Antarctic",
  };
  const response = await request(app)
    .get(`/countries/${existingCountryId}`)
    .expect(200);

  expect(response.body).toMatchObject(expectedCountry);
});

test("get country by id - id does not exist", async () => {
  const existingCountryId = "507f1f77bcf86cd799439011";
  const response = await request(app)
    .get(`/countries/${existingCountryId}`)
    .expect(404);
});

test("get country by id - not an id format", async () => {
  const existingCountryId = "1";
  const response = await request(app)
    .get(`/countries/${existingCountryId}`)
    .expect(500);
});

test("update country", async () => {
  const existingCountryId = "678f827fbde9ee39c111df1a";
  const updatedCountry = {
    name: { common: "Grenada" },
    flag: "https://flagcdn.com/w320/gd.png",
    population: 112519,
    region: "Americas",
  };
  const response = await request(app)
    .put(`/countries/${existingCountryId}`)
    .send(updatedCountry)
    .expect(200);
});

test("update country- name already exists", async () => {
  const existingCountryId = "678f827fbde9ee39c111df1a";
  const updatedCountry = {
    name: "Grenada",
    flag: "https://flagcdn.com/w320/gd.png",
    population: 112519,
    region: "Americas",
  };
  const response = await request(app)
    .put(`/countries/${existingCountryId}`)
    .send(updatedCountry)
    .expect(401);
});

test("update country - id does not exist", async () => {
  const existingCountryId = "507f1f77bcf86cd799439011";
  const updatedCountry = {
    name: "123",
    flag: "https://flagcdn.com/w320/gd.png",
    population: 112519,
    region: "Americas",
  };
  const response = await request(app)
    .put(`/countries/${existingCountryId}`)
    .send(updatedCountry)
    .expect(404);
});

test("update country - missing data", async () => {
  const existingCountryId = "678f827fbde9ee39c111df1a";
  const updatedCountry = {
    name: "123"
  };
  const response = await request(app)
    .put(`/countries/${existingCountryId}`)
    .send(updatedCountry)
    .expect(400);
});

test("delete country", async () => {
    const existingCountryId = "678f93bd9bd6225c2afbdad3";
    await request(app)
      .delete(`/countries/${existingCountryId}`)
      .expect(204);
});

test("delete country - id does not exist", async () => {
    const existingCountryId = "507f1f77bcf86cd799439011";
    await request(app)
      .delete(`/countries/${existingCountryId}`)
      .expect(404);
});