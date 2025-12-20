import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // Get the current URL as the base URL for redirections
  const baseUrl = request.nextUrl.origin;

  if (isAuthPage) {
    if (token) {
      // If user is authenticated and tries to access auth pages, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', baseUrl));
    }
    // Allow access to auth pages for non-authenticated users
    return NextResponse.next();
  }

  if (!token) {
    // If user is not authenticated and tries to access protected pages, redirect to login
    const loginUrl = new URL('/auth/signin', baseUrl);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to protected pages for authenticated users
  return NextResponse.next();
}

// Configure which paths should be protected
export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',
    '/profile/:path*',
    // Auth routes (for redirection if already authenticated)
    '/auth/:path*'
  ]
}; 