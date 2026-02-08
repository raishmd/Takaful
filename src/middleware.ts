import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { authConfig } from './auth.config';
import NextAuth from 'next-auth';

const intlMiddleware = createMiddleware(routing);

const { auth } = NextAuth(authConfig);

export default auth(intlMiddleware);

export const config = {
    // Catch only localizable paths (those without dots/extensions and not API/Next internal)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
