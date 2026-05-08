import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // In a real production app with Supabase, we would verify the session token here.
  // Because we are using localStorage for the MVP auth mock, we cannot read it securely in the server/edge middleware.
  // We will allow the request through and let the client-side layout component handle the redirect if unauthenticated.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};