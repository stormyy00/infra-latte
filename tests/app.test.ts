import request from "supertest";
import app from "../src/index";

describe("User API Routes", () => {
  it("GET /api/users returns list of users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it("POST /api/users creates a new user", async () => {
    const newUser = {
      username: "newuser",
      email: "newuser@example.com",
      password: "password123",
      firstName: "New",
      lastName: "User",
    };
    const res = await request(app).post("/api/users").send(newUser);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(newUser));
  });
  it("GET /api/users/:id returns a specific user", async () => {
    const res = await request(app).get("/api/users");
    const users = res.body;
    if (users.length === 0) {
      throw new Error("No users available to test GET /api/users/:id");
    }
    const userId = users[0].id;
    const userRes = await request(app).get(`/api/users/${userId}`);
    expect(userRes.status).toBe(200);
    expect(userRes.body).toEqual(expect.objectContaining({ id: userId }));
  });
});

describe("Images API Routes", () => {
  it("400 when prompt missing/blank", async () => {
    const a = await request(app).post("/api/image").send({});
    expect(a.status).toBe(400);

    const b = await request(app).post("/api/image").send({ prompt: "   " });
    expect(b.status).toBe(400);
  });

  // it("GET /api/image returns ok", async () => {
  //   const res = await request(app).get("/api/image");
  //   expect(res.status).toBe(200);
  //   expect(res.body).toEqual({ message: "Hello World" });
  // });

  // it("POST /api/image validates payload", async () => {
  //   const res = await request(app)
  //     .post("/api/image")
  //     .send({ prompt: "hello", width: 512, height: 512 });

  //   expect(res.status).toBe(200);
  //   expect(res.body).toEqual({ message: "Image generated" });
  // });
});
