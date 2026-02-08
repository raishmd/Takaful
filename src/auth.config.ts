import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            // Simplified regex since we only use 'ar' or empty (default)
            // But to be safe and robust, let's keep checking for locale prefix logic if needed.
            // The issue might be nextUrl.pathname not having the locale if it was stripped by middleware or something? 
            // Actually, nextUrl is the raw URL.

            // Check if we are on an admin route
            const isOnAdmin = nextUrl.pathname.includes('/admin');
            const isLoginPage = nextUrl.pathname.includes('/login');

            if (isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            } else if (isLoggedIn && isLoginPage) {
                return Response.redirect(new URL('/admin', nextUrl));
            }
            return true;
        },
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    providers: [], // Providers configured in auth.ts
} satisfies NextAuthConfig;
