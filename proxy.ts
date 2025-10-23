/**
 * Proxy/Middleware function that handles CORS configuration for API routes.
 *
 * This middleware inspects request origins and applies CORS headers dynamically
 * based on environment-configured allowed origins, headers, and methods.
 *
 * It sets:
 * - Access-Control-Allow-Origin
 * - Access-Control-Allow-Methods
 * - Access-Control-Allow-Headers
 * - Access-Control-Expose-Headers
 * - Access-Control-Allow-Credentials
 * - Access-Control-Max-Age
 *
 * Applied globally to matching API routes as defined by the `config` export below.
 */

import { NextResponse, type NextRequest } from "next/server";

// CORS configuration loaded from environment variables
const corsOptions: {
  allowedMethods: string[];
  allowedOrigins: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge?: number;
  credentials: boolean;
} = {
  allowedMethods: (process.env.ALLOWED_METHODS || "").split(","),
  allowedOrigins: (process.env.ALLOWED_ORIGIN || "").split(","),
  allowedHeaders: (process.env.ALLOWED_HEADERS || "").split(","),
  exposedHeaders: (process.env.EXPOSED_HEADERS || "").split(","),
  maxAge:
    (process.env.PREFLIGHT_MAX_AGE &&
      parseInt(process.env.PREFLIGHT_MAX_AGE)) ||
    undefined, // optional override (e.g., 2592000 = 30 days)
  credentials: process.env.CREDENTIALS === "true",
};

/**
 * Applies CORS headers to API responses.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Determine request origin
  const origin = request.headers.get("origin") ?? "";

  // Validate origin against allowed list
  if (
    corsOptions.allowedOrigins.includes("*") ||
    corsOptions.allowedOrigins.includes(origin)
  ) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  // Apply default CORS headers
  response.headers.set(
    "Access-Control-Allow-Credentials",
    corsOptions.credentials.toString()
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    corsOptions.allowedMethods.join(",")
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(",")
  );
  response.headers.set(
    "Access-Control-Expose-Headers",
    corsOptions.exposedHeaders.join(",")
  );

  if (corsOptions.maxAge) {
    response.headers.set(
      "Access-Control-Max-Age",
      corsOptions.maxAge.toString()
    );
  }

  return response;
}

// Define which routes this middleware applies to
export const config = {
  matcher: "/api/authenticate",
};
