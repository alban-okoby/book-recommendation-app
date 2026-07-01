import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication — redirect to login if no token cookie present.
// Full token validation happens on the API side; middleware just gates the UI.
const PROTECTED = ["/bookings", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const token =
      request.cookies.get("token")?.value ??
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/bookings/:path*", "/admin/:path*"],
};
