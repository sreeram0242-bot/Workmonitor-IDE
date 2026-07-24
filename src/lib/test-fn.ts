import { createServerFn } from "@tanstack/react-start";

export const testFn = createServerFn({ method: "POST" }).handler(async () => {
  throw new Response("Testing error", { status: 400 });
});
