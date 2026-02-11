import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Only run logic on /success path
    if (request.nextUrl.pathname.startsWith('/success')) {
        const sessionId = request.nextUrl.searchParams.get('session_id');

        // If no session_id, redirect to home
        if (!sessionId) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/success/:path*',
};
