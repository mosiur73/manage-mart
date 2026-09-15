import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const DASHBOARD_ROLES = ["seller", "admin"]

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (!DASHBOARD_ROLES.includes(token.role)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
