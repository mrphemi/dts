import { vi } from "vitest";

vi.mock("hono/bun", () => {
  return {
    serveStatic: () => {
      return async (c: any, next: any) => {
        await next();
      };
    },
  };
});
