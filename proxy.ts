import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  
  // Only protect /studio route (Sanity CMS), not /studios
  if (url.pathname === '/studio' || url.pathname.startsWith('/studio/')) {
    const basicAuth = request.headers.get('authorization');
    const studioPassword = process.env.STUDIO_PASSWORD;
    
    // If no password is set, allow access (for development)
    if (!studioPassword) {
      return NextResponse.next();
    }
    
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [, pwd] = atob(authValue).split(':');
      
      if (pwd === studioPassword) {
        return NextResponse.next();
      }
    }
    
    // Return 401 if authentication fails
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="SuperBoss Studio CMS"',
      },
    });
  }
  
  // Allow all other requests (including /studios)
  return NextResponse.next();
}

// Only apply proxy to /studio routes
export const config = {
  matcher: '/studio/:path*',
};

