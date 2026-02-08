import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { IBM_Plex_Sans_Arabic, Outfit } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'sonner';
import ToastListener from '@/components/ToastListener';
import "../globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
    subsets: ['arabic'],
    variable: '--font-ibm-plex-arabic',
    display: 'swap',
    weight: ['100', '200', '300', '400', '500', '600', '700'],
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
    weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
    title: "Takaful - منظمة التكافل الخيرية",
    description: "منظمة خيرية تعمل على نشر التضامن والمساعدة في الحالات الإنسانية العاجلة",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Takaful",
    },
};

export const viewport: Viewport = {
    themeColor: "#10b981",
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export function generateStaticParams() {
    return routing.locales.map((locale: string) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    // Validate that the incoming `locale` parameter is valid
    if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages({ locale });

    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <html lang={locale} dir={dir} suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
            </head>
            <body className={`min-h-screen ${outfit.variable} ${ibmPlexArabic.variable}`}>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster position="bottom-left" dir={dir} />
                        <ToastListener />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
