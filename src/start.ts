import { createStart, createMiddleware } from "@tanstack/react-start";
import { clerkMiddleware } from "@clerk/tanstack-react-start/server";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    const errString = error?.stack || error?.message || String(error) || "Internal Server Error";
    console.error("Server function error:", errString);
    
    throw error;
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, clerkMiddleware({ allowedClockSkewInMs: 120000, clockSkewInMs: 120000 } as any)],
}));
