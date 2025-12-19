import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let token = null;
  
  // Only validate token if NEXTAUTH_SECRET is set
  if (process.env.NEXTAUTH_SECRET) {
    try {
      token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
    } catch (err: any) {
      // If getToken fails (e.g. token decryption failure), treat user as unauthenticated
      // and log the error so it's easier to troubleshoot JWT/secret issues.
      console.warn('getToken failed:', err);

      const msg = err?.message || '';
      const isDecryptionError = msg.includes('decryption operation failed') || msg.includes('JWEDecryptionFailed') || msg.includes('JWT_SESSION_ERROR');

      // If it's a decryption error, clear session cookies (both secure and non-secure names)
      if (isDecryptionError) {
        // If this is an API request, return 401 and clear cookies on the response
        if (pathname.startsWith('/api')) {
          const res = NextResponse.json(
            { success: false, error: 'Invalid session' },
            { status: 401 }
          );
          try {
            res.cookies.delete('next-auth.session-token');
            res.cookies.delete('__Secure-next-auth.session-token');
          } catch {}
          return res;
        }

        // For page navigations redirect to login and clear cookies
        const res = NextResponse.redirect(new URL('/auth/login', request.url));
        try {
          res.cookies.delete('next-auth.session-token');
          res.cookies.delete('__Secure-next-auth.session-token');
        } catch {}
        return res;
      }

      token = null;
    }
  }
  // If NEXTAUTH_SECRET is not set, token remains null but we allow requests to pass through
  // The client-side SessionProvider will handle authentication

  // Rutas públicas (sin autenticación requerida)
  const publicRoutes = ['/auth/login', '/auth/register'];
  // always allow NextAuth API endpoints so signing in/out/registering works
  const isAuthApi = pathname.startsWith('/api/auth');
  if (isAuthApi) {
    return NextResponse.next();
  }
  if (publicRoutes.includes(pathname)) {
    // Si ya está autenticado, redirigir al home
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Rutas privadas (requieren autenticación)
  // Features are public for viewing; components handle action authorization
  const privateRoutes = ['/api'];
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route)) && !isAuthApi;

  // Only enforce strict auth for API routes if NEXTAUTH_SECRET is set
  if (isPrivateRoute && process.env.NEXTAUTH_SECRET && !token) {
    // For API requests respond with 401
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // All other routes are allowed to pass through
  // Client-side SessionProvider will handle authorization

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
