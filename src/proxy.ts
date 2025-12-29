import type {NextRequest} from "next/dist/server/web/spec-extension/request";
import {NextResponse} from "next/dist/server/web/spec-extension/response";
import { withAuth } from "next-auth/middleware"

const ipRequests = new Map<string, { count: number; resetTime: number }>()

async function rateLimiter(request: NextRequest) {
  const ip = request.nextUrl.origin ?? "127.0.0.1"
  const now = Date.now()
  const windowMs = 1000
  const maxRequests = parseInt(process.env.RATE_LIMIT!)

  const record = ipRequests.get(ip)

  if (!record || now > record.resetTime) {
    ipRequests.set(ip, { count: 1, resetTime: now + windowMs })
  } else if (record.count >= maxRequests) {
    return new NextResponse("Too Many Requests", { status: 429 })
  } else {
    record.count++
  }

  return NextResponse.next()
}

export default withAuth(rateLimiter, {
  callbacks: {
    authorized: ({ token }) => !!token
  },
})

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|logo.png).*)',
  ]
}
