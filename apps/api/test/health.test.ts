import request from "supertest";
import { beforeEach, afterAll, describe, expect, it } from "vitest";
import app from "../src/app";
import { db } from "../src/config/db";
import { resetDb } from "./helpers/resetDb";

describe("GET /health", () => {
  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await db.end();
  });

  it("responde com status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
