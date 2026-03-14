import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard']
// Routes only for unauthenticated users (redirect to dashboard if already logged in)
const AUTH_ROUTES = ['/login', '/register']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  // Check if route needs protection
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (!isProtected && !isAuthRoute) return res

  try {
    const session = await getSession(req, res)

    // Not logged in → redirect to login
    if (isProtected && !session) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Already logged in → redirect to dashboard
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  } catch {
    // Session error → redirect to login for protected routes
    if (isProtected) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    // Match all routes except static files, _next, and API auth routes
    '/((?!_next/static|_next/image|favicon.ico|api).*)'
  ],
}
