import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/*
 * Optimistic gate for the dashboard: bounces requests without a valid session
 * cookie to the login page before anything renders. This only checks the
 * cookie's signature; every admin page, action and route handler also calls
 * requireAdmin() (lib/auth/dal.ts), which checks the database.
 */

const SESSION_COOKIE = 'nv_admin_session';

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ['HS256'] });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/login';
  const signedIn = await hasValidSession(request);

  if (!signedIn && !isLogin) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }
    const url = new URL('/admin/login', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (signedIn && isLogin) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
