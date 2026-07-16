import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country");

  // Redirect all visitors from Vietnam
  if (country === "VN") {
    return NextResponse.redirect("https://buudy.com", 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
