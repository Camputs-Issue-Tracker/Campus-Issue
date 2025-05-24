// middleware.ts or middleware.js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

// List of public routes that don't require authentication
const publicRoutes = [
  "/admin-login",
  "/",
  "/forgot-password",
  "/admin-request",
];

// List of protected routes that require admin authentication
const protectedRoutes = ["/dashboard", "/upload-csv", "/admin"];

interface DecodedToken {
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("🔒 Middleware - Checking access for path:", pathname);

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    console.log("✅ Middleware - Public route, allowing access");
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtectedRoute) {
    console.log("✅ Middleware - Non-protected route, allowing access");
    return NextResponse.next();
  }

  // Get token from cookies
  const token = req.cookies.get("token")?.value;
  console.log("🔑 Middleware - Token present:", !!token);

  if (!token) {
    console.log("❌ Middleware - No token found, redirecting to login");
    const loginUrl = new URL("/admin-login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, SECRET) as DecodedToken;
    console.log("✅ Middleware - Token verified for:", decoded.email);

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log("❌ Middleware - Token expired");
      const loginUrl = new URL("/admin-login", req.url);
      loginUrl.searchParams.set("from", pathname);
      loginUrl.searchParams.set("error", "session_expired");
      return NextResponse.redirect(loginUrl);
    }

    // Verify admin role
    if (decoded.role !== "admin") {
      console.log("❌ Middleware - Insufficient permissions");
      const loginUrl = new URL("/admin-login", req.url);
      loginUrl.searchParams.set("error", "insufficient_permissions");
      return NextResponse.redirect(loginUrl);
    }

    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-email", decoded.email);
    requestHeaders.set("x-user-role", decoded.role);

    console.log("✅ Middleware - Access granted to:", pathname);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.log("❌ Middleware - Token verification failed:", error);
    const loginUrl = new URL("/admin-login", req.url);
    loginUrl.searchParams.set("from", pathname);
    loginUrl.searchParams.set("error", "invalid_token");
    return NextResponse.redirect(loginUrl);
  }
}

// Update matcher to explicitly include all protected routes
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    // Explicitly match protected routes
    "/dashboard/:path*",
    "/upload-csv/:path*",
    "/admin/:path*",
  ],
};
