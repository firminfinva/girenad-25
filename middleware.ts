import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function middleware(request: NextRequest) {
  // Only protect dashboard and admin routes
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    try {
      // Get token from cookie (localStorage is not accessible in middleware)
      const token = request.cookies.get("token")?.value;

      if (!token) {
        // No token in cookie, let the page handle it (it will check localStorage)
        return NextResponse.next();
      }

      // Verify token structure (just check if it's valid JWT, full verification happens in API)
      try {
        jwt.verify(token, JWT_SECRET);
        // Token is valid, continue
        return NextResponse.next();
      } catch (error) {
        // Token invalid, redirect to login
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
      }
    } catch (error) {
      // Error processing, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
