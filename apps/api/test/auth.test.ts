import request from "supertest";
import { beforeEach, afterAll, describe, expect, it } from "vitest";
import app from "../src/app";
import { db } from "../src/config/db";
import { resetDb } from "./helpers/resetDb";

describe("POST /api/auth/register", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("regista um utilizador e devolve tokens", async () => {
    const payload = {
      name: "Teste Automático",
      email: "teste.auto@example.dev",
      password: "password123",
      phone: "1234567",
      location: "Lisboa"
    };

    const response = await request(app).post("/api/auth/register").send(payload);

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({
      email: payload.email,
      name: payload.name
    });
    expect(typeof response.body.accessToken).toBe("string");
    expect(typeof response.body.refreshToken).toBe("string");

    const result = await db.query("SELECT id, email FROM users WHERE email = $1", [payload.email]);
    expect(result.rows).toHaveLength(1);
  });
});

describe("GET /api/users/me", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("devolve o utilizador com token valido", async () => {
    const payload = {
      name: "Teste JWT",
      email: "jwt@example.dev",
      password: "password123",
      phone: "1234567",
      location: "Lisboa"
    };

    const register = await request(app).post("/api/auth/register").send(payload);
    const token = register.body.accessToken;

    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      email: payload.email,
      name: payload.name
    });
  });

  it("recusa pedido sem token", async () => {
    const response = await request(app).get("/api/users/me");
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ message: "Unauthorized" });
  });
});

afterAll(async () => {
  await db.end();
});
