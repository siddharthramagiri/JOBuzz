import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (pathname === "/" || pathname === "/signin") {
    return NextResponse.next();
  }

  // Protect dashboard and other routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/jobs")) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|public|favicon.ico).*)"],
};