import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter for Edge Runtime
// Note: This resets on every deployment/restart and isn't shared across regions
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 50; // Max 50 requests
const WINDOW = 60 * 1000; // per 1 minute

function isRateLimited(ip: string) {
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - rateData.lastReset > WINDOW) {
        rateData.count = 1;
        rateData.lastReset = now;
    } else {
        rateData.count++;
    }

    rateLimitMap.set(ip, rateData);
    return rateData.count > LIMIT;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const ip = request.ip || 'anonymous';

    // 1. Rate Limiting for sensitive APIs
    if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/orders')) {
        if (isRateLimited(ip)) {
            return new NextResponse(
                JSON.stringify({ error: 'Too many requests. Please try again later.' }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    // 2. Admin Route Protection
    if (pathname.startsWith('/admin')) {
        const adminToken = request.cookies.get('admin_token')?.value;

        // Skip check for login and setup pages
        if (pathname === '/admin/login' || pathname === '/admin/setup') {
            if (adminToken) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.next();
        }

        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
};
