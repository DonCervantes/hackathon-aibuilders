import { expect, test } from "@playwright/test";

// Needs DATABASE_URL. Without a reachable database the endpoint must say so, not pretend.
test("health endpoint answers with an explicit status", async ({ request }) => {
  const res = await request.get("/api/health");
  const body = await res.json();
  expect([200, 503]).toContain(res.status());
  expect(body.ok).toBe(res.status() === 200);
});
