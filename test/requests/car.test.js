const request = require("supertest");
const app = require("../../app/index");
require("dotenv").config();

describe("test handleGetCar", () => {
  it("return 200 OK", async () => {
    return request(app)
      .get("/v1/cars/1")
      .set("Content-Type", "application/json")
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});

describe("test handleCreateCar", () => {
  it("return 201 OK", async () => {
    const accessToken = await request(app).post("/v1/auth/login").send({
      email: "audima31@gmail.com",
      password: "123",
    });

    const name = "Mazda RX4";
    const price = 300000;
    const size = "SMALL";
    const image = "https://source.unsplash.com/500x500";

    return request(app)
      .post("/v1/cars")
      .set("Authorization", `Bearer ${accessToken.body.accessToken}`)
      .set("Content-Type", "application/json")
      .send({ name, price, size, image, isCurrentlyRented: false })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
            name,
            price,
            size,
            image,
            isCurrentlyRented: false,
          })
        );
      });
  });
});

describe("test handleListCar", () => {
  it("should response with 200 as status code", async () => {
    return request(app)
      .get("/v1/cars")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            cars: expect.arrayContaining([expect.any(Object)]),
            meta: expect.objectContaining({
              pagination: expect.any(Object),
            }),
          })
        );
      });
  });
});
