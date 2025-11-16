import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  
  // Protect /studio route with Basic Auth
  if (url.pathname.startsWith('/studio')) {
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
  
  // Allow all other requests
  return NextResponse.next();
}

// Apply proxy to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

