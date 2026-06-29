import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const publicRoutes = ['/', '/auth/login', '/auth/register'];
const protectedRoutes = ['/profile', '/messages', '/admin', '/inbox', '/search'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if route is public
  const isPublic = publicRoutes.some(route => pathname.startsWith(route) || pathname === route);

  if (isPublic) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Get token from cookies or headers
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ||
                request.cookies.get('token')?.value;

  if (!token) {
    // Redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
