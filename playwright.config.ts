import { defineConfig } from "@playwright/test";

const port = process.env.UAK_PORT ?? "3000";

export default defineConfig({
  testDir: "./tests",
  reporter: "list",
  use: { baseURL: `http://127.0.0.1:${port}` },
  webServer: {
    command: `npm run build && npm start -- -p ${port}`,
    url: `http://127.0.0.1:${port}/api/health`,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
