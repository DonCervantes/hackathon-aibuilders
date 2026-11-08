import { describe, expect, it } from "vitest";
import { createHealthHandler } from "./handler";

describe("GET /api/health", () => {
  it("health_endpoint_reports_ok_when_database_answers", async () => {
    const res = await createHealthHandler(async () => {})();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, db: true });
  });

  it("health_endpoint_reports_not_ok_when_database_is_down", async () => {
    const res = await createHealthHandler(async () => {
      throw new Error("connection refused");
    })();
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, db: false });
  });
});
