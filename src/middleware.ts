import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // TODO: Replace with real session validation against Laravel Sanctum/Passport
  // Check for auth token in cookies
  const token = request.cookies.get('tb-token')?.value
  
  if (pathname.startsWith('/console') && !token) {
    // Redirect to login, preserving intended destination
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/console/:path*', '/account/:path*'],
}
